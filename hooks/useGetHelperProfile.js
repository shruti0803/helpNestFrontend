import { useEffect, useState } from "react";
import axios from "axios";

const useGetHelperProfile = () => {
    
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/helpers/profile", {
          withCredentials: true, // optional if you use cookies
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // optional if token in cookie
          },
        });
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { helper: data, loading, error };
};

export default useGetHelperProfile;
