import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import "./HotelsMap.css";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const defaultCenter = {
  lat: -6.1699,
  lng: 39.2025 // Zanzibar coordinates
};

export default function HotelsMap({ hotels }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
  });

  const [selectedHotel, setSelectedHotel] = useState(null);
  const mapRef = React.useRef(null);

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  if (!isLoaded)
    return <div className="map-loading">Loading map...</div>;

  return (
    <div className="hotels-map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {hotels && hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={{
              lat: parseFloat(hotel.latitude) || defaultCenter.lat,
              lng: parseFloat(hotel.longitude) || defaultCenter.lng
            }}
            title={hotel.name}
            onClick={() => setSelectedHotel(hotel)}
          >
            {selectedHotel && selectedHotel.id === hotel.id && (
              <InfoWindow
                position={{
                  lat: parseFloat(hotel.latitude) || defaultCenter.lat,
                  lng: parseFloat(hotel.longitude) || defaultCenter.lng
                }}
                onCloseClick={() => setSelectedHotel(null)}
              >
                <div className="info-window">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.location}</p>
                  <p>👥 Capacity: {hotel.capacity}</p>
                  <p>💰 {hotel.price_range}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
}
