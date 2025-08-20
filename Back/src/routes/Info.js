// src/routes/info.js  (ESM)
import { Router } from 'express';
import datosSchema from '../models/info.js';

const router = Router();

router.post('/info', async (req, res) => {
  try {
    const dato = await datosSchema.create(req.body);
    res.json(dato);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/info', async (_req, res) => {
  try {
    const data = await datosSchema.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;