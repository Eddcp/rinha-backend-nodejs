import { getCustomerById }from "../database/get-customer-by-id-repository.js";
import { getBalanceByCustomerId } from "../database/get-balance-by-customer-id-repository.js";
import { poolConnect, poolRelease } from "../database/pool-config.js";
import { updateCustomerBalance } from "../database/update-customer-balance-repository.js";
import {createTransfer} from "../database/create-transfer-repository.js";

export const executeTransfer = async ({ id, amount, operationType, description }) => {
    // Using the same pool for the transaction
    const client = await poolConnect();
    try {
        await client.query('BEGIN')
        // 1st query
        const customer = await getCustomerById(id, client);
        if (!customer) {
            const err = new Error('Customer not found');
            err.notFoundError = true;
            throw err;
        }

        // 2nd query
        const balance = await getBalanceByCustomerId(customer.id, client);
        if (operationType === 'd' && balance - amount < (customer.limit_amount * -1) ) {
            const err = new Error('Insufficient funds');
            err.unprocessableEntity = true;
            throw err;
        }

        const newBalance = operationType === 'c' ? balance + amount : balance - amount;

        // 3rd query
        await updateCustomerBalance(newBalance, customer.id, client);

        // 4th query
        await createTransfer({ customerId: customer.id, amount, operationType, description }, client);
        await client.query('COMMIT');
        console.log( 'test');
        return { newBalance, limit: customer.limit_amount };
    } catch (error) {
        await client.query('ROLLBACK')
        throw error;
    } finally {
        poolRelease(client);
    }

}
