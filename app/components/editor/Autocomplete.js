import React, { useState } from 'react';

import styles from './autocomplete.module.css'

const Autocomplete = (props) => {
    const [userInput, setUserInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedSuggestion, setSelectedSuggestion] = useState(0)
    const [suggestionList, setSuggestionList] = useState([])

    const onUserInput = (event) => {
        const newInput = event.target.value
        if (newInput == '') {
            setShowSuggestions(false)
        } else {
            const filteredSuggestions = props.options.filter(item => {
                return item.toLowerCase().includes(newInput.toLowerCase())
            })
            setSuggestionList(filteredSuggestions)
            setShowSuggestions(true)
        }

        props.onChange(newInput)
    }

    const onKeyDown = (event) => {
        const keyCode = event.keyCode
        console.log(keyCode)
        if (keyCode == 38) { // UP
            const newSelectedSuggestion = Math.max(0, selectedSuggestion - 1)
            setSelectedSuggestion(newSelectedSuggestion)
            props.onChange(suggestionList[newSelectedSuggestion])
        } else if (keyCode == 40) { // DOWN
            const newSelectedSuggestion = Math.min(suggestionList.length - 1, selectedSuggestion + 1)
            setSelectedSuggestion(newSelectedSuggestion)
            props.onChange(suggestionList[newSelectedSuggestion])
        } else if (keyCode == 13) { // ENTER
            props.onChange(suggestionList[selectedSuggestion])
            setShowSuggestions(false)
        } else if (keyCode == 9) { // TAB
            setShowSuggestions(false)
        }
    }

    const onMouseDown = (index) => () => {
        props.onChange(suggestionList[index])
        setShowSuggestions(false)
    }

    const onBlur = () => {
        setShowSuggestions(false)
    }

    const onFocus = () => {
        if (props.value != '') {
            const filteredSuggestions = props.options.filter(item => {
                return item.toLowerCase().includes(props.value.toLowerCase())
            })
            setSuggestionList(filteredSuggestions)
            setShowSuggestions(true)
        }

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
                className={styles.input}
                value={props.value}
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