const express = require('express');
// const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');

router = express.Router();

router
    .route('/')
    .post(orderController.createNewOrder);

router
    .route('/payment')
    .post(orderController.createNewPayment);


router
    .route('/email')
    .post(orderController.sendEmail);

router
    .route('/verify')
    .post(orderController.verifyPayment);

router
    .route('/:id')
    .get(orderController.getUserOrder);

// router.get('')

// router
//     .route('/')
//     .get(userController.getAllUsers)
//     .get(userController.createUser);

// router
//     .route('/:id')
//     .get(userController.getUser)
//     .patch(userController.updateUser)
//     .delete(userController.deleteUser);

module.exports = router