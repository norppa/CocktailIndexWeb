import React, { useEffect, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'

import IngredientNameInput from './IngredientNameInput'
import SelectGlassModal from './GlassSelectorModal'

import images from '../../img/images'
import '../../styles/global.css'
import './Editor.css'

const emptyIngredient = { name: '', amount: '' }

const alerts = {
    name_required: 'This cocktail needs a name!',
    ingredients_required: 'This cocktail needs some ingredients!'
}

const Input = (props) => (
    <div className="input">
        <h2>{props.name}</h2>
        <div className="content">
            {props.children}
        </div>
    </div>
)

const Editor = (props) => {
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [ingredients, setIngredients] = useState([emptyIngredient])
    const [garnish, setGarnish] = useState('')
    const [method, setMethod] = useState('Shaken')
    const [glass, setGlass] = useState(null)
    const [info, setInfo] = useState('')

    const [selectGlassModalOpen, setSelectGlassModalOpen] = useState(false)
    const [activeAlerts, setActiveAlerts] = useState([])

    useEffect(() => {
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

    }, [])

    useEffect(() => {
        if (name) removeAlert('name_required')
    }, [name])

    useEffect(() => {
        if (ingredients.length > 1) removeAlert('ingredients_required')
    }, [ingredients])

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

    const save = async () => {
        const newActiveAlerts = []
        if (!name) newActiveAlerts.push('name_required')
        if (ingredients.length === 1) newActiveAlerts.push('ingredients_required')
        if (newActiveAlerts.length > 0) {
            return setActiveAlerts(newActiveAlerts)
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
        props.save(cocktail)
    }

    const setters = {
        name: (event) => setName(event.target.value),
        garnish: (event) => setGarnish(event.target.value),
        method: (event) => setMethod(event.target.value),
        info: (event) => setInfo(event.target.value)
    }

    const selectGlass = (glass) => {
        setGlass(glass)
        setSelectGlassModalOpen(false)
    }

    const Alert = (props) => {
        if (activeAlerts.includes(props.type)) {
            return <div className="alert">{alerts[props.type]}</div>
        }
        return null
    }

    const removeAlert = (name) => setActiveAlerts(activeAlerts => activeAlerts.filter(activeAlert => activeAlert !== name))

    return (
        <div className="Editor">
            <Input name="Name">
                <input type="text" value={name} onChange={setters.name} />
            </Input>
            <Alert type="name_required" />

            <Input name="Ingredients" onFocus={() => console.log('foc')}>
                <div className="ingredients">
                    {ingredients.map((ingredient, index) => {
                        const { name, amount } = ingredient
                        return (
                            <div className="ingredientRow" key={index}>
                                <img src={images.dot} className="dot" />
                                <input type="text"
                                    className="ingredientAmountInput"
                                    value={amount}
                                    onChange={onIngredientAmountChange(index)} />
                                <IngredientNameInput
                                    availableIngredients={props.availableIngredients}
                                    value={name}
                                    onChange={onIngredientNameChange(index)} />
                            </div>
                        )
                    })}
                </div>
            </Input>
            <Alert type="ingredients_required" />

            <Input name="Garnish">
                <input type="text" value={garnish} onChange={setters.garnish} />
            </Input>

            <Input name="Method">
                <select value={method} onChange={setters.method}>
                    {props.availableMethods.map((method, i) => <option key={i} value={method}>{method}</option>)}
                </select>
            </Input>

            <Input name="Glassware">
                <div className="glassInfo" onClick={setSelectGlassModalOpen.bind(this, true)}>
                    <img src={images[glass]} className="glassImg" />
                    {glass}
                    <FaCaretDown />
                </div>
            </Input>
            <SelectGlassModal
                isOpen={selectGlassModalOpen}
                availableGlasses={props.availableGlasses}
                select={selectGlass} />

            <Input name="Information">
                <textarea value={info} onChange={setters.info} />
            </Input>

            <div className="buttons">
                <button onClick={save}>Save</button>
                <button onClick={props.close}>Cancel</button>
            </div>
        </div>
    )

}

export default Editor