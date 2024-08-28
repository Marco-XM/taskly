import React from 'react'
import { useNavigate } from 'react-router-dom';

const Join = ( {className} ) => {

    const navigate = useNavigate();

    const handleJoinNow = () => {
        navigate('/app');
    };

    return (
        <div onClick={handleJoinNow}>
            <button className={className}>Join Now</button>
        </div>
    )
}
export default Join;