import upload from '../middleware/uploadImage.js';
import sharp from 'sharp';
import path, { resolve } from 'path';
import fs from 'fs';
import cloudinary from '../lib/cloudinary.js';
import stramifier from 'streamifier';
import { Readable } from 'stream';
import { deleteImageQueue } from '../lib/queue.js';


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
        console.log(format);
        const imageFormat = format.toLowerCase();
        // const imagePath = `src/uploads/${filename}`;
        // const filenameWithoutExt = path.parse(filename).name;
        // const outputPath = `src/converted/${filenameWithoutExt}.${imageFormat}`;
        
        if(!req.file){
            return res.status(505).json({message:"No image file provided"});
        }
        const imagePath = req.file.buffer;
      
        

        const resizeOption = {
            fit:"inside"
        }
        if(width) resizeOption.width = parseInt(width);
        if(height) resizeOption.height = parseInt(height); 

        const convertedImage = await sharp(imagePath)
        .resize(resizeOption)
        .toFormat(imageFormat)
        .toBuffer();
        
        const result = await new Promise((resolve,rejects) =>{
            const uploadImage = cloudinary.uploader.upload_stream({
            resource_type:"image",
            folder:"converted-image"
            },
            (err,result)=>{
                if(err) return rejects(err)
                resolve(result);
            }
        );
        Readable.from(convertedImage).pipe(uploadImage);
        })
        
        await deleteImageQueue.add('deleteImage',{public_id:result.public_id},{delay:60000});

        res.status(200).json({messgae:"image converted Successfully",downloadPath:result.secure_url});
    } catch (error) {
        console.log("error in imageConversion Controller",error);
        res.status(500).json({messgae:"Internal server error"});
    }
}
