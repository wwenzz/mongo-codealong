import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Author = mongoose.model("Author", {
  name: String,
});

const Book = mongoose.model("Book", {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Author.deleteMany();
    await Book.deleteMany();
    const orwell = new Author({ name: "George Orwell" });
    await orwell.save();

    const rowling = new Author({ name: "J.K. Rowling" });
    await rowling.save();

    await new Book({
      title: "Harry Potter and the Philosopher's Stone",
      author: rowling,
    }).save();
    await new Book({
      title: "Harry Potter and the Deathly Hallows",
      author: rowling,
    }).save();
    await new Book({
      title: "Fantastic Beasts and Where to Find Them",
      author: rowling,
    }).save();
    await new Book({
      title: "1984",
      author: orwell,
    }).save();
    await new Book({
      title: "Animal Farm",
      author: orwell,
    }).save();
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/authors", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

app.get("/books", async (req, res) => {
  const books = await Book.find().populate("author");
  res.json(books);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
