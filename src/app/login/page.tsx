import React from 'react'
import '../styles/login.css'

type Props = {}

const Login = () => {
    return (
        <div className='login-main'>
            <div className='login-container'>
                <h1 className='login-title'>Login</h1>
                <form className='login-form'>
                    <input type="text" placeholder='Username' className='login-input' />
                    <input type="password" placeholder='Password' className='login-input' />
                    <div style={{ textAlign: 'right', marginBottom: '1em' }}>
                        <a href="/forgot-password" style={{ textDecoration: 'none', fontSize: '0.9em' }}>Forgot password?</a>
                    </div>
                    <button type="submit" className='login-button'>Login</button>
                </form>
                <div className="login-divider">or</div>
                <button className="login-google-button">
                    <img src="/google-logo.png" alt="Google" className="google-logo" />
                    Login with Google
                </button>
            </div>
        </div>
    )
}

export default Login