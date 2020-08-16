import React, { useEffect, useState } from 'react'


import Autocomplete from './Autocomplete'
import {
    getAvailableIngredients,
    saveNewIngredient,
    updateExistingCocktail
} from '../../modules/rest'

import GlassSelect from './GlassSelect/GlassSelect'

import styles from './editor.module.css'
import images from '../../img/images'

const emptyIngredient = { name: '', amount: '' }

const Editor = (props) => {
    const [availableIngredients, setAvailableIngredients] = useState([])
    const [isNew, setIsNew] = useState(false)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('shaken')
    const [glass, setGlass] = useState(null)
    const [info, setInfo] = useState('')

    const [x, setX] = useState('')

    useEffect(() => {
        loadCocktailInfo()
        const fetchAvailableIngredients = async () => {
            const result = await getAvailableIngredients()
            setAvailableIngredients(result)
        }
        fetchAvailableIngredients()

    }, [])

    useEffect(() => {
        console.log('ingredients updated', ingredients)
    }, [ingredients])

    const loadCocktailInfo = () => {
        const { name, ingredients, garnish, method, info } = props.cocktail
        setName(name)
        setIngredients(ingredients.concat(emptyIngredient))
        garnish && setGarnish(garnish)
        method && setMethod(method)
        info && setInfo(info)
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

    const save = () => {
        console.log('saving')
        if (ingredients.some(ingredient => ingredient.isNew)) {
            console.error('cant save with new ingredients')
            return
        }

        const cocktail = { id: props.cocktail.id, name, ingredients: ingredients.slice(0, newIngredients.length - 1), garnish, method, info }
        console.log('saving', cocktail)

        let result
        if (!cocktail.id) {
            result = saveNewCocktail(cocktail)
        } else {
            result = updateExistingCocktail(cocktail)
        }

        if (result.error) {
            console.error('could not save cocktail', result.error)
        }
    }

    const handleMethodChange = (event) => setMethod(event.target.value)

    return (
        <div className={styles.editor}>

            <div className={styles.name}>
                <div className={styles.header}>Name</div>
                <div className={styles.content}>
                    <input type="text" value={name} onChange={evt => setName(evt.target.value)} />
                </div>
            </div>

            <div className={styles.ingredients}>
                <div className={styles.header}>Ingredients</div>
                <div className={styles.content}>
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
                </div>
            </div>

            <div className={styles.garnish}>
                <div className={styles.header}>Garnish</div>
                <div className={styles.content}>
                    <input type="text" value={garnish} onChange={evt => setGarnish(evt.target.value)} />
                </div>
            </div>

            <div className={styles.method}>
                <div className={styles.header}>Method</div>
                <div className={styles.content}>
                    <select value={method} onChange={handleMethodChange}>
                        <option value="Shaken">Shaken</option>
                        <option value="Stirred">Stirred</option>
                        <option value="Flash Blended">Flash Blended</option>
                        <option value="Built">Built</option>
                    </select>
                </div>
            </div>

            <GlassSelect
                value={glass}
                onChange={setGlass}
                />

            <div className={styles.info}>
                <div className={styles.header}>Information</div>
                <div className={styles.content}>
                    <textarea value={info} onChange={evt => setInfo(evt.target.value)} />
                </div>
            </div>

            <div className={styles.buttons}>
                <button onClick={save}>Save</button>
                <button>Cancel</button>
            </div>
        </div>
    )

}

export default Editor