import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const routeRegitser = () => {
        navigate('/register')
    }

    const loginUser = (e) => {
        e.preventdefault()
        axios.get('/')
    }

    return (
        <div className='grid gap-40 grid-rows-2'>
            <div className='flex justify-center m-10'>
                <h1 className='text-7xl'>Login</h1>
            </div>
            <div className='flex justify-center'>
                <form onSubmit={loginUser} className='flex flex-col'>
                    <input type="email" className="text-white m-4 p-5 bg-red-50 bg-opacity-0 border-b" placeholder='Enter email...' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                    <input type="password" className="text-white m-4 p-5 bg-red-50 bg-opacity-0 border-b" placeholder='Enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                    <div className='flex justify-between'>
                        <button type='submit'>Login</button>
                        <button type='submit' onClick={routeRegitser}>Signup</button>
                    </div>
                    <h3 className='flex self-end text-xs text-gray-500'>If you don't have account</h3>
                </form>
            </div>
        </div>
    )
}
export  default Login;