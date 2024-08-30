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

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(404).send('Order not found');

  const order = await prisma.order.findUnique({
    where: {
      id
    },
    include: { OrderItem: { include: { product: true } } }
  });

  if (!order) return res.status(404).send('Order not found');

  res.send(order);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(404).send('Order not found');

  const order = await prisma.order.findUnique({ where: { id } });

  if (!order) return res.status(404).send('Order not found');

  await prisma.order.delete({ where: { id } });

  res.send(order);
});

export default router;