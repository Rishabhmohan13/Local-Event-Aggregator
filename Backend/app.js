const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const cookieParser = require('cookie-parser');

const eventRouter = require('./routes/eventRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');


const app = express();
// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5500', // Frontend app's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you need to send cookies/auth headers
  }));

// const options = {
//     key: fs.readFileSync('./../https2/localhost.key'),
//     cert: fs.readFileSync('./../https2/localhost.crt')
//   };

const server = http.createServer(app);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());


// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//     next();
// });

app.options('*', cors());


app.use('/api/v1/events', eventRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);
module.exports = {app, server};