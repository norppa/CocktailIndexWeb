const baseUrl = 'https://jtthaavi.kapsi.fi/subrosa/cocktail-index'

const getAvailableIngredients = async () => {
    const url = baseUrl + '/ingredients'
    const result = await fetch(url)
    if (result.status != 200) {
        console.error(result)
        return []
    } else {
        const resultJson = await result.json()
        return resultJson.map(item => item.name)
    }
}

const saveNewIngredient = async (name) => {
    const url = baseUrl + '/ingredient'
    const body = { name }
    const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    if (result.status != 200) {
        console.error(result)
        return false
    }

    return true
}

export {
    getAvailableIngredients,
    saveNewIngredient
}