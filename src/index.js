import Fastify from 'fastify'
import { apiRoutes } from "./routes/index.js";

const fastify = Fastify({
    logger: true
})

// Declare routes
fastify.register(apiRoutes)
fastify.setErrorHandler((error, request, reply) => {
    if (error?.notFoundError) {
        reply.status(404).send({
            error: error.message
        });
        return;
    }

    if (error?.unprocessableEntity) {
        reply.status(422).send({
            error: error.message
        });
        return;
    }
    reply.send(error);
});

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})

async function closeGracefully(signal) {
    console.log(`*^!@4=> Received signal to terminate: ${signal}`)

    await fastify.close()
    // await db.close() if we have a db connection in this app
    // await other things we should cleanup nicely
    process.kill(process.pid, signal);
}
process.once('SIGINT', closeGracefully)
process.once('SIGTERM', closeGracefully)