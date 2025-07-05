

// import playerRoutes from './Routes/Player/playerRoutes.js';
import bookingRoutes from './Routes/Player/bookingRoutes.js';
import organizerRoutes from './Routes/Organizer/organizerRoutes.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';






import { connectMongoDB } from './Config/Connection.js';





const app = express();
const PORT = process.env.PORT || 8000 ;


const corsOptions = {
    origin:[process.env.FRONT_END_URL],
    methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true,
}

app.use(cors(corsOptions));


app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());





connectMongoDB(process.env.MONGODB_URI).then(()=>{
    console.log(`DataBase (MongoDB) Connected Successfully`);
}).catch((error)=>{
    console.log(`Error In DataBase Connection, ${error}`);
})


app.use('/api/player/bookings', bookingRoutes);
app.use('/api/organizer', organizerRoutes);

  




app.get("/",(req,res)=>{
    res.send(`<h1> Getting Started With BackEnd Of Tourny </h1>`)
})





app.listen(PORT,()=>{
    console.log(`Server Started At PORT ${PORT} :- http://localhost:${PORT}`);
})