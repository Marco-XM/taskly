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
            <div className="flex p-7 justify-between sm:text-xs md:text-lg lg:text-xl bg-slate-400 bg-opacity-0">
                <h1 className="self-center font-bold ">taskly.</h1>
                <nav className="hidden lg:flex text-sm p-5 absolute right-0 self-center md:flex ">
                    <Header className="flex m-8 self-center max-w-20 text-md hover:text-gray-300 transition-all duration-300 hover:scale-110 ease-in-out" />
                    {/* Conditionally render Join or Sign Out based on login status */}
                    {isLoggedIn ? (
                        <button onClick={handleSignOut} className="m-8 bg-red-600 p-5 rounded-full hover:text-gray-300 transition-all duration-300 hover:scale-110 ease-in-out">
                            Sign Out
                        </button>
                    ) : (
                        <Join className="m-8 bg-red-300 bg-opacity-0 border p-5 rounded-3xl hover:text-gray-300 hover:border-gray-500 transition-all duration-300 hover:scale-110 ease-in-out" />
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
            <div className="border"></div>
            <div className="h-screen flex">
                <div className="p-5 w-1/2 self-center font-bold text-2xl flex justify-center">
                    <div className="break-words flex flex-col justify-center">
                        <h1 className="text-5xl font-bold mb-4">Welcome to Taskly!</h1>
                        <p className="text-lg text-gray-400">
                            Stay organized and manage your tasks effortlessly.<br/> Start by creating your task boxes and adding tasks to them.
                        </p>
                    </div>
                </div>
                <div className="p-5 w-1/2 self-center">
                    <div className="flex justify-center">
                        <img src="/social-planner-calendar-for-time-management.png" alt="image" />
                    </div>
                    <div className="flex justify-center">
                        {/* Illustration by <a href="https://icons8.com/illustrations/author/HxMFjfKZdNq2">Rosina Gavrilash</a> from <a href="https://icons8.com/illustrations">Ouch!</a> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;
