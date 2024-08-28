import React, { useState } from 'react'

const BoxPopup = ({ onSubmit, onClose, isOpen }) => {
    const [boxName, setBoxName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (boxName.trim()) {
            onSubmit(boxName);
            setBoxName('');
        }
    };

    if (!isOpen) return null;

    return (
    <div
    className= "bg-gray-700 bg-opacity-30 p-5 rounded-2xl flex justify-center shadow-lg"
    >
        <form onSubmit={handleSubmit}
        className='self-center'>
            <input 
            type="text" 
            value={boxName}
            onChange={(e) => setBoxName(e.target.value)}
            placeholder='Enter Box Name...'
            className="p-2 border-b bg-red-500 bg-opacity-0 mb-2 text-white placeholder-white focus:outline-none"
            />
            <div className='flex justify-between'>
                <button type='submit' className="bg-gray-700 bg-opacity-30 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500  rounded-xl text-wight px-4 py-2 transition-all">Add Box</button>
                <button type='button' onClick={onClose} className='mr-2 px-4 py-2 rounded-xl hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 transition-all'>Cancel</button>
            </div>
        </form>

    </div>
    )
}
export default BoxPopup;