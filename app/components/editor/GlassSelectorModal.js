import React, { useEffect } from 'react'
import Modal from 'react-modal'

import images from '../../img/images'

const GlassSelectorModal = (props) => {

    useEffect(() => {
        Modal.setAppElement('.Editor')
    }, [])

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            border: '1px solid black'
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.7)'
        }
    };

    return (
        <Modal isOpen={props.isOpen} contentLabel="Select glass" style={customStyles}>

            <h2>Select glass</h2>
            {props.availableGlasses.map(glass => {
                return (
                    <div key={glass} className="glassInfo" onClick={props.select.bind(this, glass)}>
                        <img src={images[glass]} className="glassImg" />{glass}
                    </div>
                )
            })}

        </Modal>
    )
}

export default GlassSelectorModal