import React from 'react'

import styles from '../editor.module.css'

const MethodSelect = (props) => {
    const methods = [
        'Shaken',
        'Stirred',
        'Flash Blended',
        'Built'
    ]

    const handleChange = (event) => {
        props.onChange(event.target.value)
    }

    return (
        <div className="MethodSelect">
            <div className={styles.header}>Method</div>
            <div className={styles.content}>
                <select value={props.value} onChange={handleChange}>
                    {methods.map((method, i) => <option key={i} value={method}>{method}</option>)}
                </select>
            </div>
        </div>
    )
}

export default MethodSelect