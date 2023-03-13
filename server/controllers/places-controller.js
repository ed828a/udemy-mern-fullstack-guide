const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const HttpError = require("../models/http-error");
const Place = require("../models/placeModel");
const User = require("../models/userModel");
const { getCoordinatesFromAddress } = require("../utils/mapbox-utils");

exports.getPlaceById = async (req, res, next) => {
    const id = req.params.pid;
    try {
        const place = await Place.findById(id);
        if (!place) {
            next(
                new HttpError(
                    `Could not find a place for provided id: ${id}`,
                    404
                )
            );
            // error handling function in app.js will handle this error
        } else {
            // {getters: true}: mongoose add the virtual id property,
            res.json({
                message: "success",
                place: place.toObject({ getters: true }),
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

exports.getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    try {
        // const places = await Place.find({ creator: userId });
        // if (!places || places.length === 0) {
        //     const error = new HttpError(
        //         `Could not find a place for the provided user id: ${userId}`,
        //         404
        //     );
        //     next(error);
        // } else {
        //     res.json({
        //         message: "success",
        //         places: places.map((p) => p.toObject({ getters: true })),
        //     });
        // }

        // alternative way to get places
        const userWithPlaces = await User.findById(userId).populate("places");
        if (!userWithPlaces || userWithPlaces.places.length === 0) {
            const error = new HttpError(
                `Could not find a place for the provided user id: ${userId}`,
                404
            );
            next(error);
        } else {
            res.json({
                message: "success",
                places: userWithPlaces.places.map((p) =>
                    p.toObject({ getters: true })
                ),
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

exports.createPlace = async (req, res, next) => {
    const { title, description, address, creator } = req.body;
    console.log("req.body", req.body);
    let coordinates;
    try {
        coordinates = await getCoordinatesFromAddress(address);
        console.log("coordinates:", coordinates);
    } catch (error) {
        console.log("error", error);
        return next(error);
    }

    const [lng, lat] = coordinates;
    const p = {
        title,
        description,
        image: req.file.path,
        address,
        location: { lat, lng },
        creator,
    };

    try {
        const user = await User.findById(creator);
        console.log("user", user);

        if (!user) {
            const err = new HttpError(
                `Could not find user for provided id: ${creator}`,
                404
            );
            return next(err);
        }

        // when we need to execute multiple operations which are not directly related to each other. if one of these operations fails independently from each other, then we must make sure to undo all operations. which is to throw error without changing anything in the documents.
        // mongoose transactions and sessions can help us to achieve this: transactions allows to perform multiple operations in isolation of each other, and to undo these operations. And transactions are built on so-called sessions.
        // so to work with transactions, we first have to start a session. then we can initiate the transactions. and once the transaction is successful, the session is finished and these transactions are committed.
        const sess = await mongoose.startSession();
        sess.startTransaction();
        const newPlace = new Place(p);
        const createdPlace = await newPlace.save({ session: sess });
        user.places.push(createdPlace); // same as user.places.push(createdPlace._id);
        await user.save({ session: sess });
        await sess.commitTransaction();

        res.status(201).json({ message: "success", place: createdPlace });
    } catch (error) {
        console.log(error);
        const err = new HttpError(
            `Creating place failed, error: ${error.message}`,
            500
        );
        next(err);
    }
};

exports.getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();

        res.json({
            message: "success",
            places: places.map((p) => p.toObject({ getters: true })),
        });
    } catch (error) {
        const err = new HttpError(
            `Somethin went wrong, error: ${error.message}`,
            500
        );
        next(err);
    }
};

exports.updatePlace = async (req, res, next) => {
    // console.log("req.params.pid", req.params.pid);
    const { title, description } = req.body;
    try {
        const place = await Place.findByIdAndUpdate(
            req.params.pid,
            {
                title,
                description,
            },
            { new: true }
        );
        if (!place) {
            const error = new HttpError(
                `Could not find a place for the provided user id: ${req.params.id}`,
                404
            );
            next(error);
        } else {
            res.json({
                message: "success",
                place: place.toObject({ getters: true }),
            });
        }
    } catch (error) {
        const err = new HttpError(
            `Somethin went wrong, error: ${error.message}`,
            500
        );
        next(err);
    }
};

exports.deletePlace = async (req, res, next) => {
    // const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(req.params.pid).populate("creator");
    } catch (error) {
        const err = new HttpError(
            `Somethin went wrong, error: ${error.message}`,
            500
        );
        return next(err);
    }

    if (!place) {
        const error = new HttpError(
            `Could not find a place for the provided user id: ${req.params.id}`,
            404
        );
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        const err = new HttpError(
            `Somethin went wrong, error: ${error.message}`,
            500
        );
        return next(err);
    }

    console.log(path.join(__dirname, place.image));
    fs.unlink(path.join(__dirname, "..", place.image), (err, file) => {
        console.log(err);
    });

    res.json({
        message: "Delete success",
        place: place.toObject({ getters: true }),
    });
};
