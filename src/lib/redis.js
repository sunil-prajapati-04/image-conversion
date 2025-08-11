import Redis from 'ioredis';
import { config } from 'dotenv';
config();

const redisClient = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    maxRetriesPerRequest:null
})

redisClient.on('connect',()=>{
    console.log("redis server is connected");
})

redisClient.on('error',(error)=>{
    console.log("failed to conncet with redis server",error);
})

export default redisClient;