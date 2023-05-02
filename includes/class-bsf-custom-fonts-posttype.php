<?php
/**
 * Bsf Custom Fonts Taxonomy
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

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
		private static $instance = null;

		/**
		 * Fonts
		 *
		 * @since  1.0.0
		 * @var (string) $fonts
		 */
		public static $fonts = null;

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
			add_action( 'init', array( $this, 'bsf_custom_fonts_post_type' ) );
		}

		/**
		 * Create custom post type.
		 *
		 * @since x.x.x
		 */
		public function bsf_custom_fonts_post_type() {

			$labels = array(
				'name'          => esc_html_x( 'Custom Fonts', 'font general name', 'custom-fonts' ),
				'singular_name' => esc_html_x( 'Font', 'font singular name', 'custom-fonts' ),
				'search_items'  => esc_html__( 'Search Font', 'custom-fonts' ),
				'all_items'     => esc_html__( 'All Fonts', 'custom-fonts' ),
				'edit_item'     => esc_html__( 'Edit Font', 'custom-fonts' ),
				'view_item'     => esc_html__( 'View Font', 'custom-fonts' ),
				'add_new'       => esc_html__( 'Add New', 'custom-fonts' ),
				'update_item'   => esc_html__( 'Update Font', 'custom-fonts' ),
				'add_new_item'  => esc_html__( 'Add New', 'custom-fonts' ),
				'new_item_name' => esc_html__( 'New Font Name', 'custom-fonts' ),
			);

			$args = array(
				'labels'              => $labels,
				'show_in_menu'        => false,
				'public'              => false, // it's not public, not own permalink.
				'publicly_queryable'  => true,  // you should be able to query it.
				'show_ui'             => true,
				'query_var'           => true,
				'can_export'          => true,
				'show_in_admin_bar'   => false,
				'exclude_from_search' => true,
				'has_archive'         => false,  // it shouldn't have archive page.
				'rewrite'             => false,  // it shouldn't have rewrite rules.
				'supports'            => array( 'title' ),
				'capability_type'     => 'post',
			);

			register_post_type( BSF_CUSTOM_FONTS_POST_TYPE, $args );
		}

		/**
		 * Default fonts
		 *
		 * @since 1.0.0
		 * @param array $fonts fonts array of fonts.
		 */
		protected static function default_args( $fonts ) {
			return wp_parse_args(
				$fonts,
				array(
					'font_fallback'   => '',
					'font-display'    => 'swap',
					'repeater_fields' => array(
						'400' => array(
							'font_woff_2' => '',
							'font_woff'   => '',
							'font_ttf'    => '',
							'font_svg'    => '',
							'font_eot'    => '',
							'font_otf'    => '',
						),
					),
				)
			);
		}

		/**
		 * Get fonts
		 *
		 * @since 1.0.0
		 * @return array $fonts fonts array of fonts.
		 */
		public static function get_fonts() {
			self::create_custom_fonts_taxonomies();
			if ( is_null( self::$fonts ) ) {
				self::$fonts = array();

				$terms = get_terms(
					self::$register_taxonomy_slug,
					array(
						'hide_empty' => false,
					)
				);
				if ( ! empty( $terms ) ) {
					foreach ( $terms as $term ) {
						self::$fonts[ $term->name ] = self::get_font_links( $term->term_id );
					}
				}
			}
			return self::$fonts;
		}

		/**
		 * Get font data from name
		 *
		 * @since 1.0.0
		 * @param string $name custom font name.
		 * @return array $font_links custom font data.
		 */
		public static function get_links_by_name( $name ) {

			$terms      = get_terms(
				self::$register_taxonomy_slug,
				array(
					'hide_empty' => false,
				)
			);
			$font_links = array();
			if ( ! empty( $terms ) ) {

				foreach ( $terms as $term ) {
					if ( $term->name == $name ) {
						$font_links[ $term->name ] = self::get_font_links( $term->term_id );
					}
				}
			}

			return $font_links;

		}

		/**
		 * Get font links
		 *
		 * @since 1.0.0
		 * @param int $term_id custom font term id.
		 * @return array $links custom font data links.
		 */
		public static function get_font_links( $term_id ) {
			$links = get_option( 'taxonomy_' . self::$register_taxonomy_slug . "_{$term_id}", array() );
			return $links;
		}

		/**
		 * Update font data from name
		 *
		 * @since 1.0.0
		 * @param array $posted custom font data.
		 * @param int   $term_id custom font term id.
		 */
		public static function update_font_links( $posted, $term_id ) {
			$links = self::get_font_links( $term_id );
			$links = $posted;
			update_option( 'taxonomy_' . self::$register_taxonomy_slug . "_{$term_id}", $links );
		}
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts_Taxonomy::get_instance();

endif;
