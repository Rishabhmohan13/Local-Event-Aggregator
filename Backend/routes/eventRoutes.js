const express = require('express');
const eventController = require('./../controllers/eventController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Your route using multer middleware
// app.post('/createEvent', upload.single('eventImage'), eventController.createNewEvent);
const router = express.Router();

router
    .route('/')
    .get(eventController.getAllEvents)
    .post(upload.single('eventImage'), eventController.createNewEvent)

router
    .route('/:id')
    .get(eventController.getEvent)
    .delete(eventController.deleteEvent)
    .patch(upload.single('eventImage'), eventController.EditEvent);

router
    .route('/user/:id')
    .get(eventController.getUserEvent);

module.exports = router;