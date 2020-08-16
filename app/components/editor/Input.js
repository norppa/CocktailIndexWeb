import React from 'react'

import styles from './editor.module.css'

const Input = (props) => {

    return (
        <div>
            <div className={styles.header}>{props.name}</div>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    )
}

export default Input