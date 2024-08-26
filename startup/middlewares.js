import cors from 'cors';
import helmet from 'helmet';
import errors from '../middlewares/errorMiddleware.js';
import express from 'express';

const middlewares = (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use(errors);
};

export default middlewares;