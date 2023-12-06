import { useState } from 'react'
import '../styles/Login.css'


function Login() {

  return (
    <main>
      <div className='login-div'>
        <form action="POST" className='login-form'>
          <div className='login-form-inner-div'>
            <p className='login-p'>Log In</p>
          <label htmlFor="username" className='login-label'>User Name:</label>
          <input type="text" id='username'/>
          <br />
          <label htmlFor="password" className='login-label'>Password</label>
          <input type="password" id='password' />
          </div>
        </form>
      </div>
    </main>
  )
}

export default Login
