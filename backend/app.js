import express  from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/User.js';
import aiRoutes from './routes/AI.js';
import projectRoutes from './routes/Project.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

connect();

const app=express();
console.log(" process.env.FRONTEND_URL_LOCAL", process.env.FRONTEND_URL_LOCAL);
// const allowedOrigins = [
//     process.env.FRONTEND_URL_LOCAL,
//     process.env.FRONTEND_URL_PROD
//   ];
  
  app.use(
    cors({
      //  origin: allowedOrigins,
      origin:'*',
      methods: 'GET,POST,PUT,DELETE', // Specify allowed methods
       allowedHeaders: 'Content-Type,Authorization',
       credentials: true,
    })
  );
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use('/ai',aiRoutes);

//dummy route 
app.get('/', (req,res)=>{
    res.send('hii ai');
});

export default app;

