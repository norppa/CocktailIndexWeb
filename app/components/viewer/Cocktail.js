import React, { useEffect, useState } from 'react'
import styles from './viewer.module.css'

const Cocktail = (props) => {
    const [showAdditional, setShowAdditional] = useState(false)

    const toggleShowAdditional = () => {
        setShowAdditional((prevShowAdditional) => !prevShowAdditional)
    }

    const GarnishText = () => {
        if (!props.cocktail.garnish) {
            return null
        }
        return <div>Garnish: {props.cocktail.garnish}</div>
    }

    const InstructionsText = () => {
        if (!props.cocktail.instructions) {
            return null
        }

        return <div>{props.cocktail.instructions}</div>
    }

    const AdditionalInfo = () => {
        if (!showAdditional) {
            return null
        }

        return (<div className={styles.AdditionalInfo}>
            {props.cocktail.ingredients.map((ingredient, index) => {
                return (
                    <div className={styles.ingredients} key={index + ingredient.name}>
                        {`\u2022 ${ingredient.amount} ${ingredient.name}`}
                    </div>
                )
            })}

            <GarnishText />
            <InstructionsText />
        </div>)
    }

    return (
        <div className={styles.Cocktail} onClick={toggleShowAdditional}>
            <h1>{props.cocktail.name}</h1>
            <AdditionalInfo />
        </div>
    )

}

export default Cocktail