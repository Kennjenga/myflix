"use client";
import React, { useEffect, useState } from "react";
import { Dashboard } from "@/components/dashboard/dash";

const App = () => {
  const [user, setUser] = useState<{
    user_id: number;
    username: string;
    phone_number: string;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        // Fetch user session to get the email
        const sessionResponse = await fetch("/api/user/session");
        const sessionData = await sessionResponse.json();

        if (sessionResponse.ok && sessionData.email) {
          // Now fetch the user details using the email
          const userResponse = await fetch(
            `/api/user?email=${sessionData.email}`
          );
          const data = await userResponse.json();
          const userData = data.data;

          if (userResponse.ok) {
            setUser({
              user_id: Number(userData.user_id),
              username: userData.username || "N/A",
              phone_number: userData.phone_number || "N/A",
              firstname: userData.firstname || "N/A",
              lastname: userData.lastname || "N/A",
              name: userData.name || "N/A",
              email: userData.email || "N/A",
              role: userData.role || "user",
            });
          } else {
            setError(userData.error || "Failed to fetch user details");
          }
        } else {
          setError("Failed to fetch user session");
        }
      } catch (err) {
        setError("An error occurred while fetching user session");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
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
