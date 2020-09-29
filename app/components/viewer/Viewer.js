import React, { useEffect, useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs'

import Cocktail from './Cocktail'

import '../../styles/global.css'
import './Viewer.css'

const Viewer = (props) => {
    const [searchInputValue, setSearchInputValue] = useState('')

    const handleSearchInputChange = (event) => setSearchInputValue(event.target.value)

    return (
        <div className="Viewer">
            <div className="controls">
                <input type="text" placeholder="Search" value={searchInputValue} onChange={handleSearchInputChange} />
                <BsPencilSquare className="icon" size={32} onClick={props.openEditor} />
            </div>

            {props.cocktails
                .filter(cocktail => cocktail.name.toLowerCase().includes(searchInputValue.toLowerCase()))
                .map((cocktail, index) => {
                    return (
                        <Cocktail key={index + cocktail.name}
                            cocktail={cocktail} />
                    )
                })}
        </div>
    )

}

export default Viewer