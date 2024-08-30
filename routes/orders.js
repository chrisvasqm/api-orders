import { Router } from 'express';
import prisma from '../prisma/database.js';
import validateProducts from '../middlewares/validateProducts.js';

const router = Router();

router.get('/', async (_, res) => {
  const orders = await prisma.order.findMany({ include: { OrderItem: true } });
  res.send(orders);
});

router.post('/', validateProducts, async (req, res) => {
  const validatedProducts = req.validatedProducts;

  const order = await prisma.order.create({
    data: {
      total: validatedProducts.reduce((total, product) => total + product.price * product.orderedQuantity, 0),
      OrderItem: {
        create: validatedProducts.map(product => ({
          productId: product.id,
          quantity: product.orderedQuantity
        }))
      }
    },
    include: {
      OrderItem: {
        include: {
          product: true
        }
      }
    }
  });

  await Promise.all(validatedProducts.map(product => {
    prisma.product.update({
      where: { id: product.id },
      data: { stock: product.stock - product.orderedQuantity },
    })
  }));

  res.status(201).send(order);
});

export default router;