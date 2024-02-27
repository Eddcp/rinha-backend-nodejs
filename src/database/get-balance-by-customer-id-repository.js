
export const getBalanceByCustomerId = async (customerId, client) => {
    if (!client) {
        throw new Error('Client not passed');
    }
    const balance = await client.query(
        'SELECT * FROM balances WHERE customer_id = $1 FOR UPDATE', [customerId]
    );

    return balance.rows[0].amount;

}