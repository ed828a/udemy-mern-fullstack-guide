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
    const { name, email, password } = req.body;
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
                image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
