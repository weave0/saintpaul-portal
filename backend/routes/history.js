const express = require('express');
const router = express.Router();
const HistoricalEvent = require('../models/HistoricalEvent');

// GET all historical events
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, tags } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    const events = await HistoricalEvent.find(query)
      .populate('relatedLocations')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET timeline view (grouped by year/decade)
router.get('/timeline', async (req, res) => {
  try {
    const events = await HistoricalEvent.aggregate([
      {
        $project: {
          year: { $year: '$date' },
          title: 1,
          description: 1,
          category: 1,
          date: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await HistoricalEvent.findById(req.params.id)
      .populate('relatedLocations');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new event
router.post('/', async (req, res) => {
  try {
    const event = new HistoricalEvent(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const event = await HistoricalEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await HistoricalEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
