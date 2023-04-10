<?php
/**
 * Bsf Custom Fonts Admin Loader
 *
 * @package Astra
 * @since 2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bsf_Custom_Fonts_Admin_Loader
 *
 * @since 2.0.0
 */
class Bsf_Custom_Fonts_Admin_Loader {

	/**
	 * Instance
	 *
	 * @access private
	 * @var null $instance
	 * @since 2.0.0
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since 2.0.0
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			/** @psalm-suppress InvalidPropertyAssignmentValue */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			self::$instance = new self();
			/** @psalm-suppress InvalidPropertyAssignmentValue */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 4.0.0
	 */
	public function __construct() {
		define( 'CUSTOM_FONTS_ADMIN_DIR', BSF_CUSTOM_FONTS_DIR . 'admin/react' );
		define( 'CUSTOM_FONTS_ADMIN_URL', BSF_CUSTOM_FONTS_URI . 'admin/react' );

		$this->includes();
	}

	/**
	 * Include required classes.
	 *
	 * @since 2.0.0
	 */
	public function includes() {
		/* Ajax init */
		require_once CUSTOM_FONTS_ADMIN_DIR . '/includes/class-custom-fonts-admin-ajax.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.

		/* Setup Menu */
		require_once CUSTOM_FONTS_ADMIN_DIR . '/includes/class-custom-fonts-menu.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.
	}
}

Bsf_Custom_Fonts_Admin_Loader::get_instance();
