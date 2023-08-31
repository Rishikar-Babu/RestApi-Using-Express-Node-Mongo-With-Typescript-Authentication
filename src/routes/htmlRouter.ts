import express from 'express';

import controllers from '../controllers/userController';
// import validateToken from '../middleware/protected';

const router =express.Router()
router.get('/',(req,res)=>{
    res.render("index",{
        title:"WElcome to TS_EXP js"
    })
})

export default router