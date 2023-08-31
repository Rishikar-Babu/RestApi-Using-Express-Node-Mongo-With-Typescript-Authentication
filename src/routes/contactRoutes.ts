import express from 'express';

import controllers from '../controllers/contactController';
import validateToken from '../middleware/protected';

const router =express.Router()
router.use(validateToken)

router.post('/create',controllers.createContact)
router.get('/get/:userId',controllers.getContactById)
router.delete('/delete/:userId',controllers.deleteContactById)
router.put('/update/:userId',controllers.updateContactById)
router.get('/all',controllers.getContact)
router.get('/get/user/:userId',controllers.getContactUserById)

export =router
