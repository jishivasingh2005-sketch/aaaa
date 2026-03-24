const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// @route   GET /api/ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/ideas
router.post('/', async (req, res) => {
  try {
    const newIdea = new Idea(req.body);
    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/ideas/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedIdea) return res.status(404).json({ error: 'Idea not found' });
    res.json(updatedIdea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/ideas/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedIdea = await Idea.findByIdAndDelete(req.params.id);
    if (!deletedIdea) return res.status(404).json({ error: 'Idea not found' });
    res.json({ message: 'Idea deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/ideas/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const { uid } = req.body;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    
    if (idea.likedBy.includes(uid)) {
      idea.likedBy = idea.likedBy.filter(id => id !== uid);
      idea.likes = Math.max(0, idea.likes - 1);
    } else {
      idea.likedBy.push(uid);
      idea.likes += 1;
    }
    
    await idea.save();
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/ideas/:id/comment
router.post('/:id/comment', async (req, res) => {
  try {
    const comment = req.body;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    
    idea.commentsList.push({
      ...comment,
      id: 'comm-' + Date.now() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    });
    idea.comments += 1;
    
    await idea.save();
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
