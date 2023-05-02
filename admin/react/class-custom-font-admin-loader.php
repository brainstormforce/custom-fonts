<?php
/**
 * Bsf Custom Fonts Admin Loader
 *
 * @package Bsf_Custom_Fonts
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bsf_Custom_Fonts_Admin_Loader
 *
 * @since x.x.x
 */
class Bsf_Custom_Fonts_Admin_Loader {

	/**
	 * Instance
	 *
	 * @access private
	 * @var null $instance
	 * @since x.x.x
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since x.x.x
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
		define( 'BSF_CUSTOM_FONTS_ADMIN_DIR', BSF_CUSTOM_FONTS_DIR . 'admin/react' );
		define( 'BSF_CUSTOM_FONTS_ADMIN_URL', BSF_CUSTOM_FONTS_URI . 'admin/react' );

		$this->includes();
	}

	/**
	 * Include required classes.
	 *
	 * @since x.x.x
	 */
	public function includes() {
		/** Post type registration */
		require_once BSF_CUSTOM_FONTS_DIR . '/includes/class-bsf-custom-fonts-posttype.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.

		/* Ajax init */
		require_once BSF_CUSTOM_FONTS_ADMIN_DIR . '/includes/class-custom-fonts-admin-ajax.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.

		/* Setup Menu */
		require_once BSF_CUSTOM_FONTS_ADMIN_DIR . '/includes/class-custom-fonts-menu.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.
	}
}

Bsf_Custom_Fonts_Admin_Loader::get_instance();
