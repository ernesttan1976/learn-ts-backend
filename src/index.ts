import express, { Request, Response } from 'express';
import { prisma } from './db';

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.json({});
})

async function start() {
    try {
        const [result] = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
        if (Number(result.ok) !== 1) {
            throw new Error('Unexpected database health check result');
        }
    } catch {
        console.error('Database connection check failed; server was not started.');
        await prisma.$disconnect();
        process.exitCode = 1;
        return;
    }

    console.log('Connected to PostgreSQL.');
    const server = app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });

    let shuttingDown = false;
    const shutdown = () => {
        if (shuttingDown) return;
        shuttingDown = true;
        server.close(() => {
            void prisma.$disconnect();
        });
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
}

void start();