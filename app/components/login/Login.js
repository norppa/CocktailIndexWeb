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

        if (mode === 'login') {
            login(username, password)
        } else {
            register(username, password)
        }
    }

    const login = async (username, password) => {
        const response = await users.login(username, password)
        if (response.error) {
            if (response.status === 401) {
                setError('Could not log in using these credentials. Please check your username and password.')
            } else {
                console.error(response.status, response.error)
                setError('There was a mysterious error that should not exist. Bugger. Please either try again later or contact an administrator if the problem persists.')
            }
        } else {
            setUsername('')
            setPassword('')
            props.login(response.token)
        }
    }

    const register = async (username, password) => {
        const response = await users.register(username, password)
        if (response.error) {
            if (response.error === 'Username taken') {
                setError('The username you tried to register is already taken. Please select another username.')
            } else {
                console.error(response.status, response.error)
                setError('There was a mysterious error that should not exist. Bugger. Please either try again later or contact an administrator if the problem persists.')
            }
        } else {
            setUsername('')
            setPassword('')
            props.login(response.token)
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
                <div className="error">{error}</div>
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