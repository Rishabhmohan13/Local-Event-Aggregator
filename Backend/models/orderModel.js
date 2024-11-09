const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A event must have a user ID']
    },
    userEmail: {
        type: String,
        required: [true, 'A event must have a user email']
    },
    userName: {
        type: String,
        required: [true, 'A event must have a user name']
    },
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A event must have a event ID']
    },
    eventName: {
        type: String,
        required: [true, 'A event must have a name']
    },
    eventStartDate: {
        type: Date,
        required: [true, 'A event must have a date']
    },
    eventImageURL: {
        type: String,
        required: [true, 'A event must have a iamge url']
    },
    eventAbout: {
        type: String,
        required: [true, 'A event must have a about']
    },
    quantity: {
        type: Number,
        required: [true, 'A event must have a quantity']
    },
    orderPrice: {
        type : Number,
        required : [true, 'A order must have a cost'],
    },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;