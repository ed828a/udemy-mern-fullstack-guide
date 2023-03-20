const express = require("express");
const { check, validationResult } = require("express-validator");

const {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    getPlaces,
    updatePlace,
    deletePlace,
} = require("../controllers/places-controller");
const {
    processValidationResult,
} = require("../controllers/validator-controller");
const checkAuthentication = require("../middlewares/check-auth");
const fileUpload = require("../middlewares/file-upload");
const HttpError = require("../models/http-error");

const router = express.Router();

router.get("/user/:uid", getPlacesByUserId);

// router.use(protect-middleware)

router
    .route("/:pid")
    .get(getPlaceById)
    .patch(
        checkAuthentication,
        [
            check("title").not().isEmpty(),
            check("description").isLength({ min: 5 }),
        ],
        updatePlace
    )
    .delete(checkAuthentication, deletePlace);

router
    .route("/")
    .get(getPlaces)
    .post(
        checkAuthentication,
        fileUpload.single("image"),
        [
            check("title").not().isEmpty(),
            check("description").isLength({ min: 5 }),
            check("address").not().isEmpty(),
        ],
        processValidationResult,
        createPlace
    );

module.exports = router;
