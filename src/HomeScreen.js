import React from 'react'

// Map to be used on home screen
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

var DEFAULT_ZOOM_LEVEL = 15;

// Dimensions of the map
const CONTAINER_STYLE = {
    width: '100%',
    height: '99vh'
};

// Map starting lat/long
const START_CENTER = {
    lat: 40.71,
    lng: -74.006
};

// Map UI options; disabled to make room for StoopApp UI
const MAP_OPTIONS = {
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false
};

// Map on home screen
function Map() {
    // Load Google Maps API
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyBX7QahP1yTzu3i5myK8ZztY9BHWGDqRd4"
    })

    const [map, setMap] = React.useState(null)

    // Callback function for when map is loaded
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    // Callback function for when map is destructed
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={CONTAINER_STYLE}
            zoom={DEFAULT_ZOOM_LEVEL}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={MAP_OPTIONS}
            center={START_CENTER}
        >
        </GoogleMap>
    ) : <></>
}
  
export default Map;