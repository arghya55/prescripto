import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaMicrophone } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, searchQuery, setSearchQuery } =
    useContext(AppContext);

  const [query, setQuery] = useState(searchQuery || "");
  const [listening, setListening] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setSearchQuery(transcript); // 🔥 update global search
      scrollToTopDoctors();
    };

    recognition.start();
  };
  const handleTextSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchQuery(val); // 🔥 set global query
  };
  const scrollToTopDoctors = () => {
    const section = document.getElementById("top-doctors");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink to="/">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      {/* 🔍 Search Bar */}
      <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-md border border-gray-200">
        <input
          type="text"
          className="px-3 py-2 rounded-full text-gray-700 bg-transparent outline-none w-36 md:w-56 placeholder-gray-400"
          placeholder="Search doctors, specialties..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              document
                .getElementById("top-doctors")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />

        <button
          onClick={handleVoiceSearch}
          className={`ml-1 p-2 rounded-full ${
            listening
              ? "bg-green-500 animate-pulse"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          <FaMicrophone className="text-lg" />
        </button>
      </div>

      {/* 👤 Profile or Login */}
      <div className="flex items-center gap-4 ">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-gray-50 rounded p-4 text-base font-medium">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
      </div>
    </div>
  );
};

export default Navbar;
