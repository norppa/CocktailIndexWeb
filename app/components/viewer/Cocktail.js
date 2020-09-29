import React, { useState } from 'react'

import images from '../../img/images'
import '../../styles/global.css'
import './Cocktail.css'

const Cocktail = (props) => {
    const [expanded, setExpanded] = useState(false)

    const toggleExpanded = () => setExpanded(expanded => !expanded)

    const GarnishText = () => props.cocktail.garnish && <div>Garnish: {props.cocktail.garnish}</div>
    const InfoText = () => props.cocktail.info && <div className="info">{props.cocktail.info}</div>
    const GlassIcon = () => props.cocktail.glass && <img className="glassImg" src={images[props.cocktail.glass]} alt={props.cocktail.glass} />

    const Expanded = () => (
        <div className="Cocktail expanded" onClick={toggleExpanded}>
            <h1 className="header">{props.cocktail.name}</h1>
            <div className="ingredients">
                {props.cocktail.ingredients.map((ingredient, index) => {
                    return (
                        <div key={index + ingredient.name}>
                            {`\u2022 ${ingredient.amount} ${ingredient.name}`}
                        </div>
                    )
                })}

                <GarnishText />
            </div>

            <div className="instructions">
                <GlassIcon />
                {props.cocktail.method}
            </div>

            <InfoText />
        </div>
    )

    if (expanded) return <Expanded />

    return (
        <div className="Cocktail" onClick={toggleExpanded}>
            <h1 className="header">{props.cocktail.name}</h1>
        </div>
    )

}

export default Cocktail