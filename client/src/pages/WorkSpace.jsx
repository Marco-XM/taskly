import React, { useState } from "react";
// import Background from "../assets/diamond-sunset.svg";
import Taskcards from "../components/App/Taskcards";


const WorkSpace = () => {

    return (
    <>
        <div className="grid grid-flow-row gap-40 ">
            {/* <div className="p-20 bg-slate-300">
                <Head/>
            </div> */}
            <div className="">
                    <Taskcards/>
            </div>
        </div>
    </>
    
    
    );
};
export default WorkSpace;