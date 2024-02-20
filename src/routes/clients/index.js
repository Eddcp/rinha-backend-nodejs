import { executeTransfer } from "../../usecase/execute-transfer.js";

const clientRoutes = async (app, options) => {
    app.post('/:id/transacoes', async (request, reply) => {
        const { params } = request;
        const { id } = params;
        const { valor: amount, tipo: operationType, descricao: description } = request.body;
        const { newBalance, limit } = await executeTransfer({id, amount, operationType, description});
        reply.status(200).send({
            limite: limit,
            saldo: newBalance
        })
    })
    app.get('/:id/extrato', async (request, reply) => {
        return {
            message: 'extrato'
        }
    });
}

export { clientRoutes }