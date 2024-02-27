import { getCustomerById }from "../database/get-customer-by-id-repository.js";
import { getBalanceByCustomerId } from "../database/get-balance-by-customer-id-repository.js";
import { poolConnect, poolRelease } from "../database/pool-config.js";
import { updateCustomerBalance } from "../database/update-customer-balance-repository.js";
import {createTransfer} from "../database/create-transfer-repository.js";


const isInt = (n) => {
    return Number(n) === n && n % 1 === 0;
}

const validateCustomer = (customer) => {
    if (!customer) {
        const err = new Error('Customer not found');
        err.notFoundError = true;
        throw err;
    }
}

const validateCustomerLimit = (customer, operationType, customerBalance, amount) => {
    const limitAmount = customer.limit_amount * - 1;
    if (operationType === 'd' && customerBalance - amount < limitAmount ) {
        const err = new Error('Insufficient funds');
        err.unprocessableEntity = true;
        throw err;
    }
}

const validateDescription = (description) => {
    if (!description) {
        const err = new Error('Description is required');
        err.unprocessableEntity = true;
        throw err;
    }
    if (description.length > 10) {
        const err = new Error('Description must be less or equal to 10 characters');
        err.unprocessableEntity = true;
        throw err;
    }
}

const validateOperationType = (operationType) => {
    if (operationType !== 'c' && operationType !== 'd') {
        const err = new Error('Operation type not allowed');
        err.unprocessableEntity = true;
        throw err;
    }
}

const validateAmount = (amount) => {
    if (amount <= 0) {
        const err = new Error('Amount must be greater than 0');
        err.unprocessableEntity = true;
        throw err;
    }

    if (!isInt(amount)) {
        const err = new Error('Amount must be an integer');
        err.unprocessableEntity = true;
        throw err;
    }
}

const validateFields = ({ amount, operationType, description }) => {
    validateDescription(description);
    validateOperationType(operationType);
    validateAmount(amount);
}

export const executeTransfer = async ({ id, amount, operationType, description }) => {
    validateFields({ amount, operationType, description})
    // Using the same pool for the transaction
    const client = await poolConnect();
    try {
        await client.query('BEGIN')
        // 1st query
        const customer = await getCustomerById(id, client);
        validateCustomer(customer)

        // 2nd query
        const balance = await getBalanceByCustomerId(customer.id, client);
        validateCustomerLimit(customer, operationType, balance, amount);

        // 3rd query
        await updateCustomerBalance(amount, customer.id, operationType, client);

        // 4th query
        const newBalance = await getBalanceByCustomerId(customer.id, client);

        // 5th query
        await createTransfer({ customerId: customer.id, amount, operationType, description }, client);
        await client.query('COMMIT');
        return { newBalance, limit: customer.limit_amount };
    } catch (error) {
        await client.query('ROLLBACK')
        throw error;
    } finally {
        poolRelease(client);
    }

}
