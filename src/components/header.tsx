"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { parseCookies, destroyCookie } from "nookies"; // For cookie management
import { logout } from "@/app/actions/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  // Retrieve session from cookies
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    fetchUserInfo();
  }, []);

  return (
    <div className="mt-1 mb-3 w-full mx-auto sm:mx-2 flex justify-between items-center z-10">
      <div className="flex items-center lg:justify-between gap-4 w-[80%]">
        {/* Hamburger Menu for Small Screens */}
        <button
          className="text-white lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Hamburger menu icon */}
        </button>

        <div className="text-white text-2xl font-bold ms-3">MYFLIX</div>

        {/* Search Bar and Links for Medium and Larger Screens */}
        <div className="hidden lg:flex items-center gap-12">
          <nav>
            <ul className="flex space-x-6 text-white">
              <Link href="/">
                <li>Home</li>
              </Link>
              <li>Genre</li>
              <li>Movies</li>
              <li>TV Shows</li>
              <Link href="/content">
                <li>Top IMDB</li>
              </Link>
            </ul>
          </nav>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-1 rounded-md w-64 text-black"
          />
        </div>
      </div>

      {/* Conditionally Render Login/Username */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user.username}</span>
          <button
            onClick={() => {
              logout();
            }}
            className="bg-white text-blue-900 px-4 py-1 rounded-xl me-3"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-white text-blue-900 px-4 py-1 rounded-xl me-3">
            Login
          </button>
        </Link>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-900 p-4 md:hidden">
          <nav>
            <ul className="flex flex-col items-center space-y-4 text-white">
              <Link href="/">
                <li onClick={() => setIsOpen(false)}>Home</li>
              </Link>
              <li onClick={() => setIsOpen(false)}>Genre</li>
              <li onClick={() => setIsOpen(false)}>Movies</li>
              <li onClick={() => setIsOpen(false)}>TV Shows</li>
              <li onClick={() => setIsOpen(false)}>Top IMDB</li>
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-1 rounded-md w-full text-black mt-2"
              />
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
