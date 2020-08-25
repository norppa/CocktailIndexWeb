import React, { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs'

import styles from './viewer.module.css'
import Cocktail from './Cocktail'

const Viewer = (props) => {
    const [searchInputValue, setSearchInputValue] = useState('')

    const handleSearchInputChange = (event) => setSearchInputValue(event.target.value)

    const select = (index, setNull) => {
        if (setNull) {
            props.select(null)
        } else {
            props.select(index)
        }
    }

    return (
        <div className={styles.Viewer}>
            <div className={styles.controls}>
                <input type="text" value={searchInputValue} onChange={handleSearchInputChange} />
                <BsPencilSquare className={styles.editIcon} size={32} onClick={props.openEditor} />
            </div>

            {props.cocktails
                .filter(cocktail => cocktail.name.toLowerCase().includes(searchInputValue.toLowerCase()))
                .map((cocktail, index) => {
                    return (
                        <Cocktail key={index + cocktail.name}
                            selected={index == props.selectedIdx}
                            select={select.bind(this, index)}
                            cocktail={cocktail} />
                    )
                })}
        </div>
    )

}

export default Viewer