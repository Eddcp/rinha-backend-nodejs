const clientRoutes = async (app, options) => {
    app.post('/:id/transacoes', async (request, reply) => {
        return {
            message: 'transacoes'
        }
    })
    app.get('/:id/extrato', async (request, reply) => {
        return {
            message: 'extrato'
        }
    });
}

export { clientRoutes }