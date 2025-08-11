import {Queue} from 'bullmq';
import redisClient from './redis.js';

export const deleteImageQueue = new Queue('deleteImageQueue',{
    connection:redisClient
});


