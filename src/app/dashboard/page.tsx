"use client";
import React, { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard/dash";

// Example usage
const App = () => {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/session"); // Adjust the path if necessary
        if (response.ok) {
          const data = await response.json();
          console.log("User fetched:", data);
          setUser({
            name: data.name || "N/A",
            email: data.email || "N/A",
            role: data.role || "user", // Set a default role if it's missing
          });
        } else {
          setError("Failed to fetch user session");
        }
      } catch (err) {
        setError("An error occurred while fetching user session");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return user ? <Dashboard user={user} /> : <div>No user data available</div>;
};

export default App;
