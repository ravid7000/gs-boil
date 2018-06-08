const exec = require('es6-promisify').promisify(require('child_process').exec)

module.exports = async function (cmd) {
    const { stdout } = await exec(cmd)
    return stdout
}
