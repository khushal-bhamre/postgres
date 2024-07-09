import express from "express";
import { db } from "./util.js";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();

let items = [ ];

app.get("/",async(req, res) => {

  try {
    const query = "SELECT * FROM items";
    const result = await db.query(query);
    items =result.rows;
  } catch (error) {
    console.log('Error fetching table',error.stack);
  }

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async(req, res) => {
  const item = req.body.newItem;
  try {
    const query = "INSERT INTO items (title) VALUES ($1)";
    const result = await db.query(query,[item]);
  } catch (error) {
    console.log('Failed to insert data',error.stack);
  }
  res.redirect("/");
});

app.post("/edit",async(req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    const query = "UPDATE items SET title =$1 WHERE id=$2";
    await db.query(query,[item,id]);  
  } catch (error) {
    console.log('Error updating record',error.stack);
  }
  res.redirect("/");
});

app.post("/delete",async(req, res) => {
  const id = req.body.deleteItemId;

  try {
    const query = "DELETE FROM items WHERE id = $1";
    await db.query(query,[id]);
  } catch (error) {
    console.log('Error deleting record',error.stack);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
