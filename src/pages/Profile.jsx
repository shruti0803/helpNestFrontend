import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUserEdit,
  FaSave,
  FaTimes,
  FaPhoneAlt,
  FaCity,
  FaIdCard,
  FaUniversity,
  FaFileAlt,
  FaUserTie,
} from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const isHelper = role === 'helper';
        const endpoint = isHelper
          ? 'http://localhost:5000/api/helpers/profile'
          : 'http://localhost:5000/api/users/profile';

        const { data } = await axios.get(endpoint, { withCredentials: true });
        const userData = isHelper ? data : data.user;
        setProfile(userData);
        setForm(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, govtDocument: e.target.files[0] }));
  };

  const saveProfile = async () => {
    try {
      if (role !== 'helper') return;

      const formData = new FormData();
      formData.set('governmentId', form.governmentId || '');
      formData.set('accountNumber', form.accountNumber || '');
      formData.set('ifscCode', form.ifscCode || '');
      formData.set('phone', form.phone || '');
      formData.set('city', form.city || '');

      if (form.govtDocument instanceof File) {
        formData.set('govtDocument', form.govtDocument);
      }

      await axios.put('http://localhost:5000/api/helpers/details', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile({ ...profile, ...form });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating helper details:', error);
      alert('Failed to save changes.');
    }
  };

  const cities = ['Delhi', 'Bangalore', 'Kolkata'];

  if (loading) return <div className="h-screen flex justify-center items-center text-purple-600 text-lg font-semibold">Loading profile...</div>;
  if (!profile) return <div className="h-screen flex justify-center items-center text-red-600 font-semibold">Failed to load profile.</div>;

  return (
    <div className="min-h-screen p-20 bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl shadow-md">
              {role === 'helper' ? <FaUserTie /> : profile.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-800">{profile.name}</h1>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button onClick={saveProfile} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"><FaSave /></button>
                <button onClick={() => { setEditMode(false); setForm(profile); }} className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full"><FaTimes /></button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full"><FaUserEdit /></button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField label="Phone" icon={<FaPhoneAlt />} value={form.phone} name="phone" editMode={editMode} handleChange={handleChange} />
          <div>
            <label className="text-sm text-purple-700 font-medium flex items-center gap-1"><FaCity /> City</label>
            {editMode ? (
              <select name="city" value={form.city || ''} onChange={handleChange} className="w-full border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="">Select City</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            ) : (
              <div className="bg-purple-100 text-purple-800 rounded-lg p-2">{profile.city || 'Not specified'}</div>
            )}
          </div>
          <ProfileField label="Account Number" icon={<FaUniversity />} value={form.accountNumber} name="accountNumber" editMode={editMode} handleChange={handleChange} />
          <ProfileField label="IFSC Code" icon={<FaUniversity />} value={form.ifscCode} name="ifscCode" editMode={editMode} handleChange={handleChange} />
          <ProfileField label="Government ID" icon={<FaIdCard />} value={form.governmentId} name="governmentId" editMode={editMode} handleChange={handleChange} />
          <div>
            <label className="text-sm text-purple-700 font-medium flex items-center gap-1"><FaFileAlt /> Govt Document</label>
            {editMode ? (
              <input type="file" onChange={handleFileChange} className="w-full border-purple-300 rounded-lg p-2" />
            ) : (
              <a href={profile.govDocumentUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Document</a>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-sm text-purple-700 font-medium">Work Domains</label>
            <div className="bg-purple-50 text-purple-800 rounded-lg p-2">
              {profile.services?.join(', ') || 'No services listed'}
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
            <NonEditable label="Training Progress" value={profile.trainingProgress} />
            <NonEditable label="Test Score" value={profile.testScore} />
            <NonEditable label="Verified" value={profile.isVerified ? 'Yes' : 'No'} />
            <NonEditable label="Active" value={profile.isActive ? 'Yes' : 'No'} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, icon, value, name, editMode, handleChange }) => (
  <div>
    <label className="text-sm text-purple-700 font-medium flex items-center gap-1">{icon} {label}</label>
    {editMode ? (
      <input name={name} value={value || ''} onChange={handleChange} className="w-full border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
    ) : (
      <div className="bg-purple-100 text-purple-800 rounded-lg p-2">{value || 'Not specified'}</div>
    )}
  </div>
);

const NonEditable = ({ label, value }) => (
  <div>
    <label className="text-sm text-gray-500 font-medium">{label}</label>
    <div className="bg-gray-100 rounded-lg p-2 text-gray-700">{value}</div>
  </div>
);

export default Profile;
