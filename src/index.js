// Require the framework and instantiate it

// ESM
import Fastify from 'fastify'
import {apiRoutes} from "./routes/index.js";

const fastify = Fastify({
    logger: true
})

// Declare a route
fastify.register(apiRoutes)

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})