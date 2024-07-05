import express from "express";
import pg from "pg";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express instance
const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Database client setup
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Connect to the database
db.connect().then(() => {
    console.log('Connected to the database');
}).catch(error => {
    console.error('Connection error:', error.message);
});

// Route to render index.ejs
app.get('/', async(req, res) => {
    let allStudents;
    try{
        const query = 'SELECT name from student';
        const result = await db.query(query);
        allStudents = result.rows;
    }catch (error) {
        console.log('Error to fetch students',error.stack);
    }
    res.render('index',{students:allStudents});
});


// Route to handle form submission
app.post('/new', async (req, res) => {
    const { userName, userAge, userCity } = req.body;
    const query = `INSERT INTO student(name, age, city) VALUES ($1, $2, $3) RETURNING *`;
    const inputData = [userName, userAge, userCity];

    try {
        const data = await db.query(query, inputData);
        console.log(data.rows);
    } catch (error) {
        console.error('Error saving user data:', error.message);
    }

});


// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
