const multer = require("multer"); // multer is a middleware function
const { v4: uuidv4 } = require("uuid");

// for file extension name, multer will tell the file's mimetype
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

// fileUpload is a customized middleware function
const fileUpload = multer({
    // configuration of multer
    limits: 500000, // in bytes, 500kb
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/images"); // under project root directory (which is server)
            // uploads/images must exists before running this function
        },
        filename: (req, file, cb) => {
            console.log("file.mimetype:", file.mimetype);
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + "." + ext); // cb(error, filename)
        },
    }),
    fileFilter: (req, file, cb) => {
        // double checking if file type is in pre-set MIME_TYPE_MAP
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid
            ? null
            : new Error(`Invalid file mime-type: ${file.mimetype}`);
        cb(error, isValid);
    },
});

module.exports = fileUpload;
