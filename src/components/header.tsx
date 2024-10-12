"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import ProfileMenu from "@/components/profilemenu";
import { Search, Menu } from "lucide-react";

interface SearchResult {
  content_id: number;
  title: string;
  content_type: string;
}

type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      role?: string | null | undefined;
    }
  | undefined;

type Props = {
  user: User;
};

const Header = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams();
    params.set(filterType, value);
    router.push(`/content?${params.toString()}`);
  };

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

  const handleResultClick = (result: SearchResult) => {
    router.push(`/content/${result.content_id}`);
    setSearchQuery(result.title);
    setIsDropdownVisible(false);
    setIsSearchBarVisible(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const UserAvatar = () => {
    if (user?.image) {
      return (
        <Image
          src={user.image}
          alt={user.name || "User"}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
        {user?.name ? user.name[0].toUpperCase() : "U"}
      </div>
    );
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  return (
    <div className="w-full p-3 mx-auto sm:mx-2 flex flex-col z-10">
      <div className="flex justify-between items-center w-full">
        {/* Left Section - Menu Icon (on small screens) and MYFLIX */}
        <div className="flex items-center">
          <button
            className="mr-2 lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="text-white text-2xl font-bold">
            MYFLIX
          </Link>
        </div>

        {/* Center Section - Navigation (on large screens) */}
        <nav className={`hidden lg:flex`}>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/content"
                className="block hover:bg-violet-700 active:bg-violet-700 rounded-lg p-2 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <button
                className="hover:bg-violet-700 active:bg-violet-700 rounded-lg p-2 transition duration-300"
                onClick={() => handleFilter("content_type", "movie")}
              >
                Movies
              </button>
            </li>
            <li>
              <button
                className="hover:bg-violet-700 active:bg-violet-700 rounded-lg p-2 transition duration-300"
                onClick={() => handleFilter("content_type", "tv_show")}
              >
                TV Shows
              </button>
            </li>
            <li>
              <button
                className="hover:bg-violet-700 active:bg-violet-700 rounded-lg p-2 transition duration-300"
                onClick={() => handleFilter("sort", "top_rated")}
              >
                Top IMDB
              </button>
            </li>
          </ul>
        </nav>

        {/* Right Section - Search (on large screens), Search Icon (on small screens), and Profile Menu */}
        <div className="flex items-center">
          <div className="relative hidden md:block" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search for movies..."
              className="w-64 px-4 py-2 rounded-md text-black"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {isDropdownVisible && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
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
          <button
            className="ml-4 md:hidden text-white"
            onClick={toggleSearchBar}
            aria-label="Toggle search"
          >
            <Search size={24} />
          </button>
          {user ? (
            <div className="relative ml-4" ref={profileMenuRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-label="Open profile menu"
              >
                <UserAvatar />
                <span className="text-white hidden md:inline">{user.name}</span>
              </button>
              {isProfileMenuOpen && <ProfileMenu />}
            </div>
          ) : (
            <Link href="/login" className="ml-4">
              <button className="bg-white text-blue-900 px-4 py-1 rounded-xl hover:bg-gray-200 transition duration-300">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchBarVisible && (
        <div className="mt-4 w-full md:hidden" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search for movies..."
            className="w-full px-4 py-2 rounded-md text-black"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isDropdownVisible && searchResults.length > 0 && (
            <div className="absolute left-0 w-full mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.content_id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                  onClick={() => handleResultClick(result)}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500">{result.content_type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 bg-violet-800 bg-opacity-90 z-20 p-4 lg:hidden">
          <button
            className="text-white mb-4 hover:bg-violet-700 active:bg-violet-700 rounded-lg p-2 transition duration-300"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            ✕ Close
          </button>
          <nav>
            <ul className="flex flex-col items-center space-y-4 text-white">
              <li>
                <Link
                  href="/content"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="block py-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  className="block py-2 w-full text-left"
                  onClick={() => {
                    handleFilter("content_type", "movie");
                    setIsOpen(false);
                  }}
                >
                  Movies
                </button>
              </li>
              <li>
                <button
                  className="block py-2 w-full text-left"
                  onClick={() => {
                    handleFilter("content_type", "tv_show");
                    setIsOpen(false);
                  }}
                >
                  TV Shows
                </button>
              </li>
              <li>
                <button
                  className="block py-2 w-full text-left"
                  onClick={() => {
                    handleFilter("sort", "top_rated");
                    setIsOpen(false);
                  }}
                >
                  Top IMDB
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
