<?php
/**
 * Bsf Custom Fonts Admin Ui
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

defined( 'ABSPATH' ) or exit;

if ( ! class_exists( 'Bsf_Custom_Fonts_Add' ) ) :

	/**
	 * Bsf_Custom_Fonts_Add
	 */
	class Bsf_Custom_Fonts_Add {

		/**
		 * Instance of Bsf_Custom_Fonts_Add
		 *
		 * @since  1.0.0
		 * @var (Object) Bsf_Custom_Fonts_Add
		 */
		private static $_instance = null;

		/**
		 * Instance of Bsf_Custom_Fonts_Admin.
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
			if ( ! Bsf_Custom_Fonts::get_instance()->taxonomy->has_fonts() )
			return;

			// add Custom Font list into Astra customizer.
			add_action( 'astra_customizer_font_list', array( $this, 'add_customizer_font_list') );
		}

		/**
		 * Add Custom Font list into Astra customizer.
		 *
		 * @since  1.0.0
		 * @param string $value selected font family.
		 */
		public function add_customizer_font_list( $value ) {

			$fonts = Bsf_Custom_Fonts::get_instance()->taxonomy->get_fonts();

				echo '<optgroup label="Custom">';

				foreach ( $fonts as $font => $links ) {
					echo '<option value="' . esc_attr( $font ) . '" ' . selected( $font, $value , false ) . '>' . esc_attr( $font ) . '</option>';
				}
		}
	}

endif;





