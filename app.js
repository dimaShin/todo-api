const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config')(process.env.NODE_ENV);

const Db = require('./db');
const db = new Db(config);
const app = express();

const HARDCODED_TOKEN = 'thisissupersecrettoken';

app.use(cors({allowedHeaders: ['x-token, content-type']}));

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  try {
    const { login, password } = req.body;

    if (login === 'admin' && password === '123456') {
      res.send({token: HARDCODED_TOKEN});
    } else {
      res.status(401).send('Invalid login or password');
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use('/api/*', (req, res, next) => {
  const token = req.header('x-token');

  if (!token || token !== HARDCODED_TOKEN) {
    return res.sendStatus(401);
  } else {
    next();
  }
});

app.get('/api/todo', async (req, res) => {
  try {
    res.send( await db.Todo.findAll({ where: { deleted: false }, order: [ ['done'], ['createdAt', 'DESC'] ]}) );
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/me', async (req, res) => {
  res.send( { loggedIn: true } );
});

app.post('/api/todo', async (req, res) => {
  try {
    res.send( await db.Todo.create(req.body) )
  } catch (err) {
    res.status(400).send(err);
  }
});

app.patch('/api/todo/:id/toggle', async (req, res) => {
  try {
    const todo = await db.Todo.findById(req.params.id);
    todo.set('done', !todo.get('done'));
    res.send( await todo.save() );
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
