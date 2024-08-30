import prisma from '../prisma/database.js';

const validateProducts = async (req, res, next) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).send('Invalid products array');
  }

  try {
    const validatedProducts = await Promise.all(products.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) throw new Error(`Product not found: ${item.productId}`);

      if (product.stock < item.quantity) throw new Error(`Insufficient stock for product: ${item.productId}`);

      return { ...product, orderedQuantity: item.quantity };
    }));

    req.validatedProducts = validatedProducts;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export default validateProducts;