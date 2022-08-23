<?php
/**
 * Plugin Name:     Custom Fonts
 * Plugin URI:      http://www.wpastra.com/
 * Description:     Custom Fonts allows you to add more fonts that extend formatting options in your site.
 * Author:          Brainstorm Force
 * Author URI:      http://www.brainstormforce.com
 * Text Domain:     custom-fonts
 * Version:         1.3.7
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
define( 'BSF_CUSTOM_FONTS_VER', '1.3.7' );

/**
 * BSF Custom Fonts
 */
require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts.php';

if ( is_admin() ) {

	/**
	 * Admin Notice Library Settings
	 */
	require_once BSF_CUSTOM_FONTS_DIR . 'lib/notices/class-astra-notices.php';
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

