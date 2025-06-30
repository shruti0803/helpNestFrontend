import React, { useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaPhoneAlt, FaBuilding } from 'react-icons/fa';

const placeTypes = [
  { label: "Fitness Centres", key: 'fitness_centre', type: 'leisure', folder: 'fitness' },
  { label: "Sports Centres", key: 'sports_centre', type: 'leisure', folder: 'sports' },
  { label: "Clinics", key: 'clinic', type: 'amenity', folder: 'clinics' },
  { label: "Parks", key: 'park', type: 'leisure', folder: 'parks' }
];

const OPENCAGE_API_KEY = '10279fc6e0b04cc9a2e3a8c1238777b4';

const CommunityPlaces = () => {
  const [city, setCity] = useState('');
  const [type, setType] = useState(placeTypes[0]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: `${lat}+${lon}`,
          key: OPENCAGE_API_KEY,
          pretty: 1
        }
      });
      const components = res.data.results[0]?.components;
      return components
        ? `${components.road || ''}, ${components.city || components.town || ''}, ${components.state || ''}`
        : 'Address not available';
    } catch {
      return 'Address not available';
    }
  };
const imageIndexTracker = {
  fitness: 0,
  sports: 0,
  clinics: 0,
  parks: 0
};

 const dummyImages = {
fitness: [
  "https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg", // Woman plank row in gym :contentReference[oaicite:2]{index=2}
  "https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg", // Woman lifting barbell :contentReference[oaicite:3]{index=3}
  "https://images.pexels.com/photos/160529/pexels-photo-160529.jpeg", // Battle ropes workout :contentReference[oaicite:4]{index=4}
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg", // Black punching bag in sunlight :contentReference[oaicite:5]{index=5}
  "https://images.pexels.com/photos/374794/pexels-photo-374794.jpeg", // Dumbbell close‑up :contentReference[oaicite:6]{index=6}
  "https://images.pexels.com/photos/4761798/pexels-photo-4761798.jpeg", // Barbell rack dark gym :contentReference[oaicite:7]{index=7}
  "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg", // Deadlift intense :contentReference[oaicite:8]{index=8}
  "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg", // Treadmill cardio :contentReference[oaicite:9]{index=9}
  "https://images.pexels.com/photos/209969/pexels-photo-209969.jpeg", // Kettlebell flat‑lay :contentReference[oaicite:10]{index=10}
  "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg"  // Bodybuilder black‑white :contentReference[oaicite:11]{index=11}
]
,
 sports: [
  "https://images.pexels.com/photos/5067760/pexels-photo-5067760.jpeg", // Elderly man doing medicine ball exercise outdoors :contentReference[oaicite:1]{index=1}
  "https://images.pexels.com/photos/15376288/pexels-photo-15376288.jpeg", // Senior man with golf club on lush course :contentReference[oaicite:2]{index=2}
  "https://images.pexels.com/photos/6542457/pexels-photo-6542457.jpeg", // Two golfers high-fiving on golf course :contentReference[oaicite:3]{index=3}
  "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg", // Elderly man jogging along waterfront :contentReference[oaicite:4]{index=4}
  "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg", // Senior man lifting weights (dumbbells) :contentReference[oaicite:5]{index=5}
  "https://images.pexels.com/photos/209969/pexels-photo-209969.jpeg", // Senior woman using kettlebell :contentReference[oaicite:6]{index=6}
  "https://images.pexels.com/photos/160529/pexels-photo-160529.jpeg", // Battle ropes strength exercise :contentReference[oaicite:7]{index=7}
  "https://images.pexels.com/photos/374794/pexels-photo-374794.jpeg", // Dumbbell close‑up in senior fitness context :contentReference[oaicite:8]{index=8}
  "https://images.pexels.com/photos/325521/pexels-photo-325521.jpeg", // Senior group yoga outdoors :contentReference[oaicite:9]{index=9}
  "https://images.pexels.com/photos/158028/pexels-photo-158028.jpeg" // Elderly woman lifting weights in gym :contentReference[oaicite:10]{index=10}
]
,
clinics: [
  "https://images.pexels.com/photos/3844582/pexels-photo-3844582.jpeg", // Modern white building with landscaping
  "https://images.pexels.com/photos/3845515/pexels-photo-3845515.jpeg", // Glass-wrapped medical facility
  "https://images.pexels.com/photos/3844584/pexels-photo-3844584.jpeg", // Brick and glass clinic entrance
  "https://images.pexels.com/photos/3845508/pexels-photo-3845508.jpeg", // Contemporary healthcare complex
  "https://images.pexels.com/photos/3844589/pexels-photo-3844589.jpeg", // Small medical office building
  "https://images.pexels.com/photos/3845511/pexels-photo-3845511.jpeg", // Clinic with green accents and glass facade
  "https://images.pexels.com/photos/3844592/pexels-photo-3844592.jpeg", // Entrance to modern outpatient facility
  "https://images.pexels.com/photos/3845514/pexels-photo-3845514.jpeg", // Clinic surrounded by trees and daylight
  "https://images.pexels.com/photos/3844587/pexels-photo-3844587.jpeg", // Clean-lined hospital annex
  "https://images.pexels.com/photos/3844590/pexels-photo-3844590.jpeg"  // Contemporary healthcare building with glass frontage
]
,
  parks: [
    "https://images.pexels.com/photos/325521/pexels-photo-325521.jpeg?_gl=1*1ynm1ii*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTExOTM4NzAkbzIwJGcxJHQxNzUxMTkzODg1JGo0NSRsMCRoMA..",
    "https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?_gl=1*6bmy8b*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTExOTM4NzAkbzIwJGcxJHQxNzUxMTkzOTI3JGozJGwwJGgw",
    "https://images.pexels.com/photos/955656/pexels-photo-955656.jpeg?_gl=1*zpumse*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTExOTM4NzAkbzIwJGcxJHQxNzUxMTk0MDA2JGo1MiRsMCRoMA..",
    "https://images.pexels.com/photos/1406865/pexels-photo-1406865.jpeg?_gl=1*b0ibn5*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTExOTM4NzAkbzIwJGcxJHQxNzUxMTk0MDQ4JGoxMCRsMCRoMA..",
    "https://images.pexels.com/photos/1684889/pexels-photo-1684889.jpeg?_gl=1*1rnod0h*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyMDU1NzYkbzIxJGcxJHQxNzUxMjA1NTg3JGo0OSRsMCRoMA..",
    "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?_gl=1*zgn1tv*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyMDU1NzYkbzIxJGcxJHQxNzUxMjA1NjM4JGo1OSRsMCRoMA..",
    "https://images.pexels.com/photos/54539/pexels-photo-54539.jpeg?_gl=1*n6p1g6*_ga*MjAzOTA0ODM2NS4xNzQ4NDEwODg3*_ga_8JE65Q40S6*czE3NTEyMDU1NzYkbzIxJGcxJHQxNzUxMjA1NjgzJGoxNCRsMCRoMA..",
    "https://images.unsplash.com/photo-1508606572321-901ea443707f",
    "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
    "https://images.unsplash.com/photo-1532274402917-5aadf881bdfb"
  ]
};

const getSequentialDummyImage = () => {
  const list = dummyImages[type.folder] || [];
  if (list.length === 0) return null;

  const currentIndex = imageIndexTracker[type.folder] || 0;
  const image = list[currentIndex];

  // Update the index to point to the next image, wrap around using modulo
  imageIndexTracker[type.folder] = (currentIndex + 1) % list.length;

  return image;
};



  const fetchPlaces = async () => {
    if (!city || !type) return;
    setLoading(true);
    try {
      const query = `
        [out:json][timeout:25];
        area["name"="${city}"]->.searchArea;
        (
          node["${type.type}"="${type.key}"](area.searchArea);
        );
        out body;
      `;
      const response = await axios.post(
        'https://overpass-api.de/api/interpreter',
        query,
        { headers: { 'Content-Type': 'text/plain' } }
      );

      const elements = response.data.elements || [];

      const enriched = await Promise.all(
        elements.map(async (place) => {
          const address = await fetchAddress(place.lat, place.lon);
         const image = getSequentialDummyImage();

          return { ...place, address, image };
        })
      );

      setPlaces(
  enriched.filter(
    (p) =>
      p.tags?.name &&
      p.tags.name.trim().toLowerCase() !== "unnamed place" &&
      p.address &&
      p.address.trim().toLowerCase() !== "address not available" || "unknown road"
  )
);

    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-100 p-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">Explore Nearby Wellness & Social Spots</h1>
        <p className="text-gray-600 mb-6">Find parks, clinics, fitness hubs, and more in your city.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City (e.g., Mumbai)"
            className="flex-1 border border-purple-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <select
            className="border border-purple-300 rounded px-4 py-2 bg-white"
            value={type.key}
            onChange={(e) =>
              setType(placeTypes.find((pt) => pt.key === e.target.value))
            }
          >
            {placeTypes.map((pt) => (
              <option key={pt.key} value={pt.key}>
                {pt.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchPlaces}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-purple-500">Searching for places...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {places.map((place, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <img
                src={place.image}
                alt="Place"
                className="rounded mb-3 w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold text-purple-800 mb-1 flex items-center gap-1">
                <FaBuilding className="text-purple-500" />
                {place.tags?.name || 'Unnamed Place'}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" />
                {place.address}
              </p>
              {place.tags?.phone && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <FaPhoneAlt className="text-green-500" />
                  {place.tags.phone}
                </p>
              )}
            </div>
          ))}
        </div>

        {!loading && places.length === 0 && city && (
          <p className="text-gray-500 mt-4">No results found for {city}.</p>
        )}
      </div>
    </div>
  );
};

export default CommunityPlaces;
