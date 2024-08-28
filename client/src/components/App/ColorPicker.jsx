import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful';


const ColorPicker = ({ onColorChange }) => {

    const [color, setColor] = useState("#aabbcc");

    const handleChange = (newColor) => {
        setColor(newColor);
        onColorChange(newColor);
    }




    return (
    <div className=''>
        <HexColorPicker color={color} onChange={handleChange}/>
    </div>
    );
};
export default ColorPicker;