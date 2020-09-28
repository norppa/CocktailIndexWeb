// const baseUrl = 'https://jtthaavi.kapsi.fi/subrosa/cocktail-index'

// const getCocktails = async () => {
//     const url = baseUrl
//     const result = await fetch(url)
//     if (result.status != 200) {
//         console.error(result)
//         return { error: result.status }
//     } else {
//         const cocktails = await result.json()
//         return cocktails
//     }
// }

// const getAvailable = async (type) => {
//     const url = baseUrl + '/' + type
//     const result = await fetch(url)
//     if (result.status != 200) {
//         console.error(result)
//         return []
//     } else {
//         const resultJson = await result.json()
//         return resultJson.map(item => item.name)
//     }
// }

// const saveNewIngredient = async (name) => {
//     const url = baseUrl + '/ingredient'
//     const body = { ingredient: name }
//     const result = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//     })

//     if (result.ok) {
//         return {}
//     } else {
//         return { error: await result.text() }
//     }
// }

// const saveCocktail = async (cocktail) => {
//     const method = cocktail.id ? 'PUT' : 'POST'
//     const url = baseUrl
//     const result = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(cocktail)
//     })

//     if (result.status != 200) {
//         console.error(result)
//         return result.status
//     }
// }

// ^ OLD STUFF

const baseUrl = 'https://jtthaavi.kapsi.fi/subrosa/cocktailindex'

const login = async (username, password) => {
    const url = baseUrl + '/users/login'
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    }

    try {
        const result = await fetch(url, request)
        if (result.status === 200) {
            return await result.json()
        } else {
            return { error: true, status: result.status }
        }

    } catch (error) {
        console.error(error)
        return { error: 'Server error', status: 500 }
    }
}

const register = async (username, password) => {
    const url = baseUrl + '/users/register'
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    }

    try {
        const result = await fetch(url, request)
        if (result.status === 200) {
            return await result.json()
        } else {
            return result
        }

    } catch (error) {
        console.error(error)
        return { error: 'Server error', status: 500 }
    }
}

const getCocktails = async (token) => {
    const url = baseUrl + '/cocktails'
    const request = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    }

    try {
        const result = await fetch(url, request)
        if (result.status === 200) {
            console.log('result', result)
            return await result.json()
        }
        throw new Error(result)
    } catch (error) {
        console.error(error)
        return { error }
    }
}

module.exports = {
    // getCocktails,
    // getAvailable,
    // saveNewIngredient,
    // saveCocktail,

    usersApi: {
        login,
        register
    },
    cocktailApi: {
        get: getCocktails
    }
}