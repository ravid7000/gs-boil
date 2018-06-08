function isUrl(url) {
    if (url.indexOf('https://') === 0 || url.indexOf('git@') === 0) {
        return true
    }
    return false
}

function isString(str) {
    return typeof str === 'string'
}

function isArray(arr) {
    return Array.isArray(arr)
}

function isObject(obj) {
    return obj instanceof Object
}

function includes(arr, str) {
    if (isArray(arr) && arr.includes(str)) return true
    return false
}

module.exports = {
    isUrl,
    isString,
    isArray,
    isObject,
    includes
}
