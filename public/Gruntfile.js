module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      compile: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'css/<%= pkg.name %>.css.map'
        },
        src: 'less/main.less',
        dest: 'css/<%= pkg.name %>.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
      },
      core: {
        src: 'css/<%= pkg.name %>.css'
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        advanced: false
      },
      minify: {
        src: 'css/<%= pkg.name %>.css',
        dest: 'css/<%= pkg.name %>.min.css'
      }
    },

    concat: {
      bootstrap: {
        src: [
          // 'scripts/bootstrap/transition.js',
          // 'scripts/bootstrap/alert.js',
          // 'scripts/bootstrap/button.js',
          // 'scripts/bootstrap/carousel.js',
          // 'scripts/bootstrap/collapse.js',
          'scripts/bootstrap/dropdown.js'
          // 'scripts/bootstrap/modal.js',
          // 'scripts/bootstrap/tooltip.js',
          // 'scripts/bootstrap/popover.js',
          // 'scripts/bootstrap/scrollspy.js',
          // 'scripts/bootstrap/tab.js',
          // 'scripts/bootstrap/affix.js'
        ],
        dest: 'scripts/bootstrap.js'
      },
      vendor: {
        src: [
          'scripts/vendor/*.js'
        ],
        dest: 'scripts/plugins.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: 'some'
      },
      bootstrap: {
        src: 'scripts/bootstrap.js',
        dest: 'js/vendor/bootstrap.min.js'
      },
      main: {
        src: 'scripts/main.js',
        dest: 'js/main.min.js'
      },
      vendor: {
        src: 'scripts/plugins.js',
        dest: 'js/plugins.min.js'
      }
    },

    watch: {
      less: {
        files: 'less/**/*.less',
        tasks: ['default']
      },
      scripts: {
        files: 'scripts/**/*.js',
        tasks: ['default']
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('css', ['less:compile', 'autoprefixer:core', 'cssmin:minify']);
  grunt.registerTask('js', ['concat:bootstrap', 'uglify:bootstrap', 'uglify:main']);
  grunt.registerTask('default', ['less:compile', 'autoprefixer:core', 'cssmin:minify', 'concat:bootstrap', 'concat:vendor', 'uglify:bootstrap', 'uglify:main', 'uglify:vendor']);

};