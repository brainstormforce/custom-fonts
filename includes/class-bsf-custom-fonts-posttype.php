<?php
/**
 * Bsf Custom Fonts Taxonomy
 *
 * @since  2.0.0
 * @package Bsf_Custom_Fonts
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

if ( ! class_exists( 'BSF_Custom_Fonts_Posttype' ) ) :

	/**
	 * BSF_Custom_Fonts_Posttype
	 */
	class BSF_Custom_Fonts_Posttype {
		/**
		 * Instance of BSF_Custom_Fonts_Posttype
		 *
		 * @since  2.0.0
		 * @var (Object) BSF_Custom_Fonts_Posttype
		 */
		private static $instance = null;

		/**
		 * Fonts
		 *
		 * @since  2.0.0
		 * @var (string) $fonts
		 */
		public static $fonts = null;

		/**
		 * Capability required for this menu to be displayed
		 *
		 * @since  2.0.0
		 * @var (string) $capability
		 */
		public static $capability = 'edit_theme_options';

		/**
		 * Register Taxonomy
		 *
		 * @since  2.0.0
		 * @var (string) $register_taxonomy
		 */
		public static $register_taxonomy_slug = 'bsf_custom_fonts';

		/**
		 * Instance of Bsf_Custom_Fonts_Admin.
		 *
		 * @since  2.0.0
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
		 * @since  2.0.0
		 */
		public function __construct() {
			add_action( 'init', array( $this, 'bsf_custom_fonts_post_type' ) );
		}

		/**
		 * Create custom post type.
		 *
		 * @since 2.0.0
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
				'show_in_rest'        => true,
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
		 * @since 2.0.0
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
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	BSF_Custom_Fonts_Posttype::get_instance();

endif;
