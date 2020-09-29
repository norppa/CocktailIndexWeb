import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Login from './components/login/Login'
import Viewer from './components/viewer/Viewer'
import Editor from './components/editor/Editor'
import { usersApi, cocktailApi } from './modules/rest'

const views = {
    LOGIN: 'login',
    VIEWER: 'viewer',
    EDITOR: 'editor',
    ERROR: 'error'
}
const TOKEN_KEY = '@CocktailIndexToken'

const App = (props) => {
    const [view, setView] = useState('')
    const [token, setToken] = useState(false)
    const [error, setError] = useState(null)
    const [cocktails, setCocktails] = useState([])

    useEffect(() => {
        initialize(localStorage.getItem(TOKEN_KEY))
    }, [])

    const initialize = async (token) => {
        if (token === null) {
            console.log('token is null')
            return setView(views.LOGIN)
        }

        const cocktails = await cocktailApi.get(token)
        if (cocktails.error) {
            console.error(cocktails.error)
            setError('There is something wrong here...')
            setView(views.ERROR)
            return undefined
        }

        localStorage.setItem(TOKEN_KEY, token)
        setCocktails(cocktails)
        setError(false)
        setView(views.VIEWER)
    }

    const login = async (username, password) => {
        const response = await usersApi.login(username, password)
        if (response.error) {
            if (response.status === 401) {
                setError('Could not log in using these credentials. Please check your username and password.')
            } else {
                console.error(response.status, response.error)
                setError('There was a mysterious error that should not exist. Bugger. Please either try again later or contact an administrator if the problem persists.')
            }
        } else {
            initialize(response.token)
        }
    }

    const register = async (username, password) => {
        const response = await usersApi.register(username, password)
        if (response.error) {
            if (response.error === 'Username taken') {
                setError('The username you tried to register is already taken. Please select another username.')
            } else {
                console.error(response.status, response.error)
                setError('There was a mysterious error that should not exist. Bugger. Please either try again later or contact an administrator if the problem persists.')
            }
        } else {
            initialize(response.token)
        }
    }

    const cocktailActions = {
        edit: (id) => {
            if (!id) {
                console.log('open new editor')
            } else {
                console.log('edit existing', id)
            }
        },
        remove: (id) => {
            console.log('delete', id)
        }
    }

    switch (view) {
        case views.LOGIN:
            return <Login login={login} register={register} error={error} />
        case views.VIEWER:
            return <Viewer cocktails={cocktails} actions={cocktailActions} />
        case views.EDITOR:
            return <div>EDITOR</div>
        case views.ERROR:
            return <div>ERROR: {error}</div>
        default:
            return <div>LOADING</div>
    }

}

ReactDOM.render(<App />, document.getElementById('cocktail-index'))