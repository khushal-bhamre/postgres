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
app.get('/', async (req, res) => {
    let allStudents;
    let allCourses;
    let enrollments = {};

    try {
        // Fetch all students
        const studentQuery = 'SELECT * FROM students';
        const studentResult = await db.query(studentQuery);
        allStudents = studentResult.rows;

        // Fetch all courses
        const courseQuery = 'SELECT * FROM courses';
        const courseResult = await db.query(courseQuery);
        allCourses = courseResult.rows;

        // Fetch enrollments
        const enrollmentQuery = `
            SELECT s.id as student_id, s.name as student_name, c.name as course_name
            FROM enrollments e
            JOIN students s ON e.student_id = s.id
            JOIN courses c ON e.course_id = c.id
        `;
        const enrollmentResult = await db.query(enrollmentQuery);
        enrollmentResult.rows.forEach(row => {
            if (!enrollments[row.student_id]) {
                enrollments[row.student_id] = {
                    name: row.student_name,
                    courses: []
                };
            }
            enrollments[row.student_id].courses.push(row.course_name);
        });
    } catch (error) {
        console.log('Error to fetch students or courses', error.stack);
    }
    res.render('index', { students: allStudents, courses: allCourses, enrollments });
});

// Route to handle form submission
app.post('/new', async (req, res) => {
    const { userName, userAge, userCity, courses } = req.body;
    let studentId;

    try {
        // Insert student data
        const studentQuery = `INSERT INTO students(name, age, city) VALUES ($1, $2, $3) RETURNING id`;
        const studentData = await db.query(studentQuery, [userName, userAge, userCity]);
        studentId = studentData.rows[0].id;

        // Insert enrollments
        const courseIds = Array.isArray(courses) ? courses.map(course => parseInt(course)) : [parseInt(courses)];
        for (let courseId of courseIds) {
            const enrollmentQuery = `INSERT INTO enrollments(student_id, course_id) VALUES ($1, $2)`;
            await db.query(enrollmentQuery, [studentId, courseId]);
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error saving user data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
