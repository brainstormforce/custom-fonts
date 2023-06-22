module.exports = function( grunt ) {

	'use strict';
	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';
	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		rtlcss: {
            options: {
                config: {
                    preserveComments: true,
                    greedy: true
                },
                // generate source maps
                map: false
            },
            dist: {
                files: [
					{
                        expand: true,
                        cwd: 'admin/react/assets/build',
                        src: [
                            '*.css',
                            '!*-rtl.css',
                        ],
                        dest: 'admin/react/assets/build',
                        ext: '-rtl.css'
                    },
                ]
            }
        },

		addtextdomain: {
			options: {
				textdomain: 'custom-fonts',
			},
			update_all_domains: {
				options: {
					updateDomains: true
				},
				src: [ '*.php', '**/*.php', '!node_modules/**', '!php-tests/**', '!bin/**' ]
			}
		},

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'README.md': 'readme.txt'
				}
			},
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					mainFile: 'custom-fonts.php',
					potFilename: 'custom-fonts.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},

		json2php: {
			options: {
				// Task-specific options go here.
				compress: true,
				cover: function (phpArrayString, destFilePath) {
					return '<?php\n/**\n * Google fonts array file.\n *\n * @package     custom-fonts\n * @author      Brainstorm Force\n * @copyright   Copyright (c) 2023, Brainstorm Force\n * @link        https://wpastra.com/\n * @since       2.0.0\n */\n\n/**\n * Returns google fonts array\n *\n * @since 2.0.0\n */\nreturn ' + phpArrayString + ';\n';
				}
			},
			your_target: {
				files: {
					'assets/fonts/google-fonts.php': 'assets/fonts/google-fonts.json'
				}
			},
		},
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
    grunt.loadNpmTasks('grunt-rtlcss');
    grunt.loadNpmTasks('grunt-json2php');

	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );
	grunt.registerTask( 'readme', ['wp_readme_to_markdown'] );
    grunt.registerTask('rtl', ['rtlcss']);

	// Update google Fonts.
	grunt.registerTask('download-google-fonts', function () {
        var done = this.async();
        var request = require('request');
        var fs = require('fs');

        request('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDu1nDK2o4FpxhrIlNXyPNckVW5YP9HRu8', function (error, response, body) {

            if (response && response.statusCode == 200) {

                var fonts = JSON.parse(body).items.map(function (font) {
                    return {
                        [font.family]: {
                            'variants': font.variants,
                            'files': font.files,
                            'category': font.category
                        }
                    };
                })

                fs.writeFile('assets/fonts/google-fonts.json', JSON.stringify(fonts, undefined, 4), function (err) {
                    if (!err) {
                        console.log("Google Fonts Updated!");
                        done();
                    }
                });
            }
        });
    });
    grunt.registerTask('google-fonts', function () {
        grunt.task.run('download-google-fonts');
        grunt.task.run('json2php');
    });

	grunt.util.linefeed = '\n';

};
