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
    const [selected, setSelected] = useState(null)

    const [availableMethods, setAvailableMethods] = useState([])
    const [availableGlasses, setAvailableGlasses] = useState([])
    const [availableIngredients, setAvailableIngredients] = useState([])

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
        setToken(token)
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
        edit: async (id) => {
            const availableMethods = await cocktailApi.getAvailable('methods', token)
            const availableGlasses = await cocktailApi.getAvailable('glasses', token)
            const availableIngredients = Array.from(cocktails.reduce((acc, cur) => {
                cur.ingredients.forEach(ingredient => acc.add(ingredient.name))
                return acc
            }, new Set()))
            
            setAvailableMethods(availableMethods)
            setAvailableGlasses(availableGlasses)
            setAvailableIngredients(availableIngredients)
            setSelected(cocktails.find(cocktail => cocktail.id === id))
            setView(views.EDITOR)

        },
        remove: (id) => {
            const result = cocktailApi.del(id, token)
            setCocktails(cocktails => cocktails.filter(cocktail => cocktail.id !== id))
        },
        save: async (cocktail) => {
            const result = await cocktailApi.set(cocktail, token)
            const newCocktails = cocktail.id 
                ? cocktails.map(c => c.id === cocktail.id ? result : c)
                : cocktails.concat(result)
            setCocktails(newCocktails)
            setView(views.VIEWER)
        }
    }

    switch (view) {
        case views.LOGIN:
            return <Login login={login} register={register} error={error} />
        case views.VIEWER:
            return <Viewer cocktails={cocktails} actions={cocktailActions} />
        case views.EDITOR:
            return <Editor
                cocktail={selected}
                availableMethods={availableMethods}
                availableGlasses={availableGlasses}
                availableIngredients={availableIngredients}
                save={cocktailActions.save}
                close={setView.bind(this, views.VIEWER)} />

        case views.ERROR:
            return <div>ERROR: {error}</div>
        default:
            return <div>LOADING</div>
    }

}

ReactDOM.render(<App />, document.getElementById('cocktail-index'))