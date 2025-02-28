require('dotenv').config()
const express = require('express')
const cors = require('cors');
const path = require('path')
const prisma = require("./prismaClient");

const authRoutes = require("./routes/authRoutes")
const siteRoutes = require("./routes/siteRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

// allow json data
app.use(express.json())

const REQUEST_DELAY = 1000; // 1 seconds delay
// Middleware to delay all responses
app.use((req, res, next) => {
    setTimeout(() => {
        next();
    }, REQUEST_DELAY);
});

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));

app.use(async (req, res, next) => {
    console.log(req.method, req.path);
    next();
})


// routes
app.use('/auth', authRoutes)
app.use('/sites', siteRoutes)
app.use('/dashboard', dashboardRoutes)

// Server uploads folder
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 5000;
prisma
    .$connect()
    .then(() => {
        // listen for requests
        app.listen(PORT, () => {
            console.log(`Connected to DB & listening on port ${PORT}`);
            console.log(`http://localhost:${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });

