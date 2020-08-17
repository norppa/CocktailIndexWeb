import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Viewer from './components/viewer/Viewer'
import Editor from './components/editor/Editor'
import { getCocktails } from './modules/rest'

const App = (props) => {
    const [error, setError] = useState(null)
    const [cocktails, setCocktails] = useState([])
    const [selected, setSelected] = useState(null)
    const [editorView, setEditorView] = useState(false)

    const initializeCocktails = async () => {
        const dbCocktails = await getCocktails()
        if (dbCocktails.error) {
            setError('could not read API, status ' + dbCocktails.error)
        } else {
            setCocktails(dbCocktails)
        }
    }

    useEffect(() => {
        initializeCocktails()
    }, [])

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

if (error) {
    return <div>ERROR: {error}</div>
}

if (editorView) {
    return <Editor cocktail={cocktails[selected]}
                close={closeEditorView} />
}

return (<div>
    <Viewer cocktails={cocktails}
        selectedIdx={selected}
        select={select}
        openEditor={openEditorView} />
</div>
)

}

ReactDOM.render(<App />, document.getElementById('cocktail-index'))