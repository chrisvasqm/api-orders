import express from 'express';
import 'express-async-errors';
import middlewares from './startup/middlewares.js';
import routes from './startup/routes.js';

const app = express();

// Node Global Error Handlers
process.on('uncaughtException', exception => {
  console.error('Uncaught Exception: ', exception.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Promise Rejection at: ${promise} | Reason: ${promise}`);
});

middlewares(app);
routes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sever listening on http://localhost:${PORT}`));