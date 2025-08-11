import express from 'express';
import {  imageConversion } from '../controller/image.controller.js';
import upload from '../middleware/uploadImage.js';

const router  = express.Router();

router.post('/convert',upload.single('image'),imageConversion);

export default router;