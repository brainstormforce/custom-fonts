<?php
/**
 * Bsf Custom Fonts Admin Loader
 *
 * @package Bsf_Custom_Fonts
 * @since 2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * BSF_Custom_Font_Admin_Loader
 *
 * @since 2.0.0
 */
class BSF_Custom_Font_Admin_Loader {

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
	 * @since 2.0.0
	 */
	public function __construct() {
		define( 'BSF_CUSTOM_FONTS_ADMIN_DIR', BSF_CUSTOM_FONTS_DIR . 'admin/dashboard' );
		define( 'BSF_CUSTOM_FONTS_ADMIN_URL', BSF_CUSTOM_FONTS_URI . 'admin/dashboard' );

		$this->includes();
	}

	/**
	 * Include required classes.
	 *
	 * @since 2.0.0
	 */
	public function includes() {
		/** Post type registration */
		require_once BSF_CUSTOM_FONTS_DIR . '/includes/class-bsf-custom-fonts-posttype.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.

		/* Ajax init */
		require_once BSF_CUSTOM_FONTS_ADMIN_DIR . '/includes/class-bsf-custom-fonts-admin-ajax.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.

		/* Font families */
		require_once BSF_CUSTOM_FONTS_ADMIN_DIR . '/includes/class-bcf-custom-font-families.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.

		/* Setup Menu */
		require_once BSF_CUSTOM_FONTS_ADMIN_DIR . '/includes/class-bsf-custom-fonts-menu.php'; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.
	}
}

BSF_Custom_Font_Admin_Loader::get_instance();
