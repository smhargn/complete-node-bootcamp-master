const express = require('express');
const userControlller = require('./../controllers/userController');


const router = express.Router();



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