const express = require('express');
const auth = require('../middleware/auth');
let tasks = require('../models/Task');
const router = express.Router();

router.post('/', auth, (req, res) => {
  const task = { id: Date.now().toString(), content: req.body.content, completed: false, user: req.user };
  tasks.push(task);
  res.json(task);
});

router.get('/', auth, (req, res) => {
  res.json(tasks.filter(t => t.user === req.user));
});

router.put('/:id', auth, (req, res) => {
  const task = tasks.find(t => t.id === req.params.id && t.user === req.user);
  if (!task) return res.status(404).json({ msg: "Task not found" });
  task.content = req.body.content ?? task.content;
  task.completed = req.body.completed ?? task.completed;
  res.json(task);
});

router.delete('/:id', auth, (req, res) => {
  tasks = tasks.filter(t => !(t.id === req.params.id && t.user === req.user));
  res.json({ msg: "Deleted" });
});

module.exports = router;
