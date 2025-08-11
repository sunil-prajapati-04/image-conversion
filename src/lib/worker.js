import { Worker } from "bullmq";
import cloudinary from "./cloudinary.js";
import redisClient from "./redis.js";

new Worker('deleteImageQueue',async (job) =>{
    try {
     await cloudinary.uploader.destroy(job.data.public_id);
     console.log("image deleted successfully from cloudinary",job.data.public_id);
    } catch (error) {
     console.log("failed to delete Image",error);
    }
},{connection:redisClient});

