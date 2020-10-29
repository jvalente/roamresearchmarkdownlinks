module.exports = function(grunt) {
    grunt.initConfig({
        eslint: {
            target: ['*.js', 'app/*.js']
        }
    })

    grunt.loadNpmTasks('grunt-eslint')

    grunt.registerTask('version', (key, value) => {
        const filenames = ['package.json', 'app/manifest.json']

        for (const filename of filenames) {
            const file = grunt.file.readJSON(filename)

            if (!grunt.file.exists(filename)) {
                grunt.log.error('file ' + filename + ' not found')
                return false
            }

            let version = file['version'].split('.')
            version[1] = Number(version[1]) + 1
            version = version.join('.')

            console.log(version)

            file['version'] = version
            grunt.file.write(filename, JSON.stringify(file, null, 4))
        }
    })

    grunt.registerTask('build', (key, value) => {
        console.log('building')
    })

    grunt.registerTask('release', ['eslint', 'version', 'build'])
}