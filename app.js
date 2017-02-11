const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config')(process.env.NODE_ENV);

const Db = require('./db');
const db = new Db(config);
const app = express();

app.use(bodyParser.json());

app.get('/api/todo', async (req, res) => {
  try {
    res.send( await db.Todo.findAll({ where: { deleted: true }}) );
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post('/api/todo', async (req, res) => {
  try {
    res.send( await db.Todo.create(req.body) )
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch('/api/todo/:id/done', async (req, res) => {
  try {
    const todo = await db.Todo.findById(req.params.id);
    todo.set('done', true);
    res.send( await todo.save() )
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch('/api/todo/:id/undone', async (req, res) => {
  try {
    const todo = await db.Todo.findById(req.params.id);
    todo.set('done', false);
    res.send( await todo.save() )
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/todo/:id', async (req, res) => {
  try {
    const todo = await db.Todo.findById(req.params.id);
    todo.set('deleted', true);
    res.send( await todo.save() )
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = app;
