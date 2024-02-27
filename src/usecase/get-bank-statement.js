import getCustomerById from "../database/get-customer-by-id-repository.js";
import { poolConnect, poolRelease } from "../database/pool-config.js";
import { getLastTenTransactions } from "../database/get-last-ten-transactions.js";
import { getBalanceByCustomerId } from "../database/get-balance-by-customer-id-repository.js";

export const getBankStatement = async ({ id }) => {
    const client = await poolConnect();
    // 1st query
    const customer = await getCustomerById(id, client);
    if (!customer) {
        const err = new Error('Customer not found');
        err.notFoundError = true;
        throw err;
    }

    // 2nd query
    const balance = await getBalanceByCustomerId(customer.id, client);

    // 3rd query
    const transactions = await getLastTenTransactions(customer.id, client);

    const mappedTransactions = transactions.map(transaction => {
        return {
            valor: transaction.amount,
            tipo: transaction.transaction_type,
            descricao: transaction.description,
            realizada_em: new Date(transaction.date).toISOString()
        }
    });

    poolRelease(client);

    return {
        ultimas_transacoes: mappedTransactions,
        saldo: {
            total: balance,
            limite: customer.limit_amount,
            data_extrato: new Date().toISOString()
        }
    }

}