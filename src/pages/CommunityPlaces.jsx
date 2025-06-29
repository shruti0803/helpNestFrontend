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

 const dummyImages = {
  fitness: [
    "https://images.unsplash.com/photo-1583454110558-774b0e3a3a8e",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
    "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
    "https://images.unsplash.com/photo-1517964101675-f2d4c2cfa1f3",
    "https://images.unsplash.com/photo-1571731956672-643d06edb7f3",
    "https://images.unsplash.com/photo-1599058917212-d750089bc06d",
    "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
    "https://images.unsplash.com/photo-1583454110558-774b0e3a3a8e",
    "https://images.unsplash.com/photo-1581009146145-6411c143055b"
  ],
  sports: [
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2863",
    "https://images.unsplash.com/photo-1601625874704-cf6a1fd17be5",
    "https://images.unsplash.com/photo-1599058917212-d750089bc06d",
    "https://images.unsplash.com/photo-1611233418165-d289d333b7f4",
    "https://images.unsplash.com/photo-1549921296-3a6b3d6ad9b4",
    "https://images.unsplash.com/photo-1576267423445-97b6a2f8e5ec",
    "https://images.unsplash.com/photo-1549921296-3a6b3d6ad9b4",
    "https://images.unsplash.com/photo-1625346309443-6f4ae3fcb2fa",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    "https://images.unsplash.com/photo-1554284126-aa88f22d8b74"
  ],
  clinics: [
    "https://images.unsplash.com/photo-1580281657521-6d1fdf4f9301",
    "https://images.unsplash.com/photo-1588776814546-ec0b0fc1e4d7",
    "https://images.unsplash.com/photo-1606813902750-0b9bfc0d88a0",
    "https://images.unsplash.com/photo-1580281657521-6d1fdf4f9301",
    "https://images.unsplash.com/photo-1622253692010-333f3c1d6f59",
    "https://images.unsplash.com/photo-1579154204601-b5c76a43c397",
    "https://images.unsplash.com/photo-1580281657521-6d1fdf4f9301",
    "https://images.unsplash.com/photo-1606813902750-0b9bfc0d88a0",
    "https://images.unsplash.com/photo-1579154204601-b5c76a43c397",
    "https://images.unsplash.com/photo-1588776814546-ec0b0fc1e4d7"
  ],
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

const getRandomDummyImage = () => {
  const list = dummyImages[type.folder] || [];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
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
          const image = getRandomDummyImage();
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
