import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import fileRoutes from "./routes/fileRoutes.js";
import errorHandler from './middleware/errorMiddleware.js'
import env from './config/env.js'

const app=express();

//connect to Mongo DB
connectDB();

//security Middleware
app.use(helmet());
//logger middleware
app.use(morgan('dev'));

// parse JSON + form data
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cors())
// app.use(cors({
//   origin: ['http://localhost:5173',env.frontendOrigin],
//   credentials: true
// }));

// 🔍 Request logger - add here
app.use((req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
});

//Routes
app.use("/api/auth",authRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/file", fileRoutes);

// Root route for quick testing
app.get("/",(req,res)=>{
    res.send("API is running...");
})
//Error handling middleware 
app.use(errorHandler)

const PORT=env.port||5000;
app.listen(PORT,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})