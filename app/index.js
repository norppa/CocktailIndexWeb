import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import Viewer from './components/viewer/Viewer'

const bogusList = [
    {
        name: "ice water",
        method: "stirred",
        instructions: "be cool",
        garnish: "flower",
        ingredients: [
            { name: "water", amount: "1 oz" },
            { name: "ice", amount: "1 cube" }
        ]
    },
    {
        name: "regular water",
        method: "shaken",
        ingredients: [
            { name: "water", amount: "9 oz" },
            { name: "mint", amount: "1 leaf" }
        ]
    },
]

const App = (props) => {
    const [error, setError] = useState(null)
    const [cocktails, setCocktails] = useState([])

    useEffect(() => {
        readDatabase()
    }, [])

    const readDatabase = async () => {
        console.log('readDatabase')
        const result = await fetch('https://jtthaavi.kapsi.fi/subrosa/cocktail-index')
        if (result.status != 200) {
            console.error(result)
            setError('could not read API, status ' + JSON.stringify(result))
        } else {
            const cocktails = await result.json()
            console.log('result', cocktails)
            setCocktails(cocktails)
        }
    }

    if (error) {
        return <div>ERROR: {error}</div>
    }

    return (
        <Viewer cocktails={cocktails} />
    )

}

ReactDOM.render(<App />, document.getElementById('app'))