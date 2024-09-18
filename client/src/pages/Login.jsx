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
    
        try {
            const response = await fetch('https://taskly-backend-one.vercel.app/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);
    
            if (response.ok) {
                localStorage.setItem('token', responseData.token);  // Store token
                const userId = responseData.user._id;  // Assuming the response contains a 'user' object with the '_id'
                console.log('Login successful:', responseData);
                navigate(`/app/${userId}`);  // Navigate to /app/:userId
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
