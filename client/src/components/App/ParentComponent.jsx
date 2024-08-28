import React, { useState } from 'react';
import BoxListOptions from './BoxListOptions';

const ParentComponent = () => {
    const [boxColor, setBoxColor] = useState('#ffffff'); // Default color for the box

    const handleColorChange = (color) => {
        setBoxColor(color); // Update the color state
    };

    return (
        <div style={{ backgroundColor: boxColor }} className="w-64 h-64 p-4">
            <BoxListOptions
                isOpen={true}
                onToggle={() => {}}
                onRemove={() => {}}
                onEdit={() => {}}
                onColorChange={handleColorChange} // Pass the color change handler
            />
        </div>
    );
};

export default ParentComponent;