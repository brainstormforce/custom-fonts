<?php
/**
 * BCF FSE Fonts Compatibility.
 *
 * @since 2.0.0
 * @package BCF
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'BCF_Google_Fonts_Compatibility' ) ) {

	/**
	 * Class BCF_Google_Fonts_Compatibility.
	 *
	 * @since 2.0.0
	 */
	final class BCF_Google_Fonts_Compatibility {

		/**
		 * Member Variable
		 *
		 * @since 2.0.0
		 * @var instance
		 */
		private static $instance;

		/**
		 * Base path.
		 *
		 * @access protected
		 * @since 2.0.0
		 * @var string
		 */
		protected $base_path;

		/**
		 * Base URL.
		 *
		 * @access protected
		 * @since 2.0.0
		 * @var string
		 */
		protected $base_url;

		/**
		 * The remote CSS.
		 *
		 * @access protected
		 * @since 2.0.0
		 * @var string
		 */
		protected $remote_styles;

		/**
		 * The font-format.
		 *
		 * Use "woff" or "woff2".
		 * This will change the user-agent user to make the request.
		 *
		 * @access protected
		 * @since 2.0.0
		 * @var string
		 */
		protected $font_format = 'woff2';

		/**
		 *  Initiator
		 *
		 * @return object instance.
		 * @since 2.0.0
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor
		 *
		 * @return void
		 * @since 2.0.0
		 */
		public function __construct() {
			if ( empty( $_GET['page'] ) || BSF_CUSTOM_FONTS_ADMIN_PAGE !== $_GET['page'] ) { //phpcs:ignore WordPress.Security.NonceVerification.Recommended
				return;
			}

			$bcf_filesystem    = bcf_filesystem();
			$fonts_folder_path = $this->get_fonts_folder();

			if ( file_exists( $fonts_folder_path ) ) {
				$bcf_filesystem->delete( $fonts_folder_path, true, 'd' );
			}

			self::delete_all_theme_font_family();
			add_action( 'admin_init', array( $this, 'update_fse_theme_json' ) );
		}

		/**
		 * Get the base path.
		 *
		 * @access public
		 * @since 2.0.0
		 * @return string
		 */
		public function get_base_path() {
			if ( ! $this->base_path ) {
				$this->base_path = apply_filters( 'bcf_fonts_base_path', $this->get_filesystem()->wp_content_dir() );
			}
			return $this->base_path;
		}

		/**
		 * Get the base URL.
		 *
		 * @access public
		 * @since 2.0.0
		 * @return string
		 */
		public function get_base_url() {
			if ( ! $this->base_url ) {
				$this->base_url = apply_filters( 'bcf_fonts_base_url', content_url() );
			}
			return $this->base_url;
		}

		/**
		 * Save Google Fonts to locally.
		 *
		 * @return void
		 * @since 2.0.0
		 */
		public function update_fse_theme_json() {

			$font_srcs = array();
			$all_fonts = Bsf_Custom_Fonts_Render::get_instance()->get_existing_font_posts();

			if ( empty( $all_fonts ) || ! is_array( $all_fonts ) ) {
				return;
			}

			foreach ( $all_fonts as $font => $id ) {
				$new_font_faces = array();
				$font_family    = get_the_title( $id );
				$font_slug      = $this->get_font_slug( $font_family );
				$font_data      = get_post_meta( $id, 'fonts-data', true );

				if ( ! empty( $font_data['variations'] ) ) {
					foreach ( $font_data['variations'] as $variation ) {
						$font_weight = ! empty( $variation['font_weight'] ) ? $variation['font_weight'] : '';
						$font_style  = ! empty( $variation['font_style'] ) ? $variation['font_style'] : 'normal';

						$final_font_files = $this->get_fonts_file_url( $font_family, $font_weight, $font_style, $id, true );

						// Convert paths to URLs.
						foreach ( $final_font_files as $remote => $local ) {
							$font_url                    = str_replace(
								$this->get_base_path(),
								$this->get_base_url(),
								$local
							);
							$final_font_files[ $remote ] = $font_url;
							$font_srcs[]                 = $font_url;
						}

						$final_font_files_flat = array_reduce(
							$final_font_files,
							function ( $carry, $item ) {
								return array_merge( $carry, is_array( $item ) ? $item : array( $item ) );
							},
							array()
						);

						// Add each variant as one font face.
						$new_font_faces[] = array(
							'fontFamily'  => $font_family,
							'fontStretch' => '',
							'fontStyle'   => $font_style,
							'fontWeight'  => $font_weight,
							'src'         => $final_font_files_flat,
						);
					}

					$this->add_or_update_theme_font_faces( $font_family, $font_slug, $new_font_faces );
				}
			}

			update_option( 'bcf_font_urls', $font_srcs );
		}

		/**
		 * Save Google Fonts to locally.
		 *
		 * @param mixed $font Font data.
		 *
		 * @return void
		 * @since 2.0.0
		 */
		public function process_google_fonts_locally( $font ) {

			if ( empty( $font ) || ! is_array( $font ) ) {
				return;
			}

			$font_family = ! empty( $font['font_name'] ) ? $font['font_name'] : '';
			$font_slug   = $this->get_font_slug( $font_family );
			$font_data   = array();
			$variations  = array();
			$counter     = 1;

			foreach ( $font['variations'] as $variation ) {
				$font_weight = ! empty( $variation['font_weight'] ) ? $variation['font_weight'] : '';
				$font_style  = ! empty( $variation['font_style'] ) ? $variation['font_style'] : 'normal';

				$final_font_files = $this->get_fonts_file_url( $font_family, $font_weight, $font_style );

				// Convert paths to URLs.
				foreach ( $final_font_files as $remote => $local ) {
					$final_font_files[ $remote ] = str_replace(
						$this->get_base_path(),
						$this->get_base_url(),
						$local
					);
				}

				if ( ! empty( $final_font_files ) ) {
					$updated_font_weight = strpos( $font_weight, 'italic' ) !== false ? str_replace( 'italic', '', $font_weight ) : $font_weight;
					$updated_font_style  = strpos( $font_weight, 'italic' ) !== false ? 'italic' : $font_style;
					$variations[]        = array(
						'id'          => $counter, // for making bcf font data in specific way.
						'font_file'   => $counter + 1000, // for making bcf font data in specific way.
						'font_url'    => $final_font_files,
						'font_style'  => $updated_font_style,
						'font_weight' => $updated_font_weight,
					);
				}
				$counter++;
			}

			$font_data = array(
				'font_name'     => $font_family,
				'font_fallback' => '',
				'font_display'  => 'fallback',
				'variations'    => $variations,
			);

			$font_face_css = bcf_get_font_face_css( 1, $font_data, true, true );
			return $font_face_css;
		}

		/**
		 * Get Font Slug.
		 *
		 * @return string slug.
		 * @param string $name Font Family.
		 * @since 2.0.0
		 */
		public function get_font_slug( $name ) {
			$slug = sanitize_title( $name );
			$slug = preg_replace( '/\s+/', '', $slug ); // Remove spaces.
			return $slug;
		}

		/**
		 * Get the folder for fonts.
		 *
		 * @access public
		 * @return string
		 */
		public function get_fonts_folder() {
			$fonts_folder  = $this->get_filesystem()->wp_content_dir();
			$fonts_folder .= '/bcf-fonts';

			return $fonts_folder;
		}

		/**
		 * Get Font URl.
		 *
		 * @param string $font_family Font Family.
		 * @param string $font_weight Font Weight.
		 * @param string $font_style Font Style.
		 * @param mixed  $font_id Font id.
		 * @param bool   $for_theme_json Flag for Theme JSON file path.
		 * @return array final font files.
		 * @since 2.0.0
		 */
		public function get_fonts_file_url( $font_family, $font_weight, $font_style, $font_id = null, $for_theme_json = false ) {
			$font_family_key = sanitize_key( strtolower( str_replace( ' ', '-', $font_family ) ) );

			if ( ! is_null( $font_id ) && 'local' === get_post_meta( $font_id, 'font-type', true ) ) {
				$font_data  = get_post_meta( $font_id, 'fonts-data', true );
				$fonts_link = '';
				foreach ( $font_data['variations'] as $key => $var_arr ) {
					if ( ! empty( $var_arr['font_weight'] ) && $font_weight === $var_arr['font_weight'] && ! empty( $var_arr['font_url'][0] ) ) {
						$fonts_link = $var_arr['font_url'][0];
						break;
					}
				}
			} else {
				$fonts_attr      = str_replace( ' ', '+', $font_family );
				$fonts_file_name = $font_family_key;
				if ( ! empty( $font_weight ) ) {
					$fonts_attr      .= ':' . $font_weight;
					$fonts_file_name .= '-' . $font_weight;
					if ( ! empty( $font_style ) ) {
						$fonts_attr      .= ',' . $font_weight . $font_style;
						$fonts_file_name .= '-' . $font_style;
					}
				}
				$fonts_link = 'https://fonts.googleapis.com/css?family=' . esc_attr( $fonts_attr );
			}

			$final_font_files = array();

			if ( ! is_null( $font_id ) && 'local' === get_post_meta( $font_id, 'font-type', true ) ) {
				$final_font_files[] = $fonts_link;
			} else {
				// Get the remote URL contents.
				$this->remote_styles = $this->get_remote_url_contents( $fonts_link );
				$font_files          = $this->get_remote_files_from_css();

				$fonts_folder_path = $this->get_fonts_folder() . '/' . $font_family;

				// If the fonts folder don't exist, create it.
				if ( ! file_exists( $fonts_folder_path ) ) {

					wp_mkdir_p( $fonts_folder_path );

					if ( ! file_exists( $fonts_folder_path ) ) {
						$this->get_filesystem()->mkdir( $fonts_folder_path, FS_CHMOD_DIR );
					}
				}

				if ( ! isset( $font_files[ $font_family_key ] ) ) {
					return $final_font_files;
				}

				foreach ( $font_files[ $font_family_key ] as $key => $font_file ) {

					// require file.php if the download_url function doesn't exist.
					if ( ! function_exists( 'download_url' ) ) {
						require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
					}
					// Download file to temporary location.
					$tmp_path = download_url( $font_file );

					// Make sure there were no errors.
					if ( is_wp_error( $tmp_path ) ) {
						return array();
					}

					$fonts_file_name_final = $fonts_file_name . $key . '.' . $this->font_format;
					$font_path             = $fonts_folder_path . '/' . $fonts_file_name_final;

					// Move font asset to wp-content assets folder.
					$success            = $this->get_filesystem()->move( $tmp_path, $font_path, true );
					$final_font_files[] = $font_path;
				}
			}

			return $final_font_files;
		}

		/**
		 * Get font files from the CSS.
		 *
		 * @access public
		 * @param string $font_name Font Name.
		 * @param string $font_slug Font Slug.
		 * @param array  $font_faces Font Faces.
		 * @return void
		 * @since 2.0.0
		 */
		public function add_or_update_theme_font_faces( $font_name, $font_slug, $font_faces ) {
			if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
				// Get the current theme.json and fontFamilies defined (if any).
				$theme_json_raw      = json_decode( file_get_contents( get_stylesheet_directory() . '/theme.json' ), true );
				$theme_font_families = isset( $theme_json_raw['settings']['typography']['fontFamilies'] ) ? $theme_json_raw['settings']['typography']['fontFamilies'] : null;

				$existent_family = $theme_font_families ? array_values(
					array_filter(
						$theme_font_families,
						function ( $font_family ) use ( $font_slug ) {
							return $font_family['slug'] === $font_slug; }
					)
				) : null;

				// Add the new font faces.
				if ( empty( $existent_family ) ) { // If the new font family doesn't exist in the theme.json font families, add it to the existing font families.
					$theme_font_families[] = array(
						'fontFamily' => $font_name,
						'slug'       => $font_slug,
						'fontFace'   => $font_faces,
						'isBcf'      => true,
					);
				} else { // If the new font family already exists in the theme.json font families, add the new font faces to the existing font family.
					$theme_font_families            = array_values(
						array_filter(
							$theme_font_families,
							function ( $font_family ) use ( $font_slug ) {
								return $font_family['slug'] !== $font_slug; }
						)
					);
					$existent_family[0]['fontFace'] = $font_faces;
					$theme_font_families            = array_merge( $theme_font_families, $existent_family );
				}

				// Overwrite the previous fontFamilies with the new ones.
				$theme_json_raw['settings']['typography']['fontFamilies'] = $theme_font_families;

				// @codingStandardsIgnoreStart
				$theme_json        = wp_json_encode( $theme_json_raw, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
				$theme_json_string = preg_replace( '~(?:^|\G)\h{4}~m', "\t", $theme_json );

				// Write the new theme.json to the theme folder.
				file_put_contents( // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions
					get_stylesheet_directory() . '/theme.json',
					$theme_json_string
				);
				// @codingStandardsIgnoreEnd
			}
		}

		/**
		 * Get the filesystem.
		 *
		 * @access protected
		 * @since 2.0.0
		 * @return WP_Filesystem
		 */
		protected function get_filesystem() {
			global $wp_filesystem;

			// If the filesystem has not been instantiated yet, do it here.
			if ( ! $wp_filesystem ) {
				if ( ! function_exists( 'WP_Filesystem' ) ) {
					require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
				}
				WP_Filesystem();
			}
			return $wp_filesystem;
		}

		/**
		 * Get remote file contents.
		 *
		 * @access public
		 * @param string $url URL.
		 * @since 2.0.0
		 * @return string Returns the remote URL contents.
		 */
		public function get_remote_url_contents( $url ) {

			/**
			 * The user-agent we want to use.
			 *
			 * The default user-agent is the only one compatible with woff (not woff2)
			 * which also supports unicode ranges.
			 */
			$user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8';

			// Switch to a user-agent supporting woff2 if we don't need to support IE.
			if ( 'woff2' === $this->font_format ) {
				$user_agent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0';
			}

			// Get the response.
			$response = wp_remote_get( $url, array( 'user-agent' => $user_agent ) );

			// Early exit if there was an error.
			if ( is_wp_error( $response ) ) {
				return '';
			}

			// Get the CSS from our response.
			$contents = wp_remote_retrieve_body( $response );

			// Early exit if there was an error.
			if ( is_wp_error( $contents ) ) {
				return '';
			}

			return $contents;
		}

		/**
		 * Get font files from the CSS.
		 *
		 * @access public
		 * @since 2.0.0
		 * @return array Returns an array of font-families and the font-files used.
		 */
		public function get_remote_files_from_css() {

			// Return early if remote styles is not a string, or is empty.
			if ( ! is_string( $this->remote_styles ) || empty( $this->remote_styles ) ) {
				return array();
			}

			$font_faces = explode( '@font-face', $this->remote_styles );

			// Return early if font faces is not an array, or is empty.
			if ( ! is_array( $font_faces ) || empty( $font_faces ) ) {
				return array();
			}

			$result = array();

			// Loop all our font-face declarations.
			foreach ( $font_faces as $font_face ) {

				// Continue the loop if the current font face is not a string, or is empty.
				if ( ! is_string( $font_face ) || empty( $font_face ) ) {
					continue;
				}

				// Get the styles based on the font face.
				$style_array = explode( '}', $font_face );

				// Continue the loop if the current font face is not a string, or is empty.
				if ( ! is_string( $style_array[0] ) || empty( $style_array[0] ) ) {
					continue;
				}

				// Make sure we only process styles inside this declaration.
				$style = $style_array[0];

				// Sanity check.
				if ( false === strpos( $style, 'font-family' ) ) {
					continue;
				}

				// Get an array of our font-families.
				preg_match_all( '/font-family.*?\;/', $style, $matched_font_families );

				// Get an array of our font-files.
				preg_match_all( '/url\(.*?\)/i', $style, $matched_font_files );

				// Get the font-family name.
				$font_family = 'unknown';
				if ( isset( $matched_font_families[0] ) && isset( $matched_font_families[0][0] ) ) {
					$font_family = rtrim( ltrim( $matched_font_families[0][0], 'font-family:' ), ';' );
					$font_family = trim( str_replace( array( "'", ';' ), '', $font_family ) );
					$font_family = sanitize_key( strtolower( str_replace( ' ', '-', $font_family ) ) );
				}

				// Make sure the font-family is set in our array.
				if ( ! isset( $result[ $font_family ] ) ) {
					$result[ $font_family ] = array();
				}

				// Get files for this font-family and add them to the array.
				foreach ( $matched_font_files as $match ) {

					// Sanity check.
					if ( ! isset( $match[0] ) ) {
						continue;
					}

					// Add the file URL.
					$result[ $font_family ][] = rtrim( ltrim( $match[0], 'url(' ), ')' );
				}

				// Make sure we have unique items.
				// We're using array_flip here instead of array_unique for improved performance.
				$result[ $font_family ] = array_flip( array_flip( $result[ $font_family ] ) );
			}
			return $result;
		}

		/**
		 * Save setting - Sanitizes form inputs.
		 *
		 * @param array $input_settings setting data.
		 * @return array    The sanitized form inputs.
		 *
		 * @since 2.0.0
		 */
		public static function sanitize_form_inputs( $input_settings = array() ) {
			$new_settings = array();

			if ( ! empty( $input_settings ) ) {
				foreach ( $input_settings as $key => $value ) {

					$new_key = sanitize_text_field( $key );

					if ( is_array( $value ) ) {
						$new_settings[ $new_key ] = self::sanitize_form_inputs( $value );
					} else {
						$new_settings[ $new_key ] = sanitize_text_field( $value );
					}
				}
			}

			return $new_settings;
		}

		/**
		 * Delete all Spectra font files from the theme JSON.
		 *
		 * @return void
		 * @since 2.0.0
		 */
		public static function delete_all_theme_font_family() {
			if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
				// Construct updated theme.json.
				$theme_json_raw = json_decode( file_get_contents( get_stylesheet_directory() . '/theme.json' ), true );

				// Overwrite the previous fontFamilies with the new ones.
				$font_families = ( ! isset( $theme_json_raw['settings']['typography']['fontFamilies'] ) ) ? array() : $theme_json_raw['settings']['typography']['fontFamilies'];

				if ( ! empty( $font_families ) && is_array( $font_families ) ) {
					$font_families = array_values(
						array_filter(
							$font_families,
							function( $value ) {
								if ( ! empty( $value['isBcf'] ) ) {
									return false;
								}
								return true;
							}
						)
					);
				}

				// @codingStandardsIgnoreStart
				$theme_json_raw['settings']['typography']['fontFamilies'] = $font_families;

				$theme_json        = wp_json_encode( $theme_json_raw, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
				$theme_json_string = preg_replace( '~(?:^|\G)\h{4}~m', "\t", $theme_json );

				// Write the new theme.json to the theme folder.
				file_put_contents( // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions
					get_stylesheet_directory() . '/theme.json',
					$theme_json_string
				);
				// @codingStandardsIgnoreEnd
			}
		}

		/**
		 * Delete font files from the CSS.
		 *
		 * @return void
		 * @param array $font Font Data.
		 * @since 2.0.0
		 */
		public static function delete_theme_font_family( $font ) {
			if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
				// @codingStandardsIgnoreStart
				// Construct updated theme.json.
				$theme_json_raw = json_decode( file_get_contents( get_stylesheet_directory() . '/theme.json' ), true );

				// Overwrite the previous fontFamilies with the new ones.
				$font_families = ( ! isset( $theme_json_raw['settings']['typography']['fontFamilies'] ) ) ? array() : $theme_json_raw['settings']['typography']['fontFamilies'];
				if ( ! empty( $font_families ) && is_array( $font_families ) ) {
					foreach ( $font_families as $key => $value ) {
						if ( $font['fontFamily'] === $value['fontFamily'] && ! empty( $value['fontFace'] ) && is_array( $value['fontFace'] ) ) {
							unset( $font_families[ $key ] );
							break;
						}
					}
				}
				$theme_json_raw['settings']['typography']['fontFamilies'] = $font_families;

				$theme_json        = wp_json_encode( $theme_json_raw, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); // PHPCompatibility.Constants.NewConstants.json_unescaped_unicodeFound
				$theme_json_string = preg_replace( '~(?:^|\G)\h{4}~m', "\t", $theme_json );

				// Write the new theme.json to the theme folder.
				file_put_contents( // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions, WordPress.WP.AlternativeFunctions.file_system_read_file_put_contents
					get_stylesheet_directory() . '/theme.json',
					$theme_json_string
				);
				// @codingStandardsIgnoreEnd

				$bcf_global_fse_fonts = array();

				if ( ! is_array( $bcf_global_fse_fonts ) ) {
					$response_data = array(
						'messsage' => __( 'There was some error in deleting the font.', 'custom-fonts' ),
					);
					wp_send_json_error( $response_data );
				}

				$bcf_global_fse_fonts = array_values(
					array_filter(
						$bcf_global_fse_fonts,
						function( $value ) use ( $font ) {
							if ( $font['fontFamily'] === $value['value'] ) {
								return false;
							}
							return true;
						}
					)
				);

				foreach ( $bcf_global_fse_fonts as $key => $value ) {
					if ( $font['fontFamily'] === $value['value'] ) {
						array_splice( $bcf_global_fse_fonts, $key, $key );
					}
				}
				$bcf_global_fse_fonts = self::sanitize_form_inputs( $bcf_global_fse_fonts );

				$response_data = array(
					'messsage' => __( 'Successfully deleted font.', 'custom-fonts' ),
				);

				wp_send_json_success( $response_data );
			}
		}
	}
}

/**
 * Global instance for this class.
 *
 * @since 2.0.0
 */
function bcf_google_fonts_compatibility() {
	return BCF_Google_Fonts_Compatibility::get_instance();
}

bcf_google_fonts_compatibility();
