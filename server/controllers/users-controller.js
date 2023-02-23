const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const DUMMY_USERS = [
    {
        id: "u1",
        name: "John",
        email: "john@example.com",
        password: "password",
    },
];

exports.getUsers = (req, res, next) => {
    res.json({ message: "success", users: DUMMY_USERS });
};

exports.getUserById = (req, res, next) => {
    const user = DUMMY_USERS.find((u) => u.id === req.params.uid);
    res.json({ message: "success", user });
};

exports.signup = (req, res, next) => {
    const user = req.body;
    user.id = uuidv4();
    DUMMY_USERS.push(user);
    res.status(201).json({ message: "success", user });
};

exports.login = (req, res, next) => {
    const user = DUMMY_USERS.find((u) => u.email === req.body.email);
    if (!user || user.password !== req.body.password) {
        next(new HttpError("No such User", 401));
    }

    res.json({ message: "login success", user });
};
