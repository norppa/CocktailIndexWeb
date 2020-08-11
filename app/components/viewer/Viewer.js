import React, {useEffect, useState} from 'react'

import styles from './viewer.module.css'
import Cocktail from './Cocktail'

const Viewer = (props) => {
    const [searchInputValue, setSearchInputValue] = useState('')

    const handleSearchInputChange = (event) => setSearchInputValue(event.target.value)

    return(
            <div className={styles.Viewer}>
                <input type="text" value={searchInputValue} onChange={handleSearchInputChange} />
                {props.cocktails
                    .filter(cocktail => cocktail.name.toLowerCase().includes(searchInputValue.toLowerCase()))
                    .map((cocktail, index) => <Cocktail key={index + cocktail.name} cocktail={cocktail} />)}
            </div>
        )
    
}

export default Viewer