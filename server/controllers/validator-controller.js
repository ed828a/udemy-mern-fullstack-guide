const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
// validation Result : {
//     formatter: [Function: formatter],
//     errors: [
//       {
//         value: '',
//         msg: 'Invalid value',
//         param: 'title',
//         location: 'body'
//       }
//     ]
//   }
exports.processValidationResult = (req, res, next) => {
    const result = validationResult(req);
    console.log("result", result);
    if (!result.isEmpty()) {
        // console.log("errors: ", result);
        next(new HttpError(`Invalid inputs: ${result.errors[0].param}`, 422));
    } else {
        next();
    }
};
