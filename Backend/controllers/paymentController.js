const {createRazorpayInstance} = require('./razorpay.config');

const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (req, res) => {

    const { courseId, amount } = req.body;

    const options = {
        amount: amount*100,
        currency: "INR",
        receipt: 'order_1'
    }

    try {

    }
    catch (error) {

        razorpayInstance.orders.create(options, function(err, order) {
            console.log(order);

            return res.status(200).json(order);
          });
          

        return res.status(500).json({
            success: false,
            message: "failed"
        });

    }

}