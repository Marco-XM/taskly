import React from 'react'

const Registration = () => {
    return (
        <div>
            <form>
                <label>Name</label>
                <input type="text" placeholder='enter name...' />
                <label>Email</label>
                <input type="emial" placeholder='enter emial...' />
                <label>Password</label>
                <input type="password" placeholder='enter password...' />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
export default Registration;