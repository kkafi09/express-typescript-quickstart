import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './helpers/logger';
import wrapper from './helpers/wrapper';

import userApi from './api/user';

dotenv.config();

const app = express();

app.use('/public', express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(helmet());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.log('error-api', err.message, 'error');

  return wrapper.response(res, 'fail', null, 'Internal Server Error', 500);
});

app.get('/', (_req, res) => {
  return wrapper.response(res, 'success', null, 'This service is running properly!');
});

app.use('/user', userApi);

export default app;
