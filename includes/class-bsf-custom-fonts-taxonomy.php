<?php
/**
 * Bsf Custom Fonts Taxonomy
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

defined( 'ABSPATH' ) or exit;

if ( ! class_exists( 'Bsf_Custom_Fonts_Taxonomy' ) ) :

	/**
	 * Bsf_Custom_Fonts_Taxonomy
	 */
	class Bsf_Custom_Fonts_Taxonomy {
		/**
		 * Instance of Bsf_Custom_Fonts_Taxonomy
		 *
		 * @since  1.0.0
		 * @var (Object) Bsf_Custom_Fonts_Taxonomy
		 */
		private static $_instance = null;

		/**
		 * Fonts
		 *
		 * @since  1.0.0
		 * @var (string) $fonts
		 */
		protected $fonts = null;

		/**
		 * Capability required for this menu to be displayed
		 *
		 * @since  1.0.0
		 * @var (string) $capability
		 */
		public static $capability = 'edit_theme_options';

		/**
		 * Register Taxonomy
		 *
		 * @since  1.0.0
		 * @var (string) $register_taxonomy
		 */
		public static $register_taxonomy_slug = 'bsf_custom_fonts';

		/**
		 * Instance of Bsf_Custom_Fonts_Admin_Ui.
		 *
		 * @since  1.0.0
		 *
		 * @return object Class object.
		 */
		public static function set_instance() {
			if ( ! isset( self::$_instance ) ) {
				self::$_instance = new self;
			}

			return self::$_instance;
		}

		/**
		 * Constructor.
		 *
		 * @since  1.0.0
		 */
		public function __construct() {
			$this->create_custom_fonts_taxonomies();
		}

		/**
		 * Register custom font taxonomy
		 *
		 * @since 1.0.0
		 */
		public function create_custom_fonts_taxonomies() {
			// Taxonomy: bsf_custom_fonts.
			$labels = array(
				'name' => __( 'Bsf Custom Fonts', 'bsf-custom-fonts' ),
				'singular_name' => __( 'Font', 'bsf-custom-fonts' ),
				'menu_name' => _x( 'Bsf Custom Fonts', 'Admin menu name', 'bsf-custom-fonts' ),
				'search_items' => __( 'Search Fonts', 'bsf-custom-fonts' ),
				'all_items' => __( 'All Fonts', 'bsf-custom-fonts' ),
				'parent_item' => __( 'Parent Font', 'bsf-custom-fonts' ),
				'parent_item_colon' => __( 'Parent Font:', 'bsf-custom-fonts' ),
				'edit_item' => __( 'Edit Font', 'bsf-custom-fonts' ),
				'update_item' => __( 'Update Font', 'bsf-custom-fonts' ),
				'add_new_item' => __( 'Add New Font', 'bsf-custom-fonts' ),
				'new_item_name' => __( 'New Font Name', 'bsf-custom-fonts' ),
			);

			$args = array(
				'hierarchical' => false,
				'labels' => $labels,
				'public' => false,
				'show_in_nav_menus' => false,
				'show_ui' => true,
				'capabilities' => array( self::$capability ),
				'query_var' => false,
				'rewrite' => false,
			);

			register_taxonomy(
				self::$register_taxonomy_slug,
				apply_filters( 'bsf_taxonomy_objects_custom_fonts', array() ),
				apply_filters( 'bsf_taxonomy_args_custom_fonts', $args )
			);
		}

		/**
		 * Default fonts
		 *
		 * @since 1.0.0
		 * @param array fonts array of fonts.
		 */
		protected function default_args( $fonts ) {
			return wp_parse_args(
				$fonts,
				array(
					'font_woff' => '',
					'font_ttf' => '',
					'font_svg' => '',
					'font_eot' => '',
				)
			);
		}

		/**
		 * Get fonts
		 *
		 * @since 1.0.0
		 * @return array fonts array of fonts.
		 */
		public function get_fonts() {
			if ( is_null( $this->fonts ) ) {
				$this->fonts = array();

				$terms = get_terms(
					self::$register_taxonomy_slug,
					array(
						'hide_empty' => false,
					)
				);


				if ( ! empty( $terms ) ) {
					foreach ( $terms as $term ) {
						$this->fonts[ $term->name ] = $term->name;
						$this->fonts[ $term->name ] = $this->get_font_links( $term->term_id );
					}
				}
			}
			return $this->fonts;
		}

		public function has_fonts() {
			$fonts = $this->get_fonts();
			return ! empty( $fonts );
		}

		public function get_font_links( $term_id ) {
			$links = get_option( "taxonomy_" . self::$register_taxonomy_slug . "_{$term_id}", array() );
			return $this->default_args( $links );
		}

		public function update_font_links( $posted, $term_id ) {

			$links = $this->get_font_links( $term_id );
			foreach ( array_keys( $links ) as $key ) {
				if ( isset( $posted[ $key ] ) ) {
					$links[ $key ] = $posted[ $key ];
				} else {
					$links[ $key ] = '';
				}
			}
			update_option( "taxonomy_" . self::$register_taxonomy_slug . "_{$term_id}", $links );
		}

	}

endif;
