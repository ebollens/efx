module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      js : {
        src : [
          'src/engine.js',
          'src/driver/accordion.js',
          'src/driver/tabs.js',
          'src/driver/toggle.js'
        ],
        dest : 'build/jQuery.efx.js'
      },
      css : {
        src : [
          'src/driver/accordion.css',
          'src/driver/tabs.css',
          'src/driver/toggle.css'
        ],
        dest : 'build/jQuery.efx.css'
      }
    },

    uglify : {
      js: {
        files: {
          'build/jQuery.efx.min.js' : [ 'build/jQuery.efx.js' ]
        }
      }
    },

    cssmin: {
      css:{
        files: {
          'build/jQuery.efx.min.css' : [ 'build/jQuery.efx.css' ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', [ 'concat:js', 'uglify:js', 'concat:css', 'cssmin' ]);

};