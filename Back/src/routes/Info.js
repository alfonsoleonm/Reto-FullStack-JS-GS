// Back/src/routes/info.js
import { Router } from 'express';
import Info from '../models/info.js';

const router = Router();

const ALLOWED = ['TEMP', 'HUM'];
const RANGES = { TEMP: { min: 10, max: 25 }, HUM: { min: 30, max: 70 } };
const inRange = (sensor, value) => {
  const r = RANGES[sensor]; return r ? value >= r.min && value <= r.max : false;
};
const parseISO = (s) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? null : d; };

// POST /api/info
router.post('/info', async (req, res) => {
  try {
    const { sensor, value, date } = req.body;

    if (!ALLOWED.includes(sensor)) {
      return res.status(400).json({ message: 'sensor inválido (TEMP|HUM)' });
    }
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return res.status(400).json({ message: 'value debe ser number' });
    }
    if (!inRange(sensor, value)) {
      return res.status(422).json({
        message: `value fuera de rango para ${sensor} (${RANGES[sensor].min}–${RANGES[sensor].max})`
      });
    }

    const doc = await Info.create({
      sensor,
      value,
      ...(date ? { date: parseISO(date) ?? undefined } : {})
    });

    return res.status(201).json(doc);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/info
 * Soporta:
 *  - ?minutes=15
 *  - ?sensor=TEMP&from=2025-01-01T00:00:00Z&to=...
 *  - ?limit=1000&skip=0
 *  - ?aggregate=avg1m    (promedio por minuto, opcional)
 */
router.get('/info', async (req, res) => {
  try {
    const { minutes, sensor, from, to, limit = '1000', skip = '0', aggregate } = req.query;

    const match = {};
    if (sensor) {
      if (!ALLOWED.includes(sensor)) {
        return res.status(400).json({ message: 'sensor inválido (TEMP|HUM)' });
      }
      match.sensor = sensor;
    }

    if (minutes) {
      const m = Number(minutes);
      if (!Number.isFinite(m) || m <= 0) return res.status(400).json({ message: 'minutes inválido' });
      match.date = { $gte: new Date(Date.now() - m * 60_000) };
    } else if (from || to) {
      const gte = from ? parseISO(from) : null;
      const lte = to ? parseISO(to) : null;
      if ((from && !gte) || (to && !lte)) return res.status(400).json({ message: 'from/to inválidos (ISO-8601)' });
      match.date = {};
      if (gte) match.date.$gte = gte;
      if (lte) match.date.$lte = lte;
    }

    const lim = Math.min(Math.max(parseInt(limit, 10) || 1000, 1), 10000);
    const skp = Math.max(parseInt(skip, 10) || 0, 0);

    if (aggregate === 'avg1m') {
      const pipeline = [
        { $match: match },
        {
          $group: {
            _id: {
              sensor: '$sensor',
              minute: { $dateTrunc: { date: '$date', unit: 'minute' } },
            },
            avgValue: { $avg: '$value' },
            count: { $sum: 1 },
          }
        },
        { $project: { _id: 0, sensor: '$_id.sensor', date: '$_id.minute', value: '$avgValue', count: 1 } },
        { $sort: { date: 1 } },
        { $skip: skp },
        { $limit: lim }
      ];
      const data = await Info.aggregate(pipeline);
      return res.json(data);
    }

    const data = await Info.find(match).sort({ date: 1 }).skip(skp).limit(lim).lean();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
