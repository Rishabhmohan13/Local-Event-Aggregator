const Order = require('../models/orderModel');
// const {createRazorpayInstance} = require('./razorpay.config');
// const razorpayInstance = createRazorpayInstance();

const Razorpay = require('razorpay');
const crypto = require('crypto');

const { exec } = require('child_process');

const dotenv = require('dotenv');
dotenv.config({path : './config.env'});


const RAZORPAY_ID_KEY = process.env.RAZORPAY_ID_KEY;
const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY;

var instance = new Razorpay({ key_id: RAZORPAY_ID_KEY, key_secret: RAZORPAY_SECRET_KEY});

exports.getUserOrder = async (req, res) => {

    try{
        const order = await Order.find({ userID: req.params.id });
        res
        .status(200)
        .json({
            status : 'success',
            order:order
        });

    }catch (err) {
        res
        .status(404)
        .json({
            status : 'fail',
            message : err
        });
    }
};

exports.createNewPayment = async (req, res) => {

    try{

        const options = {

            amount: req.body.amount*100,
            currency: 'INR',
            receipt: 'order_1'
        };
    
        const order = await instance.orders.create(options);
    
        res.json(order);

    } catch (err) {
        res
        .status(400)
        .json({
            status : 'fail',
            message : err
        });
    }


    

    // try{
    //     const newOrder = await Order.create(req.body);
    //     res
    //     .status(201)
    //     .json({
    //         status : 'success',
    //         order : newOrder
    //     });
    // } catch (err) {
    //     res
    //     .status(400)
    //     .json({
    //         status : 'fail',
    //         message : err
    //     });
    // }
};

exports.createNewOrder = async (req, res) => {

    try{
        const newOrder = await Order.create(req.body);
        res
        .status(201)
        .json({
            status : 'success',
            order : newOrder
        });
    } catch (err) {
        res
        .status(400)
        .json({
            status : 'fail',
            message : err
        });
    }
};

exports.verifyPayment = async (req, res) => {

    console.log('hello');

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_SECRET_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        return res.json({ success: true, message: 'Payment verified successfully!' });
    } else {
        // Payment verification failed
        return res.status(400).json({ success: false, message: 'Payment verification failed!' });
    }
};

exports.sendEmail = async (req, res) => {

    const scriptPath = './script.sh';
    const arg1 = req.body.userEmail;
    const arg2 = 'Confirmation of Event Registration - LOCA';
    const arg3 = 'Dear ' + req.body.userName + ', \nYour Ticket to the event is confirmed. \nYour order ID is : ' + req.body._id + '\n\nThank You, \nTeam LOCA';
    const arg4 = process.env.SENDGRID_API;

    console.log(arg4);

    const formattedArg3 = arg3.replace(/\n/g, '\\n');

    // Command string with arguments
    const command = `${scriptPath} "${arg1}" "${arg2}" "${formattedArg3}" "${arg4}"`;

    // Execute the shell script with arguments
    exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing script: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
    }
    });
};