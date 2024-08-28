import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = (e) => {
        e.preventdefault()
        axios.get('/')
    }

    return (
        <div className='flex'>
            <form onSubmit={loginUser} className='flex flex-col'>
                <label>Email</label>
                <input type="email" placeholder='Enter email...' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                <label>Password</label>
                <input type="password" placeholder='Enter password' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}
export  default Login;