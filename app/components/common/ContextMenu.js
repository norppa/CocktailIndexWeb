import React, { useEffect, useCallback, useState, useRef } from "react";

import './ContextMenu.css'

const ContextMenu = ({ container, visible, setVisible, actions }) => {
    const [xPos, setXPos] = useState("0px");
    const [yPos, setYPos] = useState("0px");
    const [id, setId] = useState('')

    const handleContextMenu = useCallback((event) => {
        if (container.current.contains(event.target)) {
            event.preventDefault()
            setId(event.target.closest('.Cocktail').id)
            setXPos(`${event.pageX}px`)
            setYPos(`${event.pageY}px`)
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [])

    const handleClick = (event) => {
        setVisible(false)
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", handleContextMenu);
        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    });

    if (visible) {
        return (
            <ul className="menu" style={{ top: yPos, left: xPos }}>
                <li onClick={actions.edit.bind(this, id)}>Edit</li>
                <li onClick={actions.remove.bind(this, id)}>Delete</li>
                <li onClick={actions.edit.bind(this, null)}>New Cocktail</li>
            </ul>
        );
    }
    return null;
};

export default ContextMenu;