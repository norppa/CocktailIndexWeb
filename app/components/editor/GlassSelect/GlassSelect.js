import React from 'react'
import classnames from 'classnames'

import styles from '../editor.module.css'
import './GlassSelect.css'
import images from '../../../img/images'

const GlassSelect = (props) => {

    const glassTypes = [
        'coupe',
        'oldFashioned',
        'doubleOldFashioned'
    ]

    const handleClick = (glassType) => {
        props.onChange(glassType)
    }

    console.log('asdfa', props.value)

    return (
        <div className="GlassSelect">
            <div className={styles.header}>Glassware</div>
            <div className={styles.content}>
                {glassTypes.map((type, i) => {
                    return (
                            <img className={type == props.value ? 'selected' : null}
                                src={images[type]}
                                onClick={handleClick.bind(this, type)}
                            />
                    )
                })}
            </div>
        </div>
    )
}

export default GlassSelect