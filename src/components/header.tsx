"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { logout } from "@/app/actions/auth";

interface SearchResult {
  content_id: number;
  title: string;
  content_type: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user info on mount
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

  // Close search dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle filtering by content type or rating
  const handleFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams();
    params.set(filterType, value);
    router.push(`/content?${params.toString()}`);
  };

  // Debounced search to avoid too many API calls
  const debouncedSearch = debounce(async (value: string) => {
    if (value.length > 2) {
      try {
        const response = await fetch(
          `/api/content?query=${encodeURIComponent(value)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.content);
        setSearchResults(data.content);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  }, 600);

  // Handle search result click
  const handleResultClick = (result: SearchResult) => {
    router.push(`/content/${result.content_id}`);
    setSearchQuery(result.title);
    setIsDropdownVisible(false);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="mt-1 mb-3 w-full p-3 mx-auto sm:mx-2 flex justify-between items-center z-10">
      <div className="flex items-center lg:justify-between gap-4 w-[80%]">
        <div className="text-white text-2xl font-bold ms-3">MYFLIX</div>

        <div className="hidden lg:flex items-center gap-6">
          <nav>
            <ul className="flex space-x-6 text-white">
              <Link
                href="/"
                className="hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5"
              >
                Home
              </Link>
              <li
                className="cursor-pointer hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5"
                onClick={() => handleFilter("content_type", "movie")}
              >
                Movies
              </li>
              <li
                className="cursor-pointer hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5"
                onClick={() => handleFilter("content_type", "tv_show")}
              >
                TV Shows
              </li>
              <li
                className="cursor-pointer hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5"
                onClick={() => handleFilter("sort", "top_rated")}
              >
                Top IMDB
              </li>

              <li>
                {/* Search Input */}
                <div className="relative" ref={dropdownRef}>
                  <input
                    type="text"
                    placeholder="Search for movies..."
                    className="px-4 py-1 rounded-md w-64 text-black"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />

                  {isDropdownVisible && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 w-64 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50">
                      {searchResults.map((result) => (
                        <div
                          key={result.content_id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                          onClick={() => handleResultClick(result)}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.content_type}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* User Profile and Logout Button */}
      {user ? (
        <div className="flex items-center gap-4 ms-2">
          <span className="text-white">{user.username}</span>
          <button
            className="bg-white text-blue-900 px-4 py-1 rounded-xl me-3"
            onClick={() => logout()}
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
        <div className="fixed inset-0 bg-violet-800 bg-opacity-90 z-20 p-4 md:hidden">
          <button
            className="text-white mb-4 hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5"
            onClick={() => setIsOpen(false)}
          >
            close
          </button>
          <nav>
            <ul className="flex flex-col items-center space-y-4 text-white">
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <li
                className="cursor-pointer hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5 hover:text-blue-400 transition duration-300"
                onClick={() => handleFilter("content_type", "movie")}
              >
                Movies
              </li>
              <li
                className="cursor-pointer hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5 hover:text-blue-400 transition duration-300"
                onClick={() => handleFilter("content_type", "tv_show")}
              >
                TV Shows
              </li>
              <li
                className="cursor-pointer hover:bg-violet-700 active:bg-violet-700 rounded-lg p-0.5 hover:text-blue-400 transition duration-300"
                onClick={() => handleFilter("sort", "top_rated")}
              >
                Top IMDB
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
