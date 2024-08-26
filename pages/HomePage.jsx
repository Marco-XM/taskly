import React, { useState } from "react";
import Header from "../components/Header";
import Join from "../components/Join";
import Menu from "../components/Menu";

const App = () => {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    };
    return (
    <>
        <div className="flex p-4 justify-between sm:text-xs md:text-lg lg:text-xl bg-slate-400">
        <h1 className="self-center font-bold lg:text-3xl md:text-2xl sm:text-xl">taskly.</h1>
        <nav className="hidden lg:flex lg:text-lg p-5 absolute right-0 self-center md:text-sm md:flex ">
            <Header className="flex m-8 self-center max-w-20"/>
            <Join className="m-8 bg-red-300 p-5 rounded-full"/>
        </nav>
            <div className="menu-container">
            <Menu className="lg:hidden md:hidden sm:w-10 pr-8 pt-0.5 m-2 flex menu-span bg-white transition-all cursor-pointer"
                isVisible={isMenuVisible}
                toggleMenu={toggleMenu}
                />
            </div>
        </div>
            {isMenuVisible && (
                <div className="lg:hidden md:hidden right-0">
                <nav className="p-2 bg-slate-500 absolute right-0 whitespace-nowrap">
                    <Header className="flex m-8 self-center max-w-20"/>
                    <Join className="rounded-full flex m-8"/>
                </nav>
                </div>
            )}
    </>
    );
}

export default App;
