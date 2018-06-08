const pathExists = require('fs-extra').pathExists

module.exports = async function(path) {
    return await pathExists(path)
}
