import React, { useState } from 'react';

import styles from './autocomplete.module.css'

const Autocomplete = (props) => {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedSuggestion, setSelectedSuggestion] = useState(0)
    const [suggestionList, setSuggestionList] = useState([])

    const onUserInput = (event) => {
        const newInput = event.target.value
        if (newInput == '') {
            props.onChange({ name: '', isNew: false })
        } else {
            const filteredSuggestions = props.options.filter(item => {
                return item.toLowerCase().includes(newInput.toLowerCase())
            })
            setSuggestionList(filteredSuggestions)
            setShowSuggestions(filteredSuggestions.length > 0)
            const isWildInput = !props.options.some(option => option.toLowerCase() == newInput.toLowerCase())
            console.log('isWildInput', isWildInput)
            props.onChange({ name: newInput, isNew: isWildInput })
        }


    }

    const onKeyDown = (event) => {
        if (!showSuggestions) return undefined

        const keyCode = event.keyCode
        if (keyCode == 38) { // UP
            const newSelectedSuggestion = Math.max(0, selectedSuggestion - 1)
            setSelectedSuggestion(newSelectedSuggestion)
            props.onChange({ name: suggestionList[newSelectedSuggestion], isNew: false })
        } else if (keyCode == 40) { // DOWN
            const newSelectedSuggestion = Math.min(suggestionList.length - 1, selectedSuggestion + 1)
            setSelectedSuggestion(newSelectedSuggestion)
            props.onChange({ name: suggestionList[newSelectedSuggestion], isNew: false })
        } else if (keyCode == 13) { // ENTER
            props.onChange({ name: suggestionList[selectedSuggestion], isNew: false })
            setShowSuggestions(false)
        } else if (keyCode == 9) { // TAB
            setShowSuggestions(false)
        }
    }

    const onMouseDown = (index) => () => {
        props.onChange({ name: suggestionList[index], isNew: false })
        setShowSuggestions(false)
    }

    const onBlur = () => {
        setShowSuggestions(false)
    }

    const onFocus = () => {
        const filteredSuggestions = props.options.filter(item => {
            return item.toLowerCase().includes(props.value.name.toLowerCase())
        })
        setSuggestionList(filteredSuggestions)
        setShowSuggestions(filteredSuggestions.length > 0)
    }

    const Suggestions = () => {
        if (!showSuggestions) return null

        return (
            <div className={styles.suggestions}>
                {
                    suggestionList.map((option, i) => {
                        const rowStyles = `${styles.suggestionRow} ${i == selectedSuggestion ? styles.selected : null}`
                        return (
                            <div key={i}
                                className={rowStyles}
                                onMouseDown={onMouseDown(i)}>{option}</div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className={styles.autocomplete}>
            <input type="text"
                className={`${styles.input} ${props.value.isNew ? styles.highlight : null}`}
                value={props.value.name}
                onChange={onUserInput}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                onFocus={onFocus}
            />
            <Suggestions />
        </div>
    )

}
export default Autocomplete;