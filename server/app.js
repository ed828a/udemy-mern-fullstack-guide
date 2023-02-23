const express = require("express");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");

const placeRouter = require("./routes/place-router");
const usersRouter = require("./routes/users-router");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/places", placeRouter);
app.use("/api/users", usersRouter);

// handling un-suppported routes
app.use((req, res, next) => {
    const error = new HttpError("Not Supported Route: " + req.url, 404);
    throw error; // error handling function will be called
});

// Error handling function
// when you provide a middleware function with 4 parameters, express treats it as a special middleware function, as an error handling middleware function.
// that means that this function will only be executed on the requests that hav an error attached to it.
// so this function will be executed if any middleware in front of it yields an error.
// which means either throw new Error() --synchronous or next(error) -- asynchronous in previous middlewares will trigger this middleware to be executed
app.use((error, req, res, next) => {
    if (res.headerSent) {
        // check if response has been sent
        return next(error); // forward error to next middle
    }

    // in convention, every error has .message property
    res.status(error.code || 500).json({
        message: error.message || "An unknown error occurred",
    });
});

// the business logic is:
// first, to establish the connection to mongoDB
// if the connection is successfull, then to start the backend server
// if the connection fails, then to check the error
mongoose
    .connect(process.env.MONGODB_URL)
    .then((connection) => {
        app.listen(5000, () => {
            console.log("Server up at port 5000");
        });
        console.log("mongoDB is connected.");
    })
    .catch((error) => {
        console.log("mongodb connection error: " + error);
    });
