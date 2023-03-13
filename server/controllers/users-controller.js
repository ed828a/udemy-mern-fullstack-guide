const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/userModel");

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, "-password");
        res.json({
            message: "success",
            users: users.map((u) => u.toObject({ getters: true })),
        });
    } catch (error) {
        const err = new HttpError(
            `Somethin went wrong, error: ${error.message}`,
            500
        );
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    const id = req.params.uid;
    try {
        const user = await User.findById(id, "-password");
        if (!user) {
            next(
                new HttpError(
                    `Could not find the user for provided id: ${id}`,
                    404
                )
            );
        } else {
            res.json({
                message: "success",
                user: user.toObject({ getters: true }),
            });
        }
    } catch (error) {
        const err = new HttpError(
            `Something went wrong: ${error.message}`,
            500
        );
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }

    //multer interpretes all text files in formData into the body object on the request.
    const { name, email, password } = req.body;
    console.log("req.body", req.body);

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            const error = new HttpError(
                "User exists already, please login instead.",
                422
            );
            next(error);
        } else {
            const user = new User({
                name,
                email,
                password,
                image: req.file.path, // this is from multer
                places: [],
            });
            await user.save();
            res.status(201).json({
                message: "success",
                user: user.toObject({
                    getters: true,
                    transform: function (doc, ret) {
                        delete ret.password;
                    },
                }),
            });
        }
    } catch (error) {
        const err = new HttpError(
            `Sign up failed, error: ${error.message}. try again later`,
            500
        );

        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || user.password !== req.body.password) {
            next(
                new HttpError("Invalid credentials, could not log you in ", 401)
            );
        } else {
            res.json({
                message: "login success",
                user: user.toObject({
                    getters: true,
                    transform: function (doc, ret) {
                        delete ret.password;
                    },
                }),
            });
        }
    } catch (error) {
        const err = new HttpError(
            `Log in failed, error: ${error.message}. try again later`,
            500
        );

        next(err);
    }
};
