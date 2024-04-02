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
		 * @since  2.0.0
		 * @var string
		 */
		private static $font_weight = '';

		/**
		 * Font Display.
		 *
		 * Store the Font Display from DB to be use for frontend rendering.
		 *
		 * @since  2.0.0
		 * @var string
		 */
		private static $font_display = '';

		/**
		 * Font Family.
		 *
		 * Store the Font Family from DB to be use for frontend rendering.
		 *
		 * @since  2.0.0
		 * @var string
		 */
		private static $font_family = '';

		/**
		 * Font Fallback.
		 *
		 * Store the Font Fallback from DB to be use for frontend rendering.
		 *
		 * @since  2.0.0
		 * @var string
		 */
		private static $font_fallback = '';

		/**
		 * Font posts.
		 *
		 * @since  2.0.0
		 * @var array
		 */
		private static $existing_fonts = null;

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

			// Delete custom fonts action.
			add_action( 'delete_term', array( $this, 'delete_custom_fonts_fallback_astra' ), 10, 5 );

			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );

			// add Custom Font list into Astra customizer.
			add_filter( 'astra_system_fonts', array( $this, 'add_custom_fonts_astra_customizer' ) );

			// add Custom Font list into Spectra editor.
			add_filter( 'spectra_system_fonts', array( $this, 'add_custom_fonts_spectra' ) );

			// Beaver builder theme customizer, beaver buidler page builder.
			add_filter( 'fl_theme_system_fonts', array( $this, 'bb_custom_fonts' ) );
			add_filter( 'fl_builder_font_families_system', array( $this, 'bb_custom_fonts' ) );

			// Add font files style.
			add_action( 'wp_enqueue_scripts', array( $this, 'preload_styles' ), 1 );
			add_action( 'init', array( $this, 'add_block_assets_style' ) );

			add_filter( 'elementor/fonts/groups', array( $this, 'elementor_group' ) );
			add_filter( 'elementor/fonts/additional_fonts', array( $this, 'add_elementor_fonts' ) );
			// Astra filter before creating google fonts URL.
			add_filter( 'astra_google_fonts_selected', array( $this, 'remove_custom_font_google_url' ) );
		}

		/**
		 * Get existing site setup fonts.
		 *
		 * @return mixed
		 * @since 2.0.0
		 */
		public function get_existing_font_posts() {
			if ( ! isset( self::$existing_fonts ) ) {
				$args                 = array(
					'post_type'      => BSF_CUSTOM_FONTS_POST_TYPE,
					'post_status'    => 'publish',
					'fields'         => 'ids',
					'no_found_rows'  => true,
					'posts_per_page' => '-1',
				);
				$query                = new WP_Query( $args );
				self::$existing_fonts = $query->posts;
			}

			return self::$existing_fonts;
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
		 * @since  2.0.0
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

			$all_fonts = $this->get_existing_font_posts();

			if ( ! empty( $all_fonts ) ) {
				foreach ( $all_fonts as $key => $post_id ) {
					$font_data = get_post_meta( $post_id, 'fonts-data', true );
					$font_type = get_post_meta( $post_id, 'font-type', true );
					if ( 'google' !== $font_type ) {
						$fonts[ $font_data['font_name'] ] = self::$font_base;
					}
				}
			}

			return $fonts;
		}

		/**
		 * Incorporate a feature allowing users to integrate custom fonts into both the BB theme and BB Page Builder.
		 *
		 * @since  1.0.4
		 * @param array $bb_fonts font families added by bb.
		 */
		public function bb_custom_fonts( $bb_fonts ) {

			$fonts        = $this->get_existing_font_posts();
			$custom_fonts = array();
			if ( ! empty( $fonts ) ) {
				foreach ( $fonts as $key => $post_id ) {
					$font_family_name                  = get_the_title( $post_id );
					$custom_fonts[ $font_family_name ] = array(
						'fallback' => 'Verdana, Arial, sans-serif',
						'weights'  => array( '100', '200', '300', '400', '500', '600', '700', '800', '900' ),
					);
				}
			}

			return array_merge( $bb_fonts, $custom_fonts );
		}

		/**
		 * Enqueue Block Assets Scripts
		 *
		 * @since 1.3.3
		 */
		public function add_block_assets_style() {
			if ( is_admin() && ! is_customize_preview() ) {
				add_action( 'enqueue_block_assets', array( $this, 'add_style' ) );
			}
			add_action( 'enqueue_block_editor_assets', array( $this, 'enque_data' ) );
		}

		/**
		 * Enqueue iFrame Preview Script.
		 *
		 * @since 1.3.7
		 */
		public function enque_data() {
			wp_enqueue_script( 'bsf-custom-block-js', BSF_CUSTOM_FONTS_URI . 'assets/js/custom-fonts-preview.js', array(), BSF_CUSTOM_FONTS_VER, true );
		}

		/**
		 * Enqueue Scripts
		 *
		 * @since 1.0.4
		 */
		public function add_style() {
			$font_styles = '';
			$query_posts = $this->get_existing_font_posts();

			if ( $query_posts ) {
				foreach ( $query_posts as $key => $post_id ) {
					$font_styles .= get_post_meta( $post_id, 'fonts-face', true );
				}
				wp_reset_postdata();
			}

			if ( ! empty( $font_styles ) ) {
				wp_register_style( 'cf-frontend-style', false, array(), BSF_CUSTOM_FONTS_VER );
				wp_enqueue_style( 'cf-frontend-style' );
				wp_add_inline_style( 'cf-frontend-style', wp_strip_all_tags( $font_styles ) );
			}
		}

		/**
		 * Enqueue Styles for frontend for preloading.
		 *
		 * @since x.x.x
		 */
		public function preload_styles() {
			$font_urls = get_option( 'bcf_font_urls', array() );

			if ( true === (bool) get_option( 'bcf_preloading_fonts', false ) && ! empty( $font_urls ) ) {
				$font_format = apply_filters( 'bcf_preloading_fonts_format', 'woff2' );
				foreach ( $font_urls as $key => $local_url ) {
					if ( $local_url ) {
						echo '<link rel="preload" href="' . esc_url( $local_url ) . '" as="font" type="font/' . esc_attr( $font_format ) . '" crossorigin>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Preparing HTML link tag.
					}
				}
			}

			$this->add_style();
		}

		/**
		 * Add Custom Font list into Astra customizer.
		 *
		 * @since  2.0.0
		 * @param string $fonts_arr Array of System Fonts.
		 * @return array $fonts_arr modified array with Custom Fonts.
		 */
		public function add_custom_fonts_astra_customizer( $fonts_arr ) {

			$query_posts = $this->get_existing_font_posts();

			foreach ( $query_posts as $key => $post_id ) {
				$font_data = get_post_meta( $post_id, 'fonts-data', true );
				$font_type = get_post_meta( $post_id, 'font-type', true );
				if ( 'google' !== $font_type ) {
					$custom_fonts_weights = array();
					if ( ! empty( $font_data['variations'] ) ) {
						foreach ( $font_data['variations'] as $var_key => $var_data ) {
							if ( ! empty( $var_data['font_weight'] ) ) {
								array_push( $custom_fonts_weights, $var_data['font_weight'] );
							}
						}
					}
					$fonts_arr[ $font_data['font_name'] ] = array(
						'fallback' => $font_data['font_fallback'] ? $font_data['font_fallback'] : 'Helvetica, Arial, sans-serif',
						'weights'  => $custom_fonts_weights,
					);
				}
			}

			return $fonts_arr;
		}

		/**
		 * Add Custom Font list into Spectra editor.
		 *
		 * @since  1.3.6
		 * @param string $fonts_arr Array of System Fonts.
		 * @return array $fonts_arr modified array with Custom Fonts.
		 */
		public function add_custom_fonts_spectra( $fonts_arr ) {

			$query_posts = $this->get_existing_font_posts();

			foreach ( $query_posts as $key => $post_id ) {
				$font_data = get_post_meta( $post_id, 'fonts-data', true );
				$font_type = get_post_meta( $post_id, 'font-type', true );
				if ( 'google' !== $font_type ) {
					$custom_fonts_weights = array( 'Default' );
					if ( ! empty( $font_data['variations'] ) ) {
						foreach ( $font_data['variations'] as $var_key => $var_data ) {
							array_push( $custom_fonts_weights, $var_data['font_weight'] );
						}
					}
					$fonts_arr[ $font_data['font_name'] ] = array(
						'weight' => $custom_fonts_weights,
					);
				}
			}

			return $fonts_arr;
		}

		/**
		 * Get fonts
		 *
		 * @since 2.0.0
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
					if ( $value === $deleted_term->name ) {
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
