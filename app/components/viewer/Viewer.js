import React, { useEffect, useState, useRef } from 'react'

import Cocktail from './Cocktail'
import ContextMenu from '../common/ContextMenu'

import '../../styles/global.css'
import './Viewer.css'

const Viewer = (props) => {
    const [searchInputValue, setSearchInputValue] = useState('')
    const [contextMenuVisible, setContextMenuVisible] = useState(false)

    const cocktailsRef = useRef(null)

    const handleSearchInputChange = (event) => setSearchInputValue(event.target.value)

    return (
        <div className="Viewer">
            <input type="text" placeholder="Search" value={searchInputValue} onChange={handleSearchInputChange} />

            <div className="cocktails" ref={cocktailsRef}>
                {props.cocktails
                    .filter(cocktail => cocktail.name.toLowerCase().includes(searchInputValue.toLowerCase()))
                    .map((cocktail, index) => {
                        return (
                            <Cocktail key={index + cocktail.name}
                                cocktail={cocktail}
                                menuOpen={contextMenuVisible} />
                        )
                    })}
            </div>


            <ContextMenu
                container={cocktailsRef}
                visible={contextMenuVisible}
                setVisible={setContextMenuVisible}
                actions={props.actions} />

        </div>
    )

}

export default Viewer