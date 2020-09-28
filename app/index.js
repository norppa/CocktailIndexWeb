import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Login from './components/login/Login'
import Viewer from './components/viewer/Viewer'
import Editor from './components/editor/Editor'
import { getCocktails } from './modules/rest'

const views = {
    LOGIN: 'login',
    VIEWER: 'viewer',
    EDITOR: 'editor',
    ERROR: 'error'
}
const TOKEN_KEY = '@CocktailIndexToken'

const App = (props) => {
    const [view, setView] = useState('')
    const [error, setError] = useState(null)
    const [cocktails, setCocktails] = useState([])
    const [selected, setSelected] = useState(null)
    const [editorView, setEditorView] = useState(false)

    useEffect(() => {
        console.log('useEffect')
        const token = localStorage.getItem(TOKEN_KEY)
        initialize(token)
    }, [])

    const initialize = async (token) => {
        console.log('initializing', token)
        if (token === null) {
            console.log('token is null')
            return setView(views.LOGIN)
        } 
        const dbCocktails = await getCocktails()
        if (dbCocktails.error) {
            setError('could not read API, status ' + dbCocktails.error)
        } else {
            setCocktails(dbCocktails)
        }
    }

    const select = (index) => {
        if (selected == index) {
            setSelected(null)
        } else {
            setSelected(index)
        }
    }

    const closeEditorView = (withReload) => {
        if (withReload) {
            initializeCocktails()
        }
        setEditorView(false)
    }

    const openEditorView = () => {
        setEditorView(true)
    }

    switch (view) {
        case views.LOGIN:
            return <Login />
        case views.VIEWER:
            return <div>VIEWER</div>
        case views.EDITOR:
            return <div>EDITOR</div>
        case views.ERROR:
            return <div>ERROR</div>
        default:
            return <div>LOADING</div>
    }

}

ReactDOM.render(<App />, document.getElementById('cocktail-index'))