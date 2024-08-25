import home from '../routes/home.js';

const routes = (app) => {
  app.use('/api', home);
};

export default routes;