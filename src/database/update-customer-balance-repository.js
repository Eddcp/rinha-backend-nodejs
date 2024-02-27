// Purpose: Update the balance of a customer in the database.
export const updateCustomerBalance = async (amount, customerId, operationType, client) => {
    if (!client) {
        throw new Error('Client not passed');
    }

    const sqlQuery = operationType === 'c' ? 'UPDATE balances SET amount = amount + $1 WHERE customer_id = $2'
        : 'UPDATE balances SET amount = amount - $1 WHERE customer_id = $2';
    await client.query(
        sqlQuery, [amount, customerId]
    );
}