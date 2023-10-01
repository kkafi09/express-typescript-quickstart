import dotenv from 'dotenv';
import app from './app';
import logger from './helpers/logger';

dotenv.config();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  const ctx = 'app-listen';
  logger.log(ctx, `This service is running properly on port ${port}`, 'initiate application');
});
