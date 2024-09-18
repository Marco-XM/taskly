import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const navigat = useNavigate()

    const routeLogin = () => {
        navigat('/login')
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const existingToken = localStorage.getItem('token');

    if (existingToken) {
        // Clear the existing token
        localStorage.removeItem('token');
        console.log('Existing session cleared');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://taskly-backend-one.vercel.app/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                navigat('/app');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred');
        }
    };
    const className="text-white m-4 p-5 bg-red-50 bg-opacity-0 border-b"
    return (
        <div className='grid grid-rows-2'>
            <div className='flex justify-center m-10'>
                <h1 className='text-7xl'>Register</h1>
            </div>
            <div className='flex justify-center'>
                <div>
                    <form onSubmit={handleSubmit} className='flex flex-col'>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className={className}
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className={className}
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className={className}
                        />
                        <div className='flex justify-between'>
                            <button type="submit">Signup</button>
                            <div className='flex flex-col justify-self-end'>
                                <button type="button" onClick={routeLogin}>Login</button>
                            </div>
                        </div>
                        <h3 className='text-xs text-gray-500 flex self-end'>If you have already account</h3>
                    </form>
                </div>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Registration;
