const dotenv = require('dotenv');
const {app, server} = require('./app');
const mongoose = require('mongoose');

dotenv.config({path : './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('Connected'));

port = 4000;
server.listen(port, ()=> {
    console.log("Sever started");
});