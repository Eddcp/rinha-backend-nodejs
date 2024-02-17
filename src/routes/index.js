import {clientRoutes} from "./clients/index.js";

const apiRoutes = async (app, options) => {
    app.register(clientRoutes, { prefix: 'clientes' })
    app.get('/', async (request, reply) => {
        return {
            message: 'Fastify API is on fire'
        }
    })
}

export { apiRoutes }
