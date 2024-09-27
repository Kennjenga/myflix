"use client";
import { useState } from "react";

interface UserProfile {
  user_id: number;
  username: string;
  email: string | null;
  phone_number: string | null;
  firstname: string | null;
  lastname: string | null;
}

const UserProfileEditForm = ({ userProfile }: { userProfile: UserProfile }) => {
  const [profile, setProfile] = useState(userProfile);

  const handleUpdate = async () => {
    const response = await fetch(`/api/user/${profile.user_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (response.ok) {
      const updatedProfile = await response.json();
      setProfile(updatedProfile); // Update local state with the new user data
    } else {
      console.error("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/users/${profile.user_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("User deleted successfully");
      // Optionally handle user deletion (e.g., redirect, clear state)
    } else {
      console.error("Failed to delete account");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          value={profile.firstname ?? ""}
          onChange={(e) =>
            setProfile({ ...profile, firstname: e.target.value })
          }
          placeholder="First Name"
          className="mt-1 text-black block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          value={profile.lastname ?? ""}
          onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
          placeholder="Last Name"
          className="mt-1 text-black block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleUpdate}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Profile
        </button>
        <button
          onClick={handleDelete}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserProfileEditForm;
