import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Viewer from './components/viewer/Viewer'
import Editor from './components/editor/Editor'
import { getCocktails } from './modules/rest'

const App = (props) => {
    const [error, setError] = useState(null)
    const [cocktails, setCocktails] = useState([])
    const [selected, setSelected] = useState(0)
    const [editorView, setEditorView] = useState(false)

    useEffect(() => {
        const initializeCocktails = async () => {
            const dbCocktails = await getCocktails()
            if (dbCocktails.error) {
                setError('could not read API, status ' + dbCocktails.error)
            } else {
                setCocktails(dbCocktails)
            }
        }
        initializeCocktails()
    }, [])

const select = (index) => {
    if (selected == index) {
        setSelected(null)
    } else {
        setSelected(index)
    }
}

if (error) {
    return <div>ERROR: {error}</div>
}

if (editorView) {
    return <Editor cocktail={cocktails[selected]} />
}

return (<div>
    <button onClick={setEditorView.bind(this, true)}>edit</button>
    <Viewer cocktails={cocktails}
        selectedIdx={selected}
        select={select}
        setEditorView={setEditorView} />
</div>
)

}

ReactDOM.render(<App />, document.getElementById('app'))