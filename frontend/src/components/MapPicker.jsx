import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
});

export default function MapPicker({ latLng, setLatLng }) {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <MapContainer center={[latLng.lat, latLng.lng]} zoom={13} style={{ height: 300, width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[latLng.lat, latLng.lng]} icon={markerIcon} />
      <MapEvents />
    </MapContainer>
  );
}