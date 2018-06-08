const removeSync = require('fs-extra').removeSync

module.exports = async function remove(path) {
    return await removeSync(path)
}
