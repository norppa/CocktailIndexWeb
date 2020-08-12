import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Viewer from './components/viewer/Viewer'
import Editor from './components/editor/Editor'

const App = (props) => {
    const [error, setError] = useState(null)
    const [cocktails, setCocktails] = useState([])
    const [selected, setSelected] = useState(0)
    const [editorView, setEditorView] = useState(false)

    useEffect(() => {
        readDatabase()
    }, [])

    const readDatabase = async () => {
        console.log('readDatabase')
        const result = await fetch('https://jtthaavi.kapsi.fi/subrosa/cocktail-index')
        if (result.status != 200) {
            console.error(result)
            setError('could not read API, status ' + result.status)
        } else {
            const cocktails = await result.json()
            setCocktails(cocktails)
        }
    }

    const select = (index) => {
        if (selected == index) {
            setSelected(null)
        } else[
            setSelected(index)
        ]
    }

    if (error) {
        return <div>ERROR: {error}</div>
    }

    if (editorView) {
        return <Editor cocktail={cocktails[selected]} />
    }

    console.log(selected)
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