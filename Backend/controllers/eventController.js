const Event = require('./../models/eventModel');
const { bucket } = require('./../firebaseConfig');

exports.getAllEvents = async (req, res) => {

    const category = req.query.param1;
    const city = req.query.param2;
    const upcoming = req.query.upcoming;

    console.log(req.query);
    // console.log(city);

    const filter = {};
    
    // Add properties to the filter object only if they are defined
    if (city && city !== 'null') {
      filter.eventCity = city;
    }
    if (category && category !== 'null') {
      filter.eventCategory = category;
    }

    const limit = upcoming === 'true' ? 4 : 0;

    // Query the database with the filter object

    //console.log(filter);

    try{
        const events = await Event.find(filter).limit(limit);
        res
        .status(200)
        .json({
            status : 'success',
            results : events.length,
            events:events
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

exports.getEvent = async (req, res) => {

    try{
        const event = await Event.findById(req.params.id);
        res
        .status(200)
        .json({
            status : 'success',
            event:event
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

exports.getUserEvent = async (req, res) => {

    console.log(req.params);

    try{
        const event = await Event.find({ userID: req.params.id });
        res
        .status(200)
        .json({
            status : 'success',
            event:event
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

// exports.createNewEvent = async (req, res) => {

//     var publicUrl = "";

//     try {
//         const blob = bucket.file(req.file.originalname);
//         const blobStream = blob.createWriteStream({
//           metadata: {
//             contentType: req.file.mimetype,
//           },
//         });
    
//         blobStream.on('error', (err) => {
//           res.status(500).send('Error uploading file.');
//         });
    
//         blobStream.on('finish', async () => {
//             publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//             await bucket.file(blob.name).makePublic();
//             // res.status(200).send({ message: 'File uploaded successfully.', url: publicUrl });

//             try{
//                 const newEvent = await Event.create(req.body);
//                 //newEvent.eventURL = publicUrl;
        
//                 res
//                 .status(201)
//                 .json({
//                     status : 'success',
//                     event : newEvent
//                 });
//             } catch (err) {
//                 res
//                 .status(400)
//                 .json({
//                     status : 'fail',
//                     message : err
//                 });
//             }

//           });
    
//         blobStream.end(req.file.buffer);
//       } catch (error) {
//         res.status(500).send('Error uploading file: ' + error.message);
//       }

// };

exports.createNewEvent = async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'No file uploaded.',
      });
    }
  
    try {
      // Step 1: Upload the file to Firebase and make it public
      const publicUrl = await uploadFileToFirebase(req.file);
      console.log(publicUrl);
  
      // Step 2: Create the event after the file is uploaded
      const newEvent = await Event.create({
        ...req.body,
        eventImageURL: publicUrl, // Include the uploaded file's URL in the event data
      });

      console.log(newEvent);
  
      // Step 3: Send the response after everything is done
      res.status(201).json({
        status: 'success',
        event: newEvent,
      });
    } catch (error) {
      res.status(500).json({
        status: 'fail',
        message: error.message || 'Internal server error.',
      });
    }
};

exports.EditEvent = async (req, res) => {

  console.log('hello');

  try {

    let publicUrl = undefined;

    if(req.file)
    {
        publicUrl = await uploadFileToFirebase(req.file);
        console.log(publicUrl);
    }

    const updatedEventData = { 
      ...req.body 
    };

    if (publicUrl) {
      updatedEventData.eventImageURL = publicUrl;
    }

    delete updatedEventData.eventImage;

    const eventId = req.params.id; 
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedEventData, {
      new: true,  
      runValidators: true  
    });

    console.log(updatedEventData);

    // Step 3: Send the response after everything is done
    res.status(201).json({
      status: 'success',
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message || 'Internal server error.',
    });
  }
};

  exports.deleteEvent = async (req, res) => {
        try {
          console.log(req.params);
          const eventID = req.params.id;
          const deletedEvent = await Event.findByIdAndDelete(eventID);

          if (!deletedEvent) {
              return res.status(404).send({ message: 'Event not found' });
          }

          res.send({ message: 'User deleted successfully', event: deletedEvent });
      } 
      catch (error) {
          res.status(500).send({ message: 'Error deleting user', error: error.message });
      }
  };
  
  // Helper function to upload a file to Firebase Storage and return the public URL
  function uploadFileToFirebase(file) {
    return new Promise((resolve, reject) => {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
  
      blobStream.on('error', (err) => {
        reject(new Error('Error uploading file.'));
      });
  
      blobStream.on('finish', async () => {
        try {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          await bucket.file(blob.name).makePublic();
          resolve(publicUrl);
        } catch (err) {
          reject(new Error('Error making file public.'));
        }
      });
  
      blobStream.end(file.buffer);
    });
  }
  