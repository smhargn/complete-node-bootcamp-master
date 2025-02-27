const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');


const router = express.Router();

router.use(authController.isLoggedIn);

// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//         tour : 'The Forest Hiker',
//         user : 'Jonas'
//     });
// })

router.get('/',viewController.getOverview)
router.get('/tour/:slug',viewController.getTour);
router.get('/login', viewController.getLoginForm)

//router.get('/tours/:`${tour.slug}`',viewController.getTour);


module.exports = router;