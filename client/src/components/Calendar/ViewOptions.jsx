import React, { useState } from 'react'

const ViewOptions = ( {handleView} ) => {
    
    const className = 'bg-gray-700 bg-opacity-30 hover:drop-shadow-md shadow-slate-200 px-5 py-3 rounded-xl'

    return (
    <div className='p-5'>
        <button className='w-full'>
            <div className='w-full flex justify-between'>
                <button className={className} onClick={() => handleView('timeGridDay')}>Day</button>
                <button className={className} onClick={() => handleView('timeGridWeek')}>Week</button>
                <button className={className} onClick={() => handleView('dayGridMonth')}>Month</button>
            </div>
        </button>
        
    </div>
    )
}
export default ViewOptions;