import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const existingToken = localStorage.getItem('token');

    if (existingToken) {
        // Clear the existing token
        localStorage.removeItem('token');
        console.log('Existing session cleared');
    }


    const routeLogin = () => {
        navigate('/login')
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://taskly-backend-one.vercel.app/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const responseData = await response.json();
            if (response.ok) {
                localStorage.setItem('token', responseData.token);  // Store token
                console.log('Signed Up successful:', responseData);
                const base64UrlDecode = (str) => {
                    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                    while (base64.length % 4 !== 0) {
                    base64 += '=';
                    }
                    return atob(base64);
                };
                const decodeJwt = (token) => {
                    const parts = token.split('.');
                    if (parts.length !== 3) {
                    throw new Error('JWT does not have 3 parts');
                    }
                    const payload = parts[1];
                    const decodedPayload = base64UrlDecode(payload);
                    return JSON.parse(decodedPayload);
                };
                const token = localStorage.getItem('token');
                const decodedToken = decodeJwt(token);
                const userId = decodedToken._id;
                console.log('Decoded userId:', userId);
                navigate(`/app/${userId}`);             
            } else {
                setMessage(responseData.error);
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
