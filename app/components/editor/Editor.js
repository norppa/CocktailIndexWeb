import React, { useEffect, useState } from 'react'

import styles from './editor.module.css'

import shaken from '../../img/shaken.png'
import stirred from '../../img/stirred.png'
import built from '../../img/built.png'
import dot from '../../img/dot.png'

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
                return { ...ingredient, amount }
            }
        }))
    }

    const changeIngredientName = (index, event) => {
        const name = event.target.value
        setIngredients(ingredients => ingredients.map((ingredient, i) => {
            if (i !== index) {
                return ingredient
            } else {
                return { ...ingredient, name }
            }
        }))
    }

    const addNewIngredient = (parameter, event) => {
        const newIngredient = { name: '', amount: '', [parameter]: event.target.value }
        setIngredients(ingredients => ingredients.concat(newIngredient))
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
                                        onChange={changeIngredient(index, 'amount')} />
                                    <input type="text"
                                        className={styles.ingredientNameInput}
                                        value={name}
                                        onChange={changeIngredient(index, 'name')} />
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