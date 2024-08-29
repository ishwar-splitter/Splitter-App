require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { testConnection } = require('./config/db');
const app = express();

app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'https://splitter_frontend:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions));

app.use('/api', routes);

testConnection();

module.exports = app;