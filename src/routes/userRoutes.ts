import express from 'express';

import controllers from '../controllers/userController';
// import validateToken from '../middleware/protected';

const router =express.Router()

router.post('/create',controllers.creteUser)
router.get('/get/:userId',controllers.readUser)
router.get('/getall',controllers.readAllUsers)
router.post('/login',controllers.loginUser)

export=router