import upload from '../middleware/uploadImage.js';
import sharp from 'sharp';
import path, { resolve } from 'path';
import fs from 'fs';
import cloudinary from '../lib/cloudinary.js';
import stramifier from 'streamifier';
import { Readable } from 'stream';
import { deleteImageQueue } from '../lib/queue.js';
import {v4 as uuidv4} from 'uuid';


// // Ye tab use karna hain jab hume file ko disk pe store karna ho
// export const imageUpload = async(req,res)=>{
//     try {
//         if(!req.file){
//             return res.status(404).json({messgae:"No file uploaded"});
//         }
//         const uploadedFilename = req.file.filename;
//         // console.log(req.file);
//         res.status(200).json({messgae:"file uploaded successfully",filename:uploadedFilename});
//     } catch (error) {
//         console.log("error in imageUpload Controller",error);
//         res.status(500).json({messgae:"Internal server error"});
//     }
// }



export const imageConversion  = async(req,res)=>{
    try {
        const {format,width,height}  = req.body;
        const imageFormat = format.toLowerCase();
                
        if(!req.file){
            return res.status(505).json({message:"No image file provided"});
        }

        // custom Name for your download file and adding unique suffix through uuidv4 to avoid conflict        
        const filenameWithoutExt = path.parse(req.file.originalname).name;
        const uniqueSuffix = uuidv4();
        const downloadFileName = `${filenameWithoutExt}-${uniqueSuffix}_woben`;


        //accesing image path from memory
        const imagePath = req.file.buffer;
      
        
        //resize-ot-foramt image through Sharp
        const resizeOption = {
            fit:"inside"
        }
        if(width) resizeOption.width = parseInt(width);
        if(height) resizeOption.height = parseInt(height); 

        const convertedImage = await sharp(imagePath)
        .resize(resizeOption)
        .toFormat(imageFormat)
        .toBuffer();
        
        //uploading converted-image to cloudinary 
        const result = await new Promise((resolve,rejects) =>{
            const uploadImage = cloudinary.uploader.upload_stream({
            resource_type:"image",
            folder:"converted-image",
            public_id:downloadFileName
            },
            (err,result)=>{
                if(err) return rejects(err)
                resolve(result);
            }
        );
        Readable.from(convertedImage).pipe(uploadImage);
        })

        const downloadPath = result.secure_url.replace(
         "/upload/",
         `/upload/fl_attachment:${downloadFileName}/`
        )
        
        // deleteing image from cloudinary through BUllMq
        await deleteImageQueue.add('deleteImage',{public_id:result.public_id},{delay:60000});

        res.status(200).json({messgae:"image converted Successfully",downloadPath:downloadPath});
    } catch (error) {
        console.log("error in imageConversion Controller",error);
        res.status(500).json({messgae:"Internal server error"});
    }
}
