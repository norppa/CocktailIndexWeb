import React, { useEffect, useState } from 'react'

import styles from './editor.module.css'

const emptyIngredient = { name: '', amount: '' }

const Editor = (props) => {
    const [isNew, setIsNew] = useState(false)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('shaken')
    const [info, setInfo] = useState('')

    useEffect(() => init(), [])

    const init = () => {
        if (!props.cocktail) {
            setIsNew(true)
        } else {
            const { name, ingredients, garnish, method, info } = props.cocktail
            setName(name)
            setIngredients(ingredients.concat(emptyIngredient))
            garnish && setGarnish(garnish)
            method && setMethod(method)
            info && setInfo(info)

        }
    }

    /*
    *  Ingredient list has always an empty item at the end. 
    */
    const changeIngredient = (index, property) => (event) => {
        const newIngredients = ingredients.map((item, i) => {
            if (i !== index) {
                return item
            } else {
                return { ...item, [property]: event.target.value }
            }            
        })

        // if a property value was added to the last item, create a new empty last item
        if (index == ingredients.length - 1) {
            newIngredients.push(emptyIngredient)
        }

        // if second to last ingredient is empty, remove the last (empty) ingredient
        if (index == ingredients.length - 2) {
            const { name, amount } = newIngredients[index]
            if (name == '' && amount == '') {
                newIngredients.pop()
            }
        }

        setIngredients(newIngredients)
    }

    const changeIngredientAmount = (index, event) => {
        const amount = event.target.value
        setIngredients(ingredients => ingredients.map((ingredient, i) => {
            if (i !== index) {
                return ingredient
            } else {
                return {...ingredient, amount }
            }
        }))
    }

    const changeIngredientName = (index, event) => {
        const name = event.target.value
        setIngredients(ingredients => ingredients.map((ingredient, i) => {
            if (i !== index) {
                return ingredient
            } else {
                return {...ingredient, name }
            }
        }))
    }

    const addNewIngredient = (parameter, event) => {
        const newIngredient = { name: '', amount: '', [parameter]: event.target.value}
        setIngredients(ingredients => ingredients.concat(newIngredient))
    }

    return (
        <div className={styles.editor}>
            <div className={styles.name}>
                Name: <input type="text" value={name} onChange={evt => setName(evt.target.value)} />
            </div>

            <div className={styles.ingredients}>
                {ingredients.map((ingredient, index) => {
                    const {name, amount} = ingredient
                    return (
                        <div key={index}>
                            {`\u2022`} 
                            <input type="text" value={amount} onChange={changeIngredient(index, 'amount')} /> 
                            <input type="text" value={name} onChange={changeIngredient(index, 'name')} />
                        </div>
                    )
                })}
            </div>

            <div className={styles.garnish}>
                Garnish: <input type="text" value={garnish} onChange={evt => setGarnish(evt.target.value)} />
            </div>

            <div className={styles.method}>
                Method:
                <select value={method} onChange={evt => setMethod(evt.target.value)}>
                    <option value="shaken">Shaken</option>
                    <option value="stirred">Stirred</option>
                    <option value="built">Built</option>
                </select>
            </div>

            <div className={styles.info}>
                Info: <textarea value={info} onChange={evt => setInfo(evt.target.value)} />
            </div>
        </div>
    )

}

export default Editor