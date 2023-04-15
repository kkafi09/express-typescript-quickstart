import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'This service is running properly.' });
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
