const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const User = require("./models/user");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/ejs_crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Routes
// GET: Home Page - List Users
app.get("/", async (req, res) => {
  const users = await User.find();
  res.render("index", { users });
});

// GET: Add User Page
app.get("/add", (req, res) => {
  res.render("add", { errors: null });
});

// POST: Add User
app.post(
  "/add",
  [
    body("name")
      .isLength({ min: 3, max: 30 })
      .withMessage("Name must be between 3 and 30 characters"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("age")
      .isInt({ min: 18, max: 100 })
      .withMessage("Age must be between 18 and 100"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("add", { errors: errors.array() });
    }

    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.redirect("/");
  }
);

// GET: Edit User Page
app.get("/edit/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("edit", { user, errors: null });
});

// POST: Edit User
app.post(
  "/edit/:id",
  [
    body("name")
      .isLength({ min: 3, max: 30 })
      .withMessage("Name must be between 3 and 30 characters"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("age")
      .isInt({ min: 18, max: 100 })
      .withMessage("Age must be between 18 and 100"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const user = await User.findById(req.params.id);
      return res.render("edit", { user, errors: errors.array() });
    }

    const { name, email, age } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, age });
    res.redirect("/");
  }
);

// GET: Delete User
app.get("/delete/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
