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
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
    grunt.loadNpmTasks('grunt-rtlcss');
	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );
	grunt.registerTask( 'readme', ['wp_readme_to_markdown'] );
    grunt.registerTask('rtl', ['rtlcss']);

	grunt.util.linefeed = '\n';

};
