import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';


const BoxListOptions = ({ isOpen, onToggle, onRemove, onEdit, onClose, handleColorChange, index }) => {

    const [color, setColor] = useState('#ffffff'); // Initial color

    // Update local state when color is picked
    const handleChangeColor = () => {
        handleColorChange(index, color); // Pass the index and color
    };

    return (
        <div className='relative'>
            {isOpen && (
                <div className="absolute right-0 mt-2 p-5 bg-gray-700 backdrop-blur-sm bg-opacity-30 shadow-lg rounded-lg z-50">
                    <ul>
                        <div className='flex flex-col gap-5 justify-center'>
                            <button
                                className="px-1 py-2 text-center hover:bg-white hover:shadow-lg hover:shadow-white hover:text-black transition-all rounded-lg"
                                onClick={() => {
                                    onEdit();
                                    onToggle();
                                }}
                            >
                                Rename
                            </button>
                            <div className="px-1 py-2 text-center text-black hover:bg-white hover:shadow-lg hover:shadow-white transition-all rounded-lg task-list-options" style={{backgroundColor: color}}>
                                <button onClick={handleChangeColor} className='mb-5'>Change</button>
                                <HexColorPicker color={color} onChange={setColor} />
                            </div>
                            <button
                                className="px-9 py-2 text-center hover:bg-red-600 hover:shadow-lg hover:shadow-red-500 rounded-lg transition-all"
                                onClick={() => {
                                    onRemove();
                                    onToggle();
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BoxListOptions;
