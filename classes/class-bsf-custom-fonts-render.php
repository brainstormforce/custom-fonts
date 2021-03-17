<?php
/**
 * Bsf Custom Fonts Admin Ui
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

if ( ! class_exists( 'Bsf_Custom_Fonts_Render' ) ) :

	/**
	 * Bsf_Custom_Fonts_Render
	 */
	class Bsf_Custom_Fonts_Render {

		/**
		 * Instance of Bsf_Custom_Fonts_Render
		 *
		 * @since  1.0.0
		 * @var (Object) Bsf_Custom_Fonts_Render
		 */
		private static $instance = null;

		/**
		 * Font base.
		 *
		 * This is used in case of Elementor's Font param
		 *
		 * @since  1.0.5
		 * @var string
		 */
		private static $font_base = 'bsf-custom-fonts';

		/**
		 * Font Weight.
		 *
		 * Store the Font Weight from DB to be use for frontend rendering.
		 *
		 * @since  x.x.x
		 * @var string
		 */
		private static $font_weight = '';

		/**
		 * Font Display.
		 *
		 * Store the Font Display from DB to be use for frontend rendering.
		 *
		 * @since  x.x.x
		 * @var string
		 */
		private static $font_display = '';

		/**
		 * Font Family.
		 *
		 * Store the Font Family from DB to be use for frontend rendering.
		 *
		 * @since  x.x.x
		 * @var string
		 */
		private static $font_family = '';

		/**
		 * Font Fallback.
		 *
		 * Store the Font Fallback from DB to be use for frontend rendering.
		 *
		 * @since  x.x.x
		 * @var string
		 */
		private static $font_fallback = '';

		/**
		 * Member Varible
		 *
		 * @var string $font_css
		 */
		protected $font_css = '';

		/**
		 * Instance of Bsf_Custom_Fonts_Admin.
		 *
		 * @since  1.0.0
		 *
		 * @return object Class object.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor.
		 *
		 * @since  1.0.0
		 */
		public function __construct() {

			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );

			add_action( 'admin_notices', array( $this, 'theme_update_notice' ) );

			// Enqueue the custom fonts.
			add_action( 'astra_render_fonts', array( $this, 'render_fonts' ) );

			// Delete custom fonts action.
			add_action( 'delete_term', array( $this, 'delete_custom_fonts_fallback_astra' ), 10, 5 );

			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

			// add Custom Font list into Astra customizer.
			add_filter( 'astra_system_fonts', array( $this, 'add_custom_fonts_astra_customizer' ) );

			// Beaver builder theme customizer, beaver buidler page builder.
			add_filter( 'fl_theme_system_fonts', array( $this, 'bb_custom_fonts' ) );
			add_filter( 'fl_builder_font_families_system', array( $this, 'bb_custom_fonts' ) );

			// Add font files style.
			add_action( 'wp_head', array( $this, 'add_style' ) );
			if ( is_admin() ) {
				add_action( 'enqueue_block_assets', array( $this, 'add_style' ) );
			}

			add_filter( 'elementor/fonts/groups', array( $this, 'elementor_group' ) );
			add_filter( 'elementor/fonts/additional_fonts', array( $this, 'add_elementor_fonts' ) );
			// Astra filter before creating google fonts URL.
			add_filter( 'astra_google_fonts_selected', array( $this, 'remove_custom_font_google_url' ) );
		}

		/**
		 * Add Custom Font group to elementor font list.
		 *
		 * Group name "Custom" is added as the first element in the array.
		 *
		 * @since  1.0.5
		 * @param  Array $font_groups default font groups in elementor.
		 * @return Array              Modified font groups with newly added font group.
		 */
		public function elementor_group( $font_groups ) {
			$new_group[ self::$font_base ] = __( 'Custom', 'custom-fonts' );
			$font_groups                   = $new_group + $font_groups;

			return $font_groups;
		}

		/**
		 * Remove Custom Font from Google Font URL.
		 *
		 * @param Array $fonts Selected Google Fonts in the Astra Customizer Settings.
		 * @return Array Google fonts array which do not contain same fonts as the custom fonts.
		 *
		 * @since  x.x.x
		 */
		public function remove_custom_font_google_url( $fonts ) {
			$custom_fonts = Bsf_Custom_Fonts_Taxonomy::get_fonts();
			if ( ! empty( $custom_fonts ) ) {
				foreach ( $custom_fonts as $key => $value ) {
					if ( $value['font_fallback'] ) {
						$font_key = "'" . $key . "'" . ', ' . $value['font_fallback'];
					} else {
						$font_key = "'" . $key . "'";
					}
					if ( array_key_exists( $font_key, $fonts ) ) {
						unset( $fonts[ $font_key ] );
					}
				}
			}
			return $fonts;
		}

		/**
		 * Add Custom Fonts to the Elementor Page builder's font param.
		 *
		 * @since  1.0.5
		 * @param Array $fonts Custom Font's array.
		 */
		public function add_elementor_fonts( $fonts ) {

			$all_fonts = Bsf_Custom_Fonts_Taxonomy::get_fonts();

			if ( ! empty( $all_fonts ) ) {
				foreach ( $all_fonts as $font_family_name => $fonts_url ) {
					$fonts[ $font_family_name ] = self::$font_base;
				}
			}

			return $fonts;
		}


		/**
		 * Add Custom Font list to BB theme and BB Page Builder
		 *
		 * @since  1.0.4
		 * @param array $bb_fonts font families added by bb.
		 */
		public function bb_custom_fonts( $bb_fonts ) {

			$fonts        = Bsf_Custom_Fonts_Taxonomy::get_fonts();
			$custom_fonts = array();
			if ( ! empty( $fonts ) ) {
				foreach ( $fonts as $font_family_name => $fonts_url ) {
					$custom_fonts[ $font_family_name ] = array(
						'fallback' => 'Verdana, Arial, sans-serif',
						'weights'  => array( '100', '200', '300', '400', '500', '600', '700', '800', '900' ),
					);
				}
			}

			return array_merge( $bb_fonts, $custom_fonts );
		}

		/**
		 * Enqueue Scripts
		 *
		 * @since 1.0.4
		 */
		public function add_style() {
			$fonts = Bsf_Custom_Fonts_Taxonomy::get_fonts();
			if ( ! empty( $fonts ) ) {
				foreach ( $fonts  as $load_font_name => $load_font ) {
					$this->render_font_css( $load_font_name );
				}
				?>
				<style type="text/css">
					<?php echo wp_strip_all_tags( $this->font_css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</style>
				<?php
			}
		}

		/**
		 * Add Custom Font list into Astra customizer.
		 *
		 * @since  x.x.x
		 * @param string $fonts_arr Array of System Fonts.
		 * @return array $fonts_arr modified array with Custom Fonts.
		 */
		public function add_custom_fonts_astra_customizer( $fonts_arr ) {

			$fonts = Bsf_Custom_Fonts_Taxonomy::get_fonts();

			foreach ( $fonts as $font => $values ) {
				$custom_fonts_weights = array();
				foreach ( $values as $key => $value ) {
					if ( strpos( $key, 'weight' ) !== false ) {
						array_push( $custom_fonts_weights, $value );
					}
				}
				$fonts_arr[ $font ] = array(
					'fallback' => $values['font_fallback'] ? $values['font_fallback'] : 'Helvetica, Arial, sans-serif',
					'weights'  => $custom_fonts_weights,
				);
			}

			return $fonts_arr;
		}

		/**
		 * Get fonts
		 *
		 * @since x.x.x
		 * @param array $font font.
		 * @param array $font_fallback fallback fonts.
		 */
		public static function get_font_values( $font, $font_fallback ) {

			$font .= ( isset( $font_fallback ) ) ? ', ' . trim( $font_fallback ) : '';
			return $font;
		}

		/**
		 * Enqueue Admin Scripts
		 *
		 * @since 1.0.0
		 */
		public function enqueue_admin_scripts() {
			wp_enqueue_style( 'bsf-custom-fonts-css', BSF_CUSTOM_FONTS_URI . 'assets/css/bsf-custom-fonts.css', array(), BSF_CUSTOM_FONTS_VER );
			wp_enqueue_media();
			wp_enqueue_script( 'bsf-custom-fonts-js', BSF_CUSTOM_FONTS_URI . 'assets/js/bsf-custom-fonts.js', array( 'jquery' ), BSF_CUSTOM_FONTS_VER, true );
		}

		/**
		 * Enqueue Render Fonts
		 *
		 * @since 1.0.0
		 * @param array $load_fonts astra fonts.
		 */
		public function render_fonts( $load_fonts ) {

			$fonts = Bsf_Custom_Fonts_Taxonomy::get_fonts();

			foreach ( $load_fonts  as $load_font_name => $load_font ) {
				if ( array_key_exists( $load_font_name, $fonts ) ) {
					unset( $load_fonts[ $load_font_name ] );
				}
			}
			return $load_fonts;
		}

		/**
		 * Create css for font-face
		 *
		 * @since 1.0.0
		 * @param array $font selected font from custom font list.
		 */
		private function render_font_css( $font ) {
			$fonts    = Bsf_Custom_Fonts_Taxonomy::get_links_by_name( $font );
			$arr_font = array();

			foreach ( $fonts as $font_key => $font_value ) {
				self::$font_family = $font_key;
				foreach ( $font_value as $key => $value ) {
					if ( strpos( $key, 'display' ) !== false ) {
						self::$font_display = $value;
					}
					if ( strpos( $key, 'fallback' ) !== false ) {
						self::$font_fallback = $value;
					}
					if ( strpos( $key, 'weight' ) !== false ) {
						self::$font_weight  = $value;
						$arr_font[ $value ] = array();
					}
					if ( strpos( $key, 'font_woff_2' ) !== false && $value ) {
						$arr_font[ self::$font_weight ][0] = 'url(' . esc_url( $value ) . ") format('woff2')";
					}
					if ( strpos( $key, 'font_woff-' ) !== false && $value ) {
						$arr_font[ self::$font_weight ][1] = 'url(' . esc_url( $value ) . ") format('woff')";
					}
					if ( strpos( $key, 'font_ttf-' ) !== false && $value ) {
						$arr_font[ self::$font_weight ][2] = 'url(' . esc_url( $value ) . ") format('TrueType')";
					}
					if ( strpos( $key, 'font_eot-' ) !== false && $value ) {
						$arr_font[ self::$font_weight ][3] = 'url(' . esc_url( $value ) . ") format('eot')";
					}
					if ( strpos( $key, 'font_svg-' ) !== false && $value ) {
						$arr_font[ self::$font_weight ][4] = 'url(' . esc_url( $value ) . ") format('svg')";
					}
					if ( strpos( $key, 'font_otf-' ) !== false && $value ) {
						$arr_font[ self::$font_weight ][5] = 'url(' . esc_url( $value ) . ") format('OpenType')";
					}
				}
			}
			$font_face_css = '';
			foreach ( $arr_font as $key => $value ) {
				$font_face_css .= '@font-face {';
				$font_face_css .= 'font-family: "' . self::$font_family . '";';
				$font_face_css .= 'font-display: ' . self::$font_display . ';';
				$font_face_css .= 'font-fallback: ' . self::$font_fallback . ';';
				$font_face_css .= 'font-weight: ' . $key . ';';
				$font_src_array = array();
				foreach ( $value as $font_file ) {
					array_push( $font_src_array, $font_file );
				}

				$font_face_css .= 'src: ' . implode( ', ', $font_src_array ) . ';';

				$font_face_css .= '} ';
			}
			$this->font_css .= $font_face_css;
		}

		/**
		 * Set default 'inherit' if custom font is selected in customizer if this is deleted.
		 *
		 * @since 1.0.0
		 * @param int    $term Term ID.
		 * @param int    $tt_id Term taxonomy ID.
		 * @param string $taxonomy Taxonomy slug.
		 * @param mixed  $deleted_term deleted term.
		 * @param object $object_ids objects ids.
		 */
		public function delete_custom_fonts_fallback_astra( $term, $tt_id, $taxonomy, $deleted_term, $object_ids ) {

			if ( defined( 'ASTRA_THEME_SETTINGS' ) ) {
				// get astra options.
				$options = get_option( ASTRA_THEME_SETTINGS );
				foreach ( $options as $key => $value ) {
					if ( $value == $deleted_term->name ) {
						// set default inherit if custom font is deleted.
						$options[ $key ] = 'inherit';
					}
				}
				// update astra options.
				update_option( ASTRA_THEME_SETTINGS, $options );
			}
		}

		/**
		 * Theme update notice.
		 *
		 * @since 1.0.0
		 */
		public function theme_update_notice() {
			if ( defined( 'ASTRA_THEME_VERSION' ) ) {
				if ( version_compare( ASTRA_THEME_VERSION, '1.0.16', '<' ) ) {
					?>
				<div class="notice notice-error is-dismissible">
					<p>
					<?php
					printf(
						/* translators: 1: Astra theme from wordpress.org*/
						esc_html__( 'Custom Fonts Plugin requires minimum 1.0.16 version of the Astra Theme.', 'custom-fonts' ),
						esc_url( 'https://downloads.wordpress.org/theme/astra.zip' )
					);
					?>
					</p>
				</div>
					<?php
				}
			}
		}

		/**
		 * Loads textdomain for the plugin.
		 *
		 * @since 1.0.0
		 */
		public function load_textdomain() {
			load_plugin_textdomain( 'custom-fonts' );
		}
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts_Render::get_instance();

endif;





