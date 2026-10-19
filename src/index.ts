import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
    res.json({});
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})