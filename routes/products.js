import { Router } from 'express';
import prisma from '../prisma/database.js';
import Decimal from 'decimal.js';

const router = Router();

router.get('/', async (_, res) => {
  const products = await prisma.product.findMany();
  res.send(products);
});

router.post('/', async (req, res) => {
  const { name, price, stock } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price: new Decimal(price),
      stock: new Decimal(stock)
    }
  });

  res.status(201).send(product);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(404).send('Product not found');

  const existingProduct = await prisma.product.findFirst({ where: { id } });
  if (!existingProduct) return res.status(404).send('Product not found');

  const { name, price, stock } = req.body;

  const product = await prisma.product.update({ where: { id }, data: { name, price: new Decimal(price), stock: new Decimal(stock) } });

  res.send(product);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(404).send('Product not found');

  const existingProduct = await prisma.product.findFirst({ where: { id } });
  if (!existingProduct) return res.status(404).send('Product not found');

  const product = await prisma.product.delete({ where: { id } });

  res.send(product);
});

export default router;