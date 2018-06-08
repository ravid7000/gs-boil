#!/usr/bin/env node

process.title = 'boil'
process.env.NODE_ENV = 'production'

const path = require('path')
const chalk = require('chalk')
const Steps = require('cli-step')
const {
    blueprints,
    name
} = require('../config')
const {
    underscore,
    exec,
    removeFile,
    existFile
} = require('../utils')

process.on('unhandledRejection', (err) => {
    console.error(err)
    process.exit(1)
})

const steps = new Steps(1)
const step1 = steps.advance(' Generating Application', 'truck')

function debug(log) {
    if (process.env.NODE_ENV === 'development') {
        console.log()
        console.log(log)
    }
}

class App {
    constructor(options) {
        this.options = options
        step1.start()
        this.init()
    }

    static get appPath() {
        return path.join(process.cwd(), this.options.appName)
    }

    getBluePrintUrl(options) {
        let cloneCommand = 'git clone --depth=1'

        if (blueprints.includes(options.blueprint)) {
            return cloneCommand + ' https://github.com/ravid7000/' + options.blueprint + '-boil.git ' + options.appName
        }

        if (underscore.isUrl(options.blueprint)) {
            if (options.branch) {
                cloneCommand += ' --branch ' + options.branch
            }
            return cloneCommand + ' ' + options.blueprint + ' ' + options.appName
        }
    }

    async init() {
        const url = this.getBluePrintUrl(this.options)
        try {
            const exists = await existFile(path.join(process.cwd(), this.options.appName))
            if (exists) {
                console.log()
                console.log()
                console.log(' ', chalk.red('Error: Path does not empty. Try different app name.'))
                console.log()
                process.exit(1)
            }
            const res = await exec(url)
            await removeFile(path.join(this.options.appName, '.git'))
            appGenerated(this.options.appName)
        } catch (e) {
            debug(e.message)
            console.log()
            console.log()
            console.log(' ', chalk.red('Error: Failed to find requested package.'))
            console.log()
            process.exit(1)
        } finally {
            step1.stop()
        }
    }
}

const defaultOptions = ['new', 'n', 'clone', 'c']

function showHelpOptions() {
    let str = chalk.bgBlue(chalk.white(' USAGE: \n'))
    str += '  boil [new|clone] [appName] [blueprint|repo-url] [branch]\n\n'
    str += chalk.bgBlue(chalk.white(' ARGUMENTS: \n'))
    str += '  ' + chalk.blue('new') + '         ' + 'Create a new gs-boil application\n'
    str += '  ' + chalk.blue('clone') + '       ' + 'Clone a github repository\n'
    str += '  ' + chalk.blue('blueprint') + '   ' + 'react|html-sass|sass|vue\n'
    str += '  ' + chalk.blue('branch') + '      ' + 'Github respository branch name\n'
    str += '  ' + chalk.blue('--help') + '      ' + 'Show help options'

    console.log('  ', require('gradient-string').mind(name))
    console.log()
    console.log(str)
    console.log()
}

function appGenerated(appName) {
    console.log()
    console.log()
    console.log('  ', chalk.yellow('Hoorey!! Successfully generated your app.'))
    console.log()
    console.log('  ', chalk.blue(`cd ${appName}`))
    console.log()
    console.log('  ', chalk.green('Happy coding'))
    console.log()
}

function createOptions() {
    const parsedOptions = {}
    const args = process.argv

    if (args.length <= 2) {
        console.log('Please spacify some options')
        showHelpOptions()
        process.exit(1)
    }

    if (args[2] === '--help') {
        showHelpOptions()
        process.exit()
    }

    if (defaultOptions.indexOf(args[2]) > -1) {
        const appName = args[3] || 'gs-boil'

        parsedOptions.appName = appName

        if (args[2] === 'new' || args[2] === 'n') {
            parsedOptions.action = 'new'
        }

        if (args[2] === 'clone' || args[2] === 'c') {
            parsedOptions.action = 'clone'
        }
    }

    if (blueprints.indexOf(args[4]) > -1 || underscore.isUrl(args[4])) {
        parsedOptions.blueprint = args[4]
    } else {
        console.log()
        console.log(
            ' ',
            chalk.red('Error: Please specify a valid boilerplate name. See the link for boilerplate options:'),
            chalk.blue('https://github.com/ravid7000/gs-boil/blob/master/README.md')
        )
        console.log()
        process.exit()
    }

    if (args[5]) {
        parsedOptions.branch = args[5]
    }

    return parsedOptions
}

const app = new App(createOptions())
