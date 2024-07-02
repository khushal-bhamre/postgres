import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

//client object
const db = new pg.Client(
  {
      user: process.env.DB_USER,
      host:process.env.DB_HOST,
      database:process.env.DB_NAME,
      password:process.env.DB_PASSWORD,
      port:process.env.DB_PORT,
  }
);


let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
];

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};


db.connect();//connect to database



// GET home page
app.get("/", async (req, res) => {
  try {
    const query = 'SELECT * FROM capitals';
    const result = await db.query(query); // Use direct await for cleaner syntax

    if (result.rows.length === 0) {
      console.log("No data found in the 'capitals' table.");
      // Handle the case where no data is found (optional: render a message)
    } else {
      quiz = result.rows;
      totalCorrect = 0;
      await nextQuestion();
      console.log(currentQuestion);
      res.render("index.ejs", { question: currentQuestion });
    }
  } catch (err) {
    console.error("Error fetching data from database:", err);
    // Handle database errors gracefully (e.g., render an error page)
  }
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
