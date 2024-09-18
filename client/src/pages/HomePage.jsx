import React, { useState, useEffect } from "react";
import Header from "../components/Home/Header";
import Join from "../components/Home/Join";
import Menu from "../components/Home/Menu";

const HomePage = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists
    }, []);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleSignOut = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Set isLoggedIn to false after sign out
        window.location.reload(); // Optionally, reload the page or redirect the user
    };

    return (
        <>
            <div className="flex p-4 justify-between sm:text-xs md:text-lg lg:text-xl bg-slate-400">
                <h1 className="self-center font-bold lg:text-3xl md:text-2xl sm:text-xl">taskly.</h1>
                <nav className="hidden lg:flex lg:text-lg p-5 absolute right-0 self-center md:text-sm md:flex ">
                    <Header className="flex m-8 self-center max-w-20" />
                    {/* Conditionally render Join or Sign Out based on login status */}
                    {isLoggedIn ? (
                        <button onClick={handleSignOut} className="m-8 bg-red-300 p-5 rounded-full">
                            Sign Out
                        </button>
                    ) : (
                        <Join className="m-8 bg-red-300 p-5 rounded-full" />
                    )}
                </nav>
                <div className="menu-container lg:-z-20 md:-z-20">
                    <Menu
                        className="lg:hidden md:hidden sm:w-10 pr-8 pt-0.5 m-2 flex menu-span bg-white transition-all cursor-pointer"
                        isVisible={isMenuVisible}
                        toggleMenu={toggleMenu}
                    />
                </div>
            </div>
            {isMenuVisible && (
                <div className="lg:hidden md:hidden right-0">
                    <nav className="p-2 bg-slate-500 absolute right-0 whitespace-nowrap">
                        <Header className="flex m-8 self-center max-w-20" />
                        {/* Conditionally render Join or Sign Out in mobile view as well */}
                        {isLoggedIn ? (
                            <button onClick={handleSignOut} className="rounded-full flex m-8">
                                Sign Out
                            </button>
                        ) : (
                            <Join className="rounded-full flex m-8" />
                        )}
                    </nav>
                </div>
            )}
        </>
    );
};

export default HomePage;
