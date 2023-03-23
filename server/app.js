const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const placeRouter = require("./routes/place-router");
const usersRouter = require("./routes/users-router");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// static() middleware just returns the requested file.
// static serving means just returning a file which you don't execute it.
// in order words, any requested file under that path configured in static(path) will be just returned.
app.use(
    "/uploads/images",
    express.static(path.join(__dirname, "uploads", "images"))
);

/**** 
 refering to client/build folder for static website. This works for initial index.html, javascript files and all css files and all assets under this build folder,  BUT this doesn't work for our different front-end routes, like /auth
*****/
app.use(express.static(path.join(__dirname, "..", "client", "build")));

/* because of combine front-end and back-end code together, we don't need this CORS middle
app.use((req, res, next) => {
    //1 this control which domians are allowed.  * means any origin server allowed.
    res.setHeader("Access-Control-Allow-Origin", "*");
    //2 this controls which headers incoming requests may have so that they are handled.
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    //3 this controls which http methods may be used on the front end. or maybe attached to incoming requests
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT"
    );
    next();
});
*/

app.use("/api/places", placeRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "production") {
    // Express will serve up production assets, like main.js, or main.css
    app.use(express.static(path.join(__dirname, "../client", "build")));

    // Express will serve up the index.html file if it doesn't recognize the route
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
    });
}

/*---------------
// any un-handled routes in previous middlewares will be handled here, to be served statically.
app.use((req, res, next) => {
    // send back a response that is made up one file
    // for any unknown routes, we just send back the initial index.html file and
    // the front routing(react router) can take over and resolve the unknown url.
    res.sendFile(
        path.resolve(__dirname, "..", "client", "build", "index.html")
        //path.resolve() creates an absolute path by resolving a sequence of paths or path segments,
        //path.join() concatenates two or more path segments into a path using the platform-specific separator.
    );
});

// because of the previous line code, we don't need this middleware to handle un-suppported routes
// handling un-suppported routes
app.use((req, res, next) => {
    const error = new HttpError("Not Supported Route: " + req.url, 404);
    throw error; // error handling function will be called
});
---------------*/

// Error handling function
// when you provide a middleware function with 4 parameters, express treats it as a special middleware function, as an error handling middleware function.
// that means that this function will only be executed on the requests that hav an error attached to it.
// so this function will be executed if any middleware in front of it yields an error.
// which means either throw new Error() --synchronous or next(error) -- asynchronous in previous middlewares will trigger this middleware to be executed
app.use((error, req, res, next) => {
    // if there is formdata with file, multer adds the file property to req
    if (req.file) {
        // if req.file exists, means request comming with a file
        // if the image file has been stored, now we need to rollback to delete it.
        // fs.unlink is to delete the file
        fs.unlink(req.file.path, (err, file) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        // check if response has been sent
        return next(error); // forward error to next middle
    }

    // in convention, every error has .message property
    res.status(error.code || 500).json({
        message: error.message || "An unknown error occurred",
    });
});

const port = process.env.PORT || 5000;
// the business logic is:
// first, to establish the connection to mongoDB
// if the connection is successfull, then to start the backend server
// if the connection fails, then to check the error
mongoose
    .connect(process.env.MONGODB_URL)
    .then((connection) => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server up at port ${process.env.PORT || 5000}`);
        });
        console.log("mongoDB is connected.");
    })
    .catch((error) => {
        console.log("mongodb connection error: " + error);
    });
