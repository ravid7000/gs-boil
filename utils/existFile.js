const existsSync = require('fs-extra').existsSync

module.exports = async function(path) {
    return await existsSync(path)
}
