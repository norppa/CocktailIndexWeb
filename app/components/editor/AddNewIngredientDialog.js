import React, { useState, useRef } from 'react'
import Modal from 'react-modal'

import { saveNewIngredient } from '../../modules/rest'

const AddNewIngredientDialog = (props) => {
    const [error, setError] = useState(null)

    Modal.setAppElement('#cocktail-index')

    const selectYes = async (event) => {
        setError(null)
        const result = await saveNewIngredient(props.ingredient)
        if (result.error) {
            setError(result.error)
        } else {
            props.close(false)
            props.updateAvailableIngredients()
        }
    }

    const selectNo = () => {
        setError(null)
        props.close(true)
    }

    const Error = () => {
        if (error) {
            return (
                <p style={styles.error}>
                    There was the following error while trying to save new ingredient:
                    <blockquote style={styles.blockquote}>{error}</blockquote>
                Would you like to retry?
                </p>
            )

        }

        return null
    }

    return (
        <Modal
            isOpen={props.isOpen}
            style={styles}
            contentLabel="Add New Ingredient">

            <h2 style={styles.modalHeader}>New ingredient</h2>
            <p>The ingredient "{props.ingredient}" does not exist. Would you like to create it?</p>

            <Error />

            <div style={styles.buttons}>
                <button style={styles.button} onClick={selectYes}>Yes</button>
                <button style={styles.button} onClick={selectNo}>No</button>
            </div>

        </Modal>
    )
}

export default AddNewIngredientDialog

const styles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: '2px solid black',
        borderRadius: 10,
        boxShadow: '4px 4px gray',
    },
    modalHeader: {
        fontFamily: 'Cherry Cream Soda',
        fontSize: '18pt',
        marginTop: 0
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    button: {
        border: '2px solid black',
        borderRadius: '5px',
        backgroundColor: ' white',
        fontFamily: 'Cherry Cream Soda',
        fontSize: '18pt',
        boxShadow: '2px 2px gray',
        outline: 'none',
    },
    error: {
        border: '2px solid darkred',
        borderRadius: 10,
        padding: 10,
        color: 'darkred'
    },
    blockquote: {
        fontFamily: 'arial'
    }
}