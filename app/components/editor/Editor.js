import React, { useEffect, useState } from 'react'


import Autocomplete from './Autocomplete'

import styles from './editor.module.css'

import shaken from '../../img/shaken.png'
import stirred from '../../img/stirred.png'
import built from '../../img/built.png'
import dot from '../../img/dot.png'

const emptyIngredient = { name: '', amount: '' }

const Editor = (props) => {
    const [availableIngredients, setAvailableIngredients] = useState([])
    const [isNew, setIsNew] = useState(false)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('shaken')
    const [info, setInfo] = useState('')

    const [x, setX] = useState('')

    useEffect(() => {
        loadCocktailInfo()
        getAvailableIngredients()
    }, [])

    useEffect(() => {
        console.log('ingredients updated', ingredients)
    },[ingredients])

    const loadCocktailInfo = () => {
        if (!props.cocktail) {
            console.log('new cocktail')
            setIsNew(true)
        } else {
            console.log('edit cocktail')
            const { name, ingredients, garnish, method, info } = props.cocktail
            setName(name)
            setIngredients(ingredients.concat(emptyIngredient))
            garnish && setGarnish(garnish)
            method && setMethod(method)
            info && setInfo(info)

        }
    }

    const getAvailableIngredients = async () => {
        const result = await fetch('https://jtthaavi.kapsi.fi/subrosa/cocktail-index/ingredients')
        if (result.status != 200) {
            console.error(result)
        } else {
            const resultJson = await result.json()
            setAvailableIngredients(resultJson.map(item => item.name))
            console.log('available ingredients', resultJson.map(item => item.name))
        }
    }

    /*
    *  Ingredient list has always an empty item at the end. 
    */
    const changeIngredient = (index, property, value) => {
        const newIngredients = ingredients.map((item, i) => {
            if (i !== index) {
                return item
            } else {
                return { ...item, [property]: value }
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

    const changeIngredientAmount = (index) => (event) => {
        changeIngredient(index, 'amount', event.target.value)
    }

    const changeIngredientName = (index) => (value) => {
        changeIngredient(index, 'name', value)
    }

    const changeIngredientNew = (index) => (value) => {
        changeIngredient(index, 'new', value)
    }

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
                            const { name, amount } = ingredient
                            return (
                                <div className={styles.ingredientRow} key={index}>
                                    <img src={dot} className={styles.dot} />
                                    <input type="text"
                                        className={styles.ingredientAmountInput}
                                        value={amount}
                                        onChange={changeIngredientAmount(index)} />
                                    <Autocomplete
                                        options={availableIngredients}
                                        value={name}
                                        onChange={changeIngredientName(index)}
                                        onWildInput={changeIngredientNew(index)} />
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
                <div className={`${styles.content} ${styles.methodIcons}`}>
                    <img src={shaken}
                        alt="shaken"
                        className={method == 'shaken' ? styles.selectedIcon : styles.notSelectedIcon}
                        onClick={(setMethod.bind(this, 'shaken'))} />
                    <img src={stirred}
                        alt="stirred"
                        className={method == 'stirred' ? styles.selectedIcon : styles.notSelectedIcon}
                        onClick={setMethod.bind(this, 'stirred')} />
                    <img src={built}
                        alt="built"
                        className={method == 'built' ? styles.selectedIcon : styles.notSelectedIcon}
                        onClick={setMethod.bind(this, 'built')} />
                </div>
            </div>

            <div className={styles.info}>
                <div className={styles.header}>Information</div>
                <div className={styles.content}>
                    <textarea value={info} onChange={evt => setInfo(evt.target.value)} />
                </div>
            </div>

            <div className={styles.buttons}>
                <button>Save</button>
                <button>Cancel</button>
            </div>
        </div>
    )

}

export default Editor