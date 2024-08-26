import home from '../routes/home.js';
import products from '../routes/products.js';

const routes = (app) => {
  app.use('/api', home);
  app.use('/api/products', products);
};

export default routes;