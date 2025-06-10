import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // required for navigation

const Details = () => {
  const [profile, setProfile] = useState(null);
  const [govtId, setGovtId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [govtDocFile, setGovtDocFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");           // ✅ New state
  const [city, setCity] = useState("");             // ✅ New state
const navigate = useNavigate();

  useEffect(() => {
    console.log("before fetch");

    axios
      .get("http://localhost:5000/api/helpers/profile", { withCredentials: true })
      .then(res => {
        console.log("i am here");
        setProfile(res.data);
        setPhone(res.data.phone || "");             // ✅ Set initial phone
        setCity(res.data.city || "");               // ✅ Set initial city
        setLoading(false);
      })
      .catch(err => {
        console.error("Profile fetch failed:", err);
        toast.error("Failed to fetch helper profile");
        setLoading(false);
      });
  }, []);

  const handleFileChange = (e) => {
    setGovtDocFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) {
      toast.error("Helper profile not loaded");
      return;
    }
    if (!govtDocFile) {
      toast.error("Please upload your government document");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", profile._id);
      formData.append("governmentId", govtId);
      formData.append("accountNumber", accountNumber);
      formData.append("ifscCode", ifscCode);
      formData.append("govtDocument", govtDocFile);
      formData.append("phone", phone);             // ✅ Append phone
      formData.append("city", city);               // ✅ Append city

      await axios.put("http://localhost:5000/api/helpers/details", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    Swal.fire({
  title: "Success!",
  text: "Your details were saved successfully.",
  icon: "success",
  confirmButtonColor: "#7c3aed", // Tailwind purple-600
  confirmButtonText: "OK",
}).then(() => {
  navigate("/");
});
    
    } catch (error) {
      console.error("Failed to submit helper details", error);
      toast.error("Failed to submit helper details", {
        position: "top-center",
        autoClose: 4000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-20 text-center">Loading...</p>;
  if (!profile) return <p className="p-20 text-center text-red-600">No helper data available. Please login.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white shadow-2xl rounded-2xl p-10 m-20 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">Helper Registration</h2>

        <form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <label className="text-gray-600 text-sm font-medium">Name</label>
      <div className="border px-3 py-2 rounded bg-gray-100 text-gray-800">{profile.name}</div>
    </div>
    <div>
      <label className="text-gray-600 text-sm font-medium">Email</label>
      <div className="border px-3 py-2 rounded bg-gray-100 text-gray-800">{profile.email}</div>
    </div>

    {/* Phone input */}
    <div>
      <label className="text-gray-600 text-sm font-medium">Phone</label>
      <input
        type="text"
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-400"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
    </div>

    {/* City dropdown (enum) */}
    <div>
      <label className="text-gray-600 text-sm font-medium">City</label>
      <select
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-400"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      >
        <option value="">Select City</option>
        {["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Other"].map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>

    {/* Government ID */}
    <div>
      <label className="text-gray-600 text-sm font-medium">Government ID</label>
      <input
        type="text"
        value={govtId}
        onChange={(e) => setGovtId(e.target.value)}
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Enter your government ID"
        required
      />
    </div>

    {/* Account Number */}
    <div>
      <label className="text-gray-600 text-sm font-medium">Account Number</label>
      <input
        type="text"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        pattern="\d{9,18}"
        placeholder="Enter 9 to 18 digit account number"
        required
      />
    </div>

    {/* IFSC Code */}
    <div>
      <label className="text-gray-600 text-sm font-medium">IFSC Code</label>
      <input
        type="text"
        value={ifscCode}
        onChange={(e) => setIfscCode(e.target.value)}
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
        placeholder="e.g. SBIN0123456"
        required
      />
    </div>

    {/* Govt Document Upload */}
    <div>
      <label className="text-gray-600 text-sm font-medium">Upload Government Document</label>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        required
      />
    </div>
  </div>

  {/* Existing uploaded image if present */}
  {profile?.govDocumentUrl && (
    <div className="mt-4">
      <p className="font-medium text-gray-700 mb-1">Uploaded Document:</p>
      <a href={profile.govDocumentUrl} target="_blank" rel="noreferrer">
        <img
          src={profile.govDocumentUrl}
          alt="Govt Document"
          className="w-48 h-auto rounded shadow-lg hover:scale-105 transition-transform"
        />
      </a>
    </div>
  )}

  {/* ✅ Services Display as Pills */}
  {profile?.services?.length > 0 && (
    <div className="mt-6">
      <label className="text-gray-600 text-sm font-medium">Services You Provide</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {profile.services.map((service, idx) => (
          <span
            key={idx}
            className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  )}

  <div className="mt-8 text-center">
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Submit Details"}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default Details;
