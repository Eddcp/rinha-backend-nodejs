export const getCustomerById = async (id, client) => {
    if (!client) {
        throw new Error('Client not passed');
    }

    const customer = await client.query(
        'SELECT * FROM customers WHERE id = $1', [id]
    );

    return customer.rows[0];

}

export default getCustomerById;