import React from 'react'

const Header = ( {className} ) => {
    const buttons = ['Pricing', 'Why Us', 'About'];

    const renderButton = () => (
        buttons.map((element, index) => (
            <button key={index} className={className}>
                {element}
            </button>
        ))
    );
    return renderButton();
};

export default Header;