import { executeTransfer } from "../../usecase/execute-transfer.js";
import {getBankStatement} from "../../usecase/get-bank-statement.js";

const clientRoutes = async (app, _options) => {
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
        const { params } = request;
        const { id } = params;

        const result = await getBankStatement({ id });
        reply.status(200).send(result);
    });
}

export { clientRoutes }