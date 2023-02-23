const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const Place = require("../models/placeModel");
const { getCoordinatesFromAddress } = require("../utils/mapbox-utils");

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world!",
        imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
        address: "20 W 34th St, New York, NY 10001",
        location: {
            lat: 40.7484405,
            lng: -73.9878584,
        },
        creator: "u1",
    },
    {
        id: "p2",
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world!",
        imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
        address: "20 W 34th St, New York, NY 10001",
        location: {
            lat: 40.7484405,
            lng: -73.9878584,
        },
        creator: "u2",
    },
];

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
        const places = await Place.find({ creator: userId });
        if (!places || places.length === 0) {
            const error = new HttpError(
                `Could not find a place for the provided user id: ${userId}`,
                404
            );
            next(error);
        } else {
            res.json({
                message: "success",
                places: places.map((p) => p.toObject({ getters: true })),
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
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
        address,
        location: { lat, lng },
        creator,
    };
    try {
        const newPlace = new Place(p);
        const createdPlace = await newPlace.save();
        res.status(201).json({ message: "success", place: createdPlace });
    } catch (error) {
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
    try {
        const place = await Place.findByIdAndDelete(req.params.pid);
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
