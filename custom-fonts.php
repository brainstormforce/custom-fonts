<?php
/**
 * Plugin Name:     Custom Fonts
 * Plugin URI:      http://www.wpastra.com/
 * Description:     Upload your own custom font or choose from a vast collection of Google fonts, all hosted directly on your server. Enjoy improved performance, enhanced privacy, and full site editing theme support. Take control of your website's typography without compromising performance, privacy or compliance!
 * Author:          Brainstorm Force
 * Author URI:      http://www.brainstormforce.com
 * Text Domain:     custom-fonts
 * Version:         2.1.6
 *
 * @package         Bsf_Custom_Fonts
 */

/**
 * Exit if accessed directly.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Set constants.
 */
define( 'BSF_CUSTOM_FONTS_FILE', __FILE__ );
define( 'BSF_CUSTOM_FONTS_BASE', plugin_basename( BSF_CUSTOM_FONTS_FILE ) );
define( 'BSF_CUSTOM_FONTS_DIR', plugin_dir_path( BSF_CUSTOM_FONTS_FILE ) );
define( 'BSF_CUSTOM_FONTS_URI', plugins_url( '/', BSF_CUSTOM_FONTS_FILE ) );
define( 'BSF_CUSTOM_FONTS_VER', '2.1.6' );
define( 'BSF_CUSTOM_FONTS_POST_TYPE', 'bsf_custom_fonts' );
define( 'BSF_CUSTOM_FONTS_ADMIN_PAGE', 'bsf-custom-fonts' );

/**
 * BSF Custom Fonts
 */
require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts.php';

/**
 * Helper functions needed for further processing.
 */
require_once BSF_CUSTOM_FONTS_DIR . '/includes/helper-functions.php';

/**
 * BSF Custom Fonts Background Updater.
 */
require_once BSF_CUSTOM_FONTS_DIR . 'includes/plugin-update/class-custom-fonts-update.php';

/**
 * Rest API support.
 */
require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-custom-fonts-api-init.php';

/**
 * WP Filesystem extender.
 */
require_once BSF_CUSTOM_FONTS_DIR . '/includes/class-bcf-filesystem.php';

/**
 * Plugin's Google fonts compatibility processor.
 */
require_once BSF_CUSTOM_FONTS_DIR . '/includes/class-bcf-google-fonts-compatibility.php';

if ( is_admin() ) {

	/**
	 * Admin Notice Library Settings
	 */
	require_once BSF_CUSTOM_FONTS_DIR . 'lib/notices/class-astra-notices.php';

	/**
	 * Admin dashboard app.
	 */
	require_once BSF_CUSTOM_FONTS_DIR . 'admin/dashboard/class-bsf-custom-font-admin-loader.php';
}

// BSF Analytics library.
if ( ! class_exists( 'BSF_Analytics_Loader' ) ) {
	require_once BSF_CUSTOM_FONTS_DIR . 'admin/bsf-analytics/class-bsf-analytics-loader.php';
}

$bsf_analytics = BSF_Analytics_Loader::get_instance();

$bsf_analytics->set_entity(
	array(
		'bsf' => array(
			'product_name'    => 'Custom Fonts',
			'path'            => BSF_CUSTOM_FONTS_DIR . 'admin/bsf-analytics',
			'author'          => 'Brainstorm Force',
			'time_to_display' => '+24 hours',
		),
	)
);
