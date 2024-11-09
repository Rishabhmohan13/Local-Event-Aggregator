const razorpay = require('razorpay')
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env

const dotenv = require('dotenv');
dotenv.config();


const createRazorpayInstance = () => {

    return new razorpay ({
        key_id: RAZORPAY_ID_KEY,
        key_secret: RAZORPAY_SECRET_KEY
    });

}


