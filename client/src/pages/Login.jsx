import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const routeRegister = () => {
        navigate('/register')
    }

const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = data;

    console.log('Submitting login with:', { email, password });
    const base64UrlDecode = (str) => {
        // Convert Base64Url to Base64
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        // Pad Base64 string if necessary
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        // Decode Base64 string to a string
        return atob(base64);
        };
    
        const decodeJwt = (token) => {
        if (!token) {
            throw new Error('No token provided');
        }
    
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT does not have 3 parts');
        }
    
        const payload = parts[1];
        const decodedPayload = base64UrlDecode(payload);
        return JSON.parse(decodedPayload);
        };
    
      // Helper function to get userId from the token
        const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeJwt(token);
          return decoded._id;  // Assuming your JWT contains the userId as _id
        }
        return null;
        };
    
        const userId = getUserIdFromToken();

    try {
        const response = await fetch('https://taskly-backend-one.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status);
        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (response.ok) {
            localStorage.setItem('token', responseData.token);  // Store token
            console.log('Login successful:', responseData);
            navigate(`/app/${userId}`);  // Navigate to the protected page after login
        } else {
            console.error('Login failed:', responseData.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Failed to login:', error);
    }
};


    return (
        <div className='grid gap-40 grid-rows-2'>
            <div className='flex justify-center m-10'>
                <h1 className='text-7xl'>Login</h1>
            </div>
            <div className='flex justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <input 
                        type="email" 
                        className="text-white m-4 p-5 bg-red-50 bg-opacity-0 border-b" 
                        placeholder='Enter email...' 
                        value={data.email} 
                        onChange={(e) => setData({...data, email: e.target.value})}
                    />
                    <input 
                        type="password" 
                        className="text-white m-4 p-5 bg-red-50 bg-opacity-0 border-b" 
                        placeholder='Enter password' 
                        value={data.password} 
                        onChange={(e) => setData({...data, password: e.target.value})}
                    />
                    <div className='flex justify-between'>
                        <button type='submit'>Login</button>
                        <button type='button' onClick={routeRegister}>Signup</button>
                    </div>
                    <h3 className='flex self-end text-xs text-gray-500'>If you don't have account</h3>
                </form>
            </div>
        </div>
    )
}

export default Login;
