
export const getLastTenTransactions = async (customerId, client) => {
    if (!client) {
        throw new Error('Client not passed');
    }
    const transactions = await client.query(
        `
        SELECT amount, transaction_type, description, date
        FROM transactions
        WHERE transactions.customer_id = $1
        ORDER BY date DESC
        LIMIT 10
        `, [customerId]
    );

    return transactions.rows;

}