import React, { useEffect, useState } from 'react'

import Input from './Input'
import Autocomplete from './Autocomplete'
import {
    saveNewIngredient,
    getAvailable,
    saveCocktail
} from '../../modules/rest'

import styles from './editor.module.css'
import images from '../../img/images'

const emptyIngredient = { name: '', amount: '' }

const Editor = (props) => {
    const [availableIngredients, setAvailableIngredients] = useState([])
    const [availableGlasses, setAvailableGlasses] = useState([])
    const [availableMethods, setAvailableMethods] = useState([])
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('Shaken')
    const [glass, setGlass] = useState(null)
    const [info, setInfo] = useState('')

    useEffect(() => {
        const fetchadditionalInfo = async () => {
            setAvailableIngredients(await getAvailable('ingredients'))
            setAvailableGlasses(await getAvailable('glasses'))
            setAvailableMethods(await getAvailable('methods'))
        }
        
        loadCocktailInfo()
        fetchadditionalInfo()

    }, [])

    const loadCocktailInfo = () => {
        if (props.cocktail) {
            const { id, name, ingredients, garnish, method, glass, info } = props.cocktail
            setId(id)
            setName(name)
            setIngredients(ingredients.concat(emptyIngredient))
            garnish && setGarnish(garnish)
            glass && setGlass(glass)
            method && setMethod(method)
            info && setInfo(info)
        }

    }

    /*
    *  Ingredient list has always an empty item at the end. 
    */
    const changeIngredient = (index, replacement) => {
        let newIngredients = ingredients.map((item, i) => {
            if (i !== index) {
                return item
            } else {
                return { ...item, ...replacement }
            }
        })

        // if a property value was added to the last item, create a new empty last item
        if (index == ingredients.length - 1) {
            newIngredients = newIngredients.concat(emptyIngredient)
        }

        // if second to last ingredient is empty, remove the last (empty) ingredient
        if (index == ingredients.length - 2) {
            const { name, amount } = newIngredients[index]
            if (name == '' && amount == '') {
                newIngredients = newIngredients.slice(0, newIngredients.length - 1)
            }
        }

        setIngredients(newIngredients)
    }

    const onIngredientAmountChange = (index) => (event) => {
        changeIngredient(index, { amount: event.target.value })
    }

    const onIngredientNameChange = (index) => (replacement) => {
        changeIngredient(index, replacement)
    }

    const addIngredient = async (index) => {
        const success = await saveNewIngredient(ingredients[index].name)
        if (success) {
            setAvailableIngredients(await getAvailableIngredients())
            setIngredients(ingredients => ingredients.map((ingredient, i) => {
                if (i == index) {
                    const { name, amount } = ingredients[index]
                    return { name, amount }
                } else {
                    return ingredient
                }
            }))
        }
    }

    const save = async () => {
        if (ingredients.some(ingredient => ingredient.isNew)) {
            console.error('cant save with new ingredients')
            return
        }

        const cocktail = {
            id: id ? id : undefined,
            name,
            ingredients: ingredients.slice(0, ingredients.length - 1),
            garnish,
            method,
            glass,
            info
        }
        const error = await saveCocktail(cocktail)
        if (error) {
            return console.error('could not save cocktail, error status:', error)
        }

        props.close(true)
    }

    const cancel = () => {
        props.close(false)
    }

    const setters = {
        name: (event) => setName(event.target.value),
        garnish: (event) => setGarnish(event.target.value),
        method: (event) => setMethod(event.target.value),
        glass: (type) => () => setGlass(type),
        info: (event) => setInfo(event.target.value)
    }

    return (
        <div className={styles.editor}>

            <Input name="Name">
                <input type="text" value={name} onChange={setters.name} />
            </Input>

            <Input name="Ingredients">
                <div>
                    {ingredients.map((ingredient, index) => {
                        const { name, amount, isNew } = ingredient
                        return (
                            <div className={styles.ingredientRow} key={index}>
                                <img src={images.dot} className={styles.dot} />
                                <input type="text"
                                    className={styles.ingredientAmountInput}
                                    value={amount}
                                    onChange={onIngredientAmountChange(index)} />
                                <Autocomplete
                                    options={availableIngredients}
                                    value={ingredient}
                                    onChange={onIngredientNameChange(index)} />
                                {
                                    isNew &&
                                    <button className={styles.addIngredientButton}
                                        onClick={addIngredient.bind(this, index)}>+</button>
                                }
                            </div>
                        )
                    })}
                </div>
            </Input>

            <Input name="Garnish">
                <input type="text" value={garnish} onChange={setters.garnish} />
            </Input>

            <Input name="Method">
                <select value={method} onChange={setters.method}>
                    {availableMethods.map((method, i) => <option key={i} value={method}>{method}</option>)}
                </select>
            </Input>

            <Input name="Glassware">
                {availableGlasses.map((availableGlass, i) => {
                    return (
                        <img key={i}
                            className={`${styles.glassImg} ${availableGlass == glass ? styles.selectedGlassImg : null}`}
                            src={images[availableGlass]}
                            onClick={setters.glass(availableGlass)}
                        />
                    )
                })}
            </Input>

            <Input name="Information">
                <textarea value={info} onChange={setters.info} />
            </Input>

            <div className={styles.buttons}>
                <button onClick={save}>Save</button>
                <button onClick={cancel}>Cancel</button>
            </div>
        </div>
    )

}

export default Editor