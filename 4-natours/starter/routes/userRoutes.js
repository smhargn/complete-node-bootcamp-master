const express = require('express');
const userControlller = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);


router
    .route('/')
    .get(userControlller.getAllUsers)
    .post(userControlller.createUser);


router
    .route('/:id')
    .get(userControlller.getUser)
    .patch(userControlller.updateUser)
    .delete(userControlller.deleteUser);

module.exports = router;