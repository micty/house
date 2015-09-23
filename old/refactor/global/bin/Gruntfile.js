
module.exports = function(grunt) {

    grunt.initConfig({
        less: {
            debug: {
                options: {
                    compress: false,
                },
                expand: true,
                src: '../less/widgets/**/*.less',
                dest: '',
                ext: '.debug.css',
            },
            min: {
                options: {
                    compress: true,
                },
                expand: true,
                src: '../less/widgets/**/*.less',
                dest: '',
                ext: '.min.css',
            }
        },

        concat: {
            debug: {
                options: {
                    separator: '',
                    banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */ <%= grunt.util.linefeed %>',
                },
                src: ['../less/widgets/**/*.debug.css'],
                dest: '../less/dest/global.debug.css',     
            },
            min: {
                options: {
                    separator: '',
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */ <%= grunt.util.linefeed %>',
                },
                src: ['../less/widgets/**/*.min.css'],
                dest: '../less/dest/global.min.css',
            },
        },

        watch: {
            watch_less: {
                files: '../less/widgets/**/*.less',
                tasks: ['less'],
                options: {
                    spwan: false,
                    event: ['changed'],
                },
            },
            concat_less: {
                files: '../less/widgets/**/*.less',
                tasks: ['concat'],
                options: {
                    spwan: false,
                    event: ['changed'],
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', 'less');
}