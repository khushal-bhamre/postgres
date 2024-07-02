import express from 'express';
import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT=3000;
const db = new pg.Client(
  {
      user: process.env.DB_USER,
      host:process.env.DB_HOST,
      database:process.env.DB_NAME,
      password:process.env.DB_PASSWORD,
      port:process.env.DB_PORT,
  }
);


//connect it to db 

db.connect()

//database disconnect

// db.end((err)=>{
//     if(err){
//         console.log('failed to close db');
//     }else{
//         console.log('db connection close');
//     }
// })

app.get('/',async(req,res)=>{
    try {
      const data = await db.query('SELECT * FROM flags');
      res.json(data.rows);
      console.log(data.rows);
      db.end();
    } catch (error) {
        console.log('Error occured',error.stack);
    }
})



app.listen(PORT,()=>{
     console.log(`Server running on port ${PORT}`);
})