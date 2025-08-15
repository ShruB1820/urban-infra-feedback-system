import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createIssue } from '../api/issueApi';
import MapPicker from './MapPicker';
import { toast } from 'react-toastify';

export default function IssueForm({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
  const [photo, setPhoto] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) formData.append(key, data[key]);
      formData.append('lat', latLng.lat);
      formData.append('lng', latLng.lng);
      if (photo) formData.append('photo', photo);

      const res = await createIssue(formData);
      toast.success('Issue created!');
      reset();
      setPhoto(null);
      onSuccess?.();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <form className="p-4 space-y-4 bg-white shadow rounded" onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Title" className="input" required />
      <textarea {...register('description')} placeholder="Description" className="input" />
      
      <select {...register('type')} className="input" required>
        <option value="">Select type</option>
        <option value="POTHOLE">Pothole</option>
        <option value="STREETLIGHT">Streetlight</option>
      </select>
      
      <input {...register('address')} placeholder="Address" className="input" />
      <MapPicker latLng={latLng} setLatLng={setLatLng} />
      
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
      <button type="submit" className="btn">Submit</button>
    </form>
  );
}