const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A event must have a user ID']
    },
    eventName: {
        type: String,
        required: [true, 'A event must have a name']
    },
    eventCategory: {
        type: String,
        required: [true, 'A event must have a category']
    },
    eventLanguage: {
        type: String,
        required: [true, 'A event must have a Language']
    },
    eventMinutes: {
        type: Number,
        required: [true, 'A event must have total time']
    },
    eventStartDate: {
        type: Date,
        required: [true, 'A event must have a date']
    },
    eventEndDate: {
        type: Date,
        required: [true, 'A event must have a date']
    },
    eventVenue: {
        type: String,
        required: [true, 'A event must have a venue']
    },
    eventCity: {
        type: String,
        required: [true, 'A event must have a city']
    },
    eventPrice: {
        type : Number,
        required : [true, 'A event must have a price'],
    },
    eventDesc: {
        type: String,
        required: [true, 'A event must have a desc']
    },
    eventAbout: {
        type: String,
        required: [true, 'A event must have a about']
    },
    eventImage: {
        data: Buffer,
        contentType: String,
    },
    eventImageURL: {
        type: String
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;