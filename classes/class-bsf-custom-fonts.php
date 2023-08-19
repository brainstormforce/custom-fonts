<?php
/**
 * Bsf Custom fonts - Init
 *
 * @package Bsf_Custom_Fonts
 */

if ( ! class_exists( 'Bsf_Custom_Fonts' ) ) {

	/**
	 * Bsf Custom fonts
	 *
	 * @since 1.0.0
	 */
	class Bsf_Custom_Fonts {

		/**
		 * Member Varible
		 *
		 * @var object instance
		 */
		private static $instance;

		/**
		 *  Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {

			$this->custom_fonts_update();
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-taxonomy.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts-render.php';

			if ( is_admin() ) {
				require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-admin.php';
				require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts-white-label.php';
			}
		}

		/**
		 * Run the update functions.
		 *
		 * @since 1.2.5
		 * @return void
		 */
		public function custom_fonts_update() {
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/plugin-update/class-custom-fonts-update.php';
		}
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts::get_instance();
}
