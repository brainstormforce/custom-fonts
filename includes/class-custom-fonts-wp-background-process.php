<?php
/**
 * Custom Fonts Background Process Implementation
 *
 * @package Custom_Fonts
 * @since   2.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Custom_Fonts_WP_Background_Process' ) ) {
	require_once BSF_CUSTOM_FONTS_DIR . 'includes/lib/batch-processing/class-custom-fonts-wp-background-process.php';
}

/**
 * Custom_Fonts_Theme_Background_Process class.
 */
class Custom_Fonts_Theme_Background_Process extends Custom_Fonts_WP_Background_Process {

	/**
	 * Prefix
	 *
	 * @var string
	 * @access protected
	 */
	protected $prefix = 'custom_fonts';

	/**
	 * Action
	 *
	 * @var string
	 * @access protected
	*/
	protected $action = 'db_updates';

	/**
	 * Specific method to run on the queue job.
	 *
	 * @param  mixed $callback Update callback function.
	 * @return mixed
	 */
	protected function task( $callback ) {
		if ( is_callable( $callback ) ) {
			call_user_func( $callback );
		}

		return false;
	}

	/**
	 * Called when background process has been completed.
	 */
	protected function complete() {
		Custom_Fonts_Background_Updater::update_db_version();
		parent::complete();
	}
}