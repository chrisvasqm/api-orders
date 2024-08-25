import cors from 'cors';
import helmet from 'helmet';
import errors from '../middlewares/errorMiddleware.js';

const middlewares = (app) => {
  app.use(cors());
  app.use(helmet());

  app.use(errors);
};

export default middlewares;