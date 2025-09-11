const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const triviaRoutes = require('./routes/trivia');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/auth', authRoutes);
app.use('/trivia', triviaRoutes);
app.use('/user', userRoutes);

module.exports = app;