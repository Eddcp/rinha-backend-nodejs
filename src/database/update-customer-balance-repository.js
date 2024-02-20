// Purpose: Update the balance of a customer in the database.
export const updateCustomerBalance = async (amount, customerId, client) => {
    await client.query(
        'UPDATE balances SET amount = $1 WHERE customer_id = $2', [amount, customerId]
    );
}