import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createIssue } from '../api/issueApi.js';
import MapPicker from './MapPicker.jsx';
import { toast } from 'react-toastify';

export default function IssueForm({ onSuccess }) {
  const { register, handleSubmit, reset } = useForm();
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
  const [photo, setPhoto] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      formData.append('lat', latLng.lat);
      formData.append('lng', latLng.lng);
      if (photo) formData.append('photo', photo);

      await createIssue(formData);
      toast.success('Issue created!');
      reset();
      setPhoto(null);
      onSuccess?.();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <form
      className="
        w-full max-w-4xl mx-auto 
        p-6 space-y-6 
        bg-white 
        border border-gray-300 
        rounded-2xl 
        shadow-[0_4px_12px_0_#0099E880] 
        hover:shadow-[0_6px_16px_0_#0099E8aa] 
        transition
      "
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Report an Issue</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <input
          {...register('title')}
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099E8]"
          required
        />

        {/* Type */}
        <select
          {...register('type')}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0099E8]"
          required
        >
          <option value="">Select type</option>
          <option value="POTHOLE">Pothole</option>
          <option value="STREETLIGHT">Streetlight</option>
        </select>

        {/* Address */}
        <input
          {...register('address')}
          placeholder="Address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099E8]"
        />

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-[#0099E8] file:text-white 
                     hover:file:bg-[#007bbd] cursor-pointer"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>

      {/* Description - Full width */}
      <textarea
        {...register('description')}
        placeholder="Description"
        rows="3"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099E8]"
      />

      {/* Map Picker - Full width */}
      <div className="w-full">
        <MapPicker latLng={latLng} setLatLng={setLatLng} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#0099E8] text-white font-semibold hover:bg-[#007bbd] transition"
      >
        Submit
      </button>
    </form>
  );
}