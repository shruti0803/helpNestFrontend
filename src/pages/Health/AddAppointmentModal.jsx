import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaStethoscope,
  FaUserDoctor,
  FaHospital,
  FaSun,
  FaCloudSun,
  FaCloudMoon,
  FaMoon
} from "react-icons/fa6";

const AddAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "checkup", // could be 'checkup', 'consultation', etc.
    notes: "",
    location: "",
    singleDate: "",
    startDate: "",
    endDate: "",
    selectedSlots: [],
    isRange: false,
  });

  const timeSlots = [
    { value: "morning", label: "Morning", icon: <FaSun className="text-yellow-500" /> },
    { value: "afternoon", label: "Afternoon", icon: <FaCloudSun className="text-orange-400" /> },
    { value: "evening", label: "Evening", icon: <FaCloudMoon className="text-indigo-500" /> },
    { value: "night", label: "Night", icon: <FaMoon className="text-gray-700" /> },
  ];

  const typeOptions = [
    { value: "checkup", label: "Checkup", icon: <FaStethoscope className="text-green-600" /> },
    { value: "consultation", label: "Consultation", icon: <FaUserDoctor className="text-blue-500" /> },
    { value: "surgery", label: "Surgery", icon: <FaHospital className="text-red-600" /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const schedule = [];
    const buildDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Note: month is 0-indexed
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
};

      if (formData.isRange) {
        let current = buildDate(formData.startDate);
        const end = buildDate(formData.endDate);
        while (current <= end) {
          formData.selectedSlots.forEach((slot) => {
            schedule.push({ date: new Date(current), timeSlot: slot });
          });
          current.setDate(current.getDate() + 1);
        }
      } else {
        formData.selectedSlots.forEach((slot) => {
          schedule.push({ date: buildDate(formData.singleDate), timeSlot: slot });
        });
      }

      await axios.post(
        "http://localhost:5000/api/health/addAppt",
        { ...formData, schedule },
        { withCredentials: true }
      );

      Swal.fire({ icon: "success", title: "Appointment added successfully" });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Error adding appointment:", err);
      Swal.fire({ icon: "error", title: "Error adding appointment" });
    }
  };

  if (!isOpen) return null;
const today = new Date().toISOString().split("T")[0];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">📅 Add Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Type Selection */}
          <div className="flex gap-3">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: opt.value })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${formData.type === opt.value ? "bg-purple-200 border-purple-500" : "bg-white"}`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>

          <input
            className="w-full border px-2 py-2 rounded placeholder-gray-500"
            placeholder="Title (e.g. Dentist Visit)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <input
            className="w-full border px-2 py-2 rounded placeholder-gray-500"
            placeholder="Location (e.g. Apollo Hospital)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />

          <input
            className="w-full border px-2 py-2 rounded placeholder-gray-500"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
<div className="flex items-center gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.reminder}
                onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-purple-500 rounded-full peer relative transition-all">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full" />
              </div>
              <span className="ml-2 text-sm">Enable Reminder</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRange}
                onChange={(e) => setFormData({ ...formData, isRange: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-purple-500 rounded-full peer relative transition-all">
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full" />
              </div>
              <span className="ml-2 text-sm">Date Range</span>
            </label>
          </div>

          {!formData.isRange ? (
            <input
              type="date"
               min={today}
              className="w-full border px-2 py-2 rounded"
              value={formData.singleDate}
              onChange={(e) => setFormData({ ...formData, singleDate: e.target.value })}
              required
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="date"
                 min={today}
                className="w-full border px-2 py-2 rounded"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
              <input
                type="date"
                min={formData.startDate || today}
                className="w-full border px-2 py-2 rounded"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => {
                  const exists = formData.selectedSlots.includes(slot.value);
                  const updatedSlots = exists
                    ? formData.selectedSlots.filter((s) => s !== slot.value)
                    : [...formData.selectedSlots, slot.value];
                  setFormData({ ...formData, selectedSlots: updatedSlots });
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-full border ${formData.selectedSlots.includes(slot.value) ? "bg-purple-200 border-purple-600" : "bg-white"}`}
              >
                {slot.icon} {slot.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
