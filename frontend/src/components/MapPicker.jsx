import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({ latLng, setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return latLng.lat && latLng.lng ? <Marker position={[latLng.lat, latLng.lng]} /> : null;
};

const MapPicker = ({ latLng, setLatLng }) => {
  return (
    <div className="h-80 w-full rounded overflow-hidden border">
      <MapContainer
        center={[latLng.lat || -25.2744, latLng.lng || 133.7751]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker latLng={latLng} setLatLng={setLatLng} />
      </MapContainer>
      <div className="mt-2 text-sm text-gray-700">
        Selected: Latitude {latLng.lat.toFixed(6)}, Longitude {latLng.lng.toFixed(6)}
      </div>
    </div>
  );
};

export default MapPicker;