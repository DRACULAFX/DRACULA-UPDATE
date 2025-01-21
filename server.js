const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Simulated database (use a real database in production)
const users = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Helper function to save users to a file (optional for persistence)
const saveUsers = () => {
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
};

// Load users from file if it exists
if (fs.existsSync("./users.json")) {
    Object.assign(users, JSON.parse(fs.readFileSync("./users.json")));
}

// Routes
// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Register Route
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Username and Password are required!");
    }

    if (users[username]) {
        return res.send("Username is already taken.");
    }

    users[username] = { password };
    saveUsers(); // Save users to file
    res.send("Registration successful! You can now login.");
});

// Login Route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Username and Password are required!");
    }

    if (!users[username]) {
        return res.send("User not found. Please register first.");
    }

    if (users[username].password !== password) {
        return res.send("Invalid password.");
    }

    res.send(`Welcome back, ${username}!`);
});

// Logout Route
app.get("/logout", (req, res) => {
    res.send("You have been logged out!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});