import React, { useState } from 'react'
import { users } from '../../modules/rest'

import '../../styles/global.css'
import './Login.css'

const Login = (props) => {
    const [mode, setMode] = useState('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const onChange = (variable) => {
        switch (variable) {
            case 'username': return (event) => setUsername(event.target.value)
            case 'password': return (event) => setPassword(event.target.value)
        }
    }

    const changeMode = () => {
        setMode(message('register', 'login'))
        setError(false)
    }

    const submit = async () => {
        if (!username) return setError('Please enter username.')
        if (!password) return setError('Please enter password.')

        setError(false)
        if (mode === 'login') {
            props.login(username, password)
        } else {
            props.register(username, password)
        }
    }

    const message = (loginMsg, registerMsg) => mode === 'login' ? loginMsg : registerMsg

    return (
        <div className="Login">
            <div className="box">
                <h1>Cocktail Index</h1>
                <input type="text" placeholder="Username" value={username} onChange={onChange('username')} />
                <input type="password" placeholder="Password" value={password} onChange={onChange('password')} />
                <button onClick={submit}>{message('Log In', 'Register')}</button>
                <div className="error">{error || props.error}</div>
            </div>
            <div className="box">
                <span>
                    {message('Don\'t', 'Already')} have an account? &nbsp;
                    <a onClick={changeMode}>{message('Sign Up', 'Log In')}</a>
                </span>
            </div>
        </div>
    )

}

export default Login