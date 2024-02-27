import pg from 'pg';
import dotenv from 'dotenv'

dotenv.config();

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    idleTimeoutMillis: 0,
    max: parseInt(process.env.POOL_SIZE || '10'),
    min: 10,
});

const poolConnect = async () => {
    return await pool.connect();
}

const poolRelease = (client) => {
    if (client) {
        client.release();
    }
}

export { poolConnect, poolRelease };