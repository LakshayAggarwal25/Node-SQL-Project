require('dotenv').config();
const express = require('express');

const PORT = process.env.APP_PORT;
const app = express();

const userRouter = require('./routes/user');

//
app.use(express.json());

app.use('/api/users',userRouter);

app.listen(PORT);