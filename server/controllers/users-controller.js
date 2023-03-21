const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
            const hashpassword = await bcrypt.hash(password, 12);
            const user = new User({
                name,
                email,
                password: hashpassword,
                image: req.file.path, // this is from multer
                places: [],
            });
            await user.save();

            // generate a token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "10h",
                }
            );

            // set cookie
            const cookieOptions = {
                expires: new Date(
                    Date.now() +
                        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                ),
                httpOnly: true, // make sure this cookie can not be accessed by browser
            };
            if (process.env.NODE_ENV === "production") {
                cookieOptions.secure = true; // only for https
            }
            res.cookie("jwt", token, cookieOptions);

            res.status(201).json({
                message: "success",
                user: user.toObject({
                    getters: true,
                    transform: function (doc, ret) {
                        delete ret.password;
                    },
                }),
                token,
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
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        const isValidPassword = await bcrypt.compare(password, user?.password);
        if (!user || !isValidPassword) {
            next(
                new HttpError("Invalid credentials, could not log you in ", 403)
            );
        } else {
            // generate a token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "11h" }
            );

            if (process.env.NODE_ENV === "production") {
                cookieOptions.secure = true; // only for https
            }

            res.json({
                message: "login success",
                user: user.toObject({
                    getters: true,
                    transform: function (doc, ret) {
                        delete ret.password;
                    },
                }),
                token: token,
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
