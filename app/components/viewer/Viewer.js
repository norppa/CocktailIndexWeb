import React, {useEffect, useState} from 'react'

import styles from './viewer.module.css'
import Cocktail from './Cocktail'

// props.setSelected ei toimi, koska sen tulee palauttaa null tarpeen tullen

const Viewer = (props) => {
    const [searchInputValue, setSearchInputValue] = useState('')

    const handleSearchInputChange = (event) => setSearchInputValue(event.target.value)

    const select = (index, setNull) => {
        console.log('index', index, 'setNull', setNull)
        if (setNull) {
            props.select(null)
        } else {
            props.select(index)
        }
    }

    return(
            <div className={styles.Viewer}>
                <input type="text" value={searchInputValue} onChange={handleSearchInputChange} />
                {props.cocktails
                    .filter(cocktail => cocktail.name.toLowerCase().includes(searchInputValue.toLowerCase()))
                    .map((cocktail, index) => {
                        return (
                            <Cocktail key={index + cocktail.name}
                                selected={index == props.selectedIdx}
                                select={select.bind(this,index)}
                                cocktail={cocktail} />
                        )
                    })}
            </div>
        )
    
}

export default Viewer