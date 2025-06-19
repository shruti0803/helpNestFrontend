import { useEffect, useState } from "react";
import axios from "axios";

const useAdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          withCredentials: true,
        });
        setAdmin(res.data.user || res.data.admin);
      } catch (err) {
        console.error("Failed to fetch admin:", err);
        setError(err.response?.data?.message || "Error fetching admin");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  return { admin, loading, error };
};

export default useAdminProfile;
