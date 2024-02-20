export const createTransfer = async ({ customerId, amount, operationType, description }, client) => {
    await client.query(
        'INSERT INTO transactions (customer_id, amount, transaction_type, description) VALUES($1, $2, $3, $4)',
        [customerId, amount, operationType, description]
    );
}