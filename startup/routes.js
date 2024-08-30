import home from '../routes/home.js';
import products from '../routes/products.js';
import orders from '../routes/orders.js';

const routes = (app) => {
  app.use('/api', home);
  app.use('/api/products', products);
  app.use('/api/orders', orders);
};

export default routes;