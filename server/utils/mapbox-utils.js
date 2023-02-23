exports.getCoordinatesFromAddress = async (address) => {
    var accessToken =
        "pk.eyJ1IjoiZWQ4MjhhIiwiYSI6ImNrd2lmcmk2ejBuM3gybmw1NnR6NjNzaDQifQ.Z_ydEO2ynIQKGDmRezk3bQ";
    var geocodingUrl =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(address) +
        ".json?access_token=" +
        accessToken;

    try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();
        const coordinates = data.features[0].center;
        return coordinates; // [lng, lat]
    } catch (error) {
        console.log("getCoordinatesFromAddress error", error);
        return Promise.reject(error);
    }
};

function getCoordinatesFromAddress(address, callback) {
    var accessToken =
        "pk.eyJ1IjoiZWQ4MjhhIiwiYSI6ImNrd2lmcmk2ejBuM3gybmw1NnR6NjNzaDQifQ.Z_ydEO2ynIQKGDmRezk3bQ";
    var geocodingUrl =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(address) +
        ".json?access_token=" +
        accessToken;

    fetch(geocodingUrl)
        .then((response) => response.json())
        .then((data) => {
            var coordinates = data.features[0].center;
            callback(null, coordinates);
        })
        .catch((error) => {
            callback(error);
        });
}

// getCoordinatesFromAddress(
//     "1600 Amphitheatre Parkway, Mountain View, CA",
//     function (error, coordinates) {
//         if (error) {
//             console.error(error);
//         } else {
//             console.log(coordinates);
//         }
//     }
// );
