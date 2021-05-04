import React, { useEffect } from "react"
import { GoogleMap, useLoadScript, Marker, InfoWindow, MarkerClusterer } from "@react-google-maps/api"
import HSControl from './HomeScreenControl'
import RequestFullscreen from './RequestFullscreen'
import NavBar from "./NavigationBar"
import mapStyle from "./HomeScreenStyle" // Google Map style JSON

import {ReactComponent as RecenterIcon} from "./recenter.svg" // Recenter button icon
import {ReactComponent as AddListingIcon} from "./add_listing.svg" // Add listing button icon

// This will be tracked in the database later
var listingId = 0;

const DEFAULT_ZOOM = 8;
const DEFAULT_REQUEST_FULLSCREEN = true;

// Google API Libraries to use
const LIBRARIES = ["places"];

// Container div for Google Map
const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '100%',
    position: 'absolute'
}

// Map starting lat/long
const DEFAULT_CENTER = {
    lat: 40.71,
    lng: -74.006
};

// Map UI options; disabled to make room for StoopApp UI
const DEFAULT_OPTIONS = {
    styles: mapStyle,
    disableDefaultUI: true,
    gestureHandling: "greedy"
};

function showPos(pos) {
    console.log(pos.coords.latitude + "\n" + pos.coords.longitude);
}

export default function Map() {
    // Load API
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: "AIzaSyBX7QahP1yTzu3i5myK8ZztY9BHWGDqRd4",
        libraries: LIBRARIES
    });

    const [markers, setMarkers] = React.useState([]); // Map markers state
    const [showRequestFS, setShowRequestFS] = React.useState(!DEFAULT_REQUEST_FULLSCREEN); // Fullscreen state

    // TODO: Implement error handling
    if (loadError) return "Error loading map";
    if (!isLoaded) return "Loading map..."

    // Add a new marker to the current state once GPS position is retrieved
    function onGetGeoPos(pos) {
        setMarkers((current) => [
            ...current,
            {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                id: listingId,
            }
        ]);
    }

    // Receive current list of markers and add new one at location
    function handleAddListing() {
        navigator.geolocation.getCurrentPosition(onGetGeoPos);
        listingId++;
    }

    function onRequestFS() {
        setShowRequestFS(true);
        document.documentElement.requestFullscreen();
    }

    // DEBUG: REMOVE LATER
    function testFunction2() {
        console.log("Hello world 2")
        setShowRequestFS(true);
    }



    return <div>
        {/* Shows up at the beginning of the user session to request that they turn on fullscreen */}
        {showRequestFS == false &&
        <RequestFullscreen
            onClick={onRequestFS}
        />}

        {/* Add listing button */}
        <HSControl
            onClick={handleAddListing}
            content={<AddListingIcon/>}
            left="5%"
            borderRadius="50%"
        />

        {/* Recenter map button */}
        <HSControl
            onClick={testFunction2}
            content={<RecenterIcon/>}
            right="5%"
            borderRadius="50%"
            padding="3px 3px 3px 3px"
        />

        {/* Main map */}
        <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            zoom={DEFAULT_ZOOM}
            center={DEFAULT_CENTER}
            options={DEFAULT_OPTIONS}
        >
            {markers.map(marker => <Marker key={marker.id} position={{lat: marker.lat, lng: marker.lng}}/>)}
        </GoogleMap>
    </div>
}