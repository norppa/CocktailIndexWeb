const baseUrl = 'https://jtthaavi.kapsi.fi/subrosa/cocktail-index'

const getCocktails = async () => {
    const url = baseUrl
    const result = await fetch(url)
    if (result.status != 200) {
        console.error(result)
        return { error: result.status }
    } else {
        const cocktails = await result.json()
        return cocktails
    }
}

const getAvailable = async (type) => {
    const url = baseUrl + '/' + type
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

const saveCocktail = async (cocktail) => {
    const method = cocktail.id ? 'PUT' : 'POST'
    const url = baseUrl
    const result = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cocktail)
    })

    if (result.status != 200) {
        console.error(result)
        return result.status
    }
}

export {
    getCocktails,
    getAvailable,
    saveNewIngredient,
    saveCocktail
}