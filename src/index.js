import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {config} from 'dotenv';
import './lib/worker.js';
import imageRoute from './routes/image.route.js';
config();

const app = express();

const Port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.use('/wobenImage',imageRoute);

app.listen(Port,()=>{
    console.log(`Server is listening on Port ${Port}`);
})
