const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const checkAuthentication = (req, res, next) => {
    if (req.method === "OPTIONS") {
        // some browsers send OPTIONS method before send actual method other than GET.
        return next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error("Invalid authorization");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError("Authentication failed", 403);
        return next(error);
    }
};

module.exports = checkAuthentication;