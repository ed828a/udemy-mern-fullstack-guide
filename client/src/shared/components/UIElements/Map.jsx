import "./Map.css";
import React, { /* useState, */ useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PUBLIC_ACCESS_TOKEN;

const Map = (props) => {
    const mapContainer = useRef(null); //The mapContainer ref specifies that App should be drawn to the HTML page in a new <div> element.
    const mapRef = useRef(null); //The ref will prevent the map from reloading when the user interacts with the map.
    // const [lng, setLng] = useState(138.59995);
    // const [lat, setLat] = useState(-34.928657);
    // const [zoom, setZoom] = useState(12);

    const { center, zoom } = props;
    // console.log("center: ", center);

    const { lat, lng } = center;
    console.log("lat, lng, zoom", lat, lng, zoom);

    useEffect(() => {
        if (mapRef.current) return; // initialize map only once
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11?optimize=true",
            center: [lng, lat],
            zoom: zoom,
        });

        new mapboxgl.Marker({ color: "#18fa1f", rotation: 45, scale: 0.7 })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
    }, [lat, lng, zoom]);

    return (
        <div>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div
                ref={mapContainer}
                className={`map ${props.className}`}
                style={props.style}
            />
        </div>
    );
};

export default Map;
