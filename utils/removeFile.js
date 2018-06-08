const remove = require('fs-extra').remove

module.exports = async function(path) {
    return await remove(path)
}
