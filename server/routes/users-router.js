const express = require("express");
const { check } = require("express-validator");

const {
    getUsers,
    getUserById,
    signup,
    login,
} = require("../controllers/users-controller");
const {
    processValidationResult,
} = require("../controllers/validator-controller");

const router = express.Router();

router.route("/").get(getUsers);

router.route("/:uid").get(getUserById);

router.post(
    "/signup",
    [
        check("name").isLength({ min: 3 }),
        check("email").normalizeEmail().isEmail(),
        // normalize: Test@test.com => test@test.com
        check("password").isLength({ min: 5 }),
    ],
    processValidationResult,
    signup
);

router.post(
    "/login",
    [check("email").isEmail(), check("password").isLength({ min: 5 })],
    processValidationResult,
    login
);

module.exports = router;
