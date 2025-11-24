const express = require('express');
const router = express.Router();
const ReconstructionSnapshot = require('../models/ReconstructionSnapshot');
const BuildingSpec = require('../models/BuildingSpec');
const { writeLimiter, heavyLimiter } = require('../middleware/rateLimiter');
const diffCache = require('../utils/diffCache');

// List snapshots (optional year filter)
router.get('/', async (req, res) => {
  try {
    const { year } = req.query;
    const query = year ? { year: Number(year) } : {};
    const snaps = await ReconstructionSnapshot.find(query).populate('specRefs');
    res.json(snaps);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Diff endpoint: compare two snapshots (spec membership & basic spec deltas)
// GET /api/reconstructions/diff?from=<id>&to=<id>
// MUST come before /:id route
router.get('/diff', heavyLimiter, async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'from and to snapshot IDs required' });

    // Check cache first
    const cached = diffCache.get(from, to);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const [fromSnap, toSnap] = await Promise.all([
      ReconstructionSnapshot.findById(from).populate('specRefs'),
      ReconstructionSnapshot.findById(to).populate('specRefs')
    ]);
    if (!fromSnap || !toSnap) return res.status(404).json({ error: 'Snapshot(s) not found' });

    const fromIds = new Set(fromSnap.specRefs.map(s => String(s._id)));
    const toIds = new Set(toSnap.specRefs.map(s => String(s._id)));

    const addedIds = [...toIds].filter(id => !fromIds.has(id));
    const removedIds = [...fromIds].filter(id => !toIds.has(id));
    const unchangedIds = [...toIds].filter(id => fromIds.has(id));

    // Optionally load BuildingSpec minimal info for added/removed
    const [addedSpecs, removedSpecs] = await Promise.all([
      BuildingSpec.find({ _id: { $in: addedIds } }, { name: 1, yearConstructed: 1, yearCompleted: 1, architecturalStyle: 1 }).lean(),
      BuildingSpec.find({ _id: { $in: removedIds } }, { name: 1, yearConstructed: 1, yearCompleted: 1, architecturalStyle: 1 }).lean()
    ]);

    // Field-level changes for unchanged specs (subset of fields)
    const fieldsToCheck = [
      'architecturalStyle',
      'height.roofHeight_m',
      'height.stories',
      'status'
    ];
    const fromMap = new Map(fromSnap.specRefs.map(s => [String(s._id), s]));
    const toMap = new Map(toSnap.specRefs.map(s => [String(s._id), s]));
    const changedSpecs = [];
    unchangedIds.forEach(id => {
      const a = fromMap.get(id);
      const b = toMap.get(id);
      const changes = {};
      fieldsToCheck.forEach(f => {
        // drill into dot path
        const getVal = (obj, path) => path.split('.').reduce((acc, part) => acc ? acc[part] : undefined, obj);
        const va = getVal(a, f);
        const vb = getVal(b, f);
        if (va !== vb) changes[f] = { from: va ?? null, to: vb ?? null };
      });
      if (Object.keys(changes).length) {
        changedSpecs.push({ id, name: b.name, changes });
      }
    });

    const result = {
      from: { id: fromSnap._id, year: fromSnap.year, label: fromSnap.label, count: fromSnap.specRefs.length },
      to: { id: toSnap._id, year: toSnap.year, label: toSnap.label, count: toSnap.specRefs.length },
      summary: {
        added: addedIds.length,
        removed: removedIds.length,
        unchanged: unchangedIds.length,
        changed: changedSpecs.length
      },
      addedSpecs,
      removedSpecs,
      changedSpecs,
      cached: false
    };

    // Cache the result
    diffCache.set(from, to, result);

    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Auto-generate snapshot from BuildingSpec filters
// POST /api/reconstructions/auto-generate?year=1905&style=Beaux-Arts&beforeYear=1906
// MUST come before /:id route
router.post('/auto-generate', heavyLimiter, async (req, res) => {
  try {
    const merged = { ...req.query, ...req.body };
    const { year, style, status, beforeYear, label, description } = merged;
    if (!year) return res.status(400).json({ error: 'year parameter required' });

    const specQuery = {};
    if (style) specQuery.architecturalStyle = { $regex: style, $options: 'i' };
    if (status) specQuery.status = status;
    const cutoff = beforeYear ? Number(beforeYear) : Number(year);
    specQuery.$or = [
      { yearCompleted: { $lte: cutoff } },
      { yearConstructed: { $lte: cutoff } }
    ];

    const specs = await BuildingSpec.find(specQuery, { _id: 1 }).lean();
    const specIds = specs.map(s => s._id);

    const snap = new ReconstructionSnapshot({
      year: Number(year),
      label: label || `Auto ${year}`,
      description: description || 'Automatically generated snapshot from filters',
      specRefs: specIds,
      methodology: 'Auto-generated from BuildingSpec filters'
    });
    await snap.save();
    res.status(201).json({ id: snap._id, count: specIds.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get single snapshot
router.get('/:id', async (req, res) => {
  try {
    const snap = await ReconstructionSnapshot.findById(req.params.id).populate('specRefs');
    if (!snap) return res.status(404).json({ error: 'Snapshot not found' });
    res.json(snap);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Create snapshot
router.post('/', writeLimiter, async (req, res) => {
  try {
    const snap = new ReconstructionSnapshot(req.body);
    await snap.save();
    res.status(201).json(snap);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Update snapshot
router.put('/:id', writeLimiter, async (req, res) => {
  try {
    const snap = await ReconstructionSnapshot.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!snap) return res.status(404).json({ error: 'Snapshot not found' });
    res.json(snap);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Delete snapshot
router.delete('/:id', writeLimiter, async (req, res) => {
  try {
    const snap = await ReconstructionSnapshot.findByIdAndDelete(req.params.id);
    if (!snap) return res.status(404).json({ error: 'Snapshot not found' });
    res.json({ message: 'Snapshot deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
