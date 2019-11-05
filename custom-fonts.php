<?php
/**
 * Plugin Name:     Custom Fonts
 * Plugin URI:      http://www.wpastra.com/
 * Description:     Custom Fonts allows you to add more fonts that extend formatting options in your site.
 * Author:          Brainstorm Force
 * Author URI:      http://www.brainstormforce.com
 * Text Domain:     custom-fonts
 * Version:         1.2.0
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
define( 'BSF_CUSTOM_FONTS_VER', '1.2.0' );

/**
 * BSF Custom Fonts
 */
require_once BSF_CUSTOM_FONTS_DIR . 'classes/class-bsf-custom-fonts.php';
require_once BSF_CUSTOM_FONTS_DIR . 'includes/lib/notices/class-astra-notices.php';

if ( ! function_exists( 'register_notices' ) ) :

	/**
	 * Ask Theme Rating
	 *
	 * @since 1.4.0
	 */
	function register_notices() {
		$image_path = BSF_CUSTOM_FONTS_URI . 'assets/images/custom-fonts-icon.png';
		Astra_Notices::add_notice(
			array(
				'id'                         => 'custom-fonts-rating',
				'type'                       => '',
				'message'                    => sprintf(
					'<div class="notice-image">
							<img src="%1$s" class="custom-logo" alt="Custom Fonts" itemprop="logo"></div> 
							<div class="notice-content">
								<div class="notice-heading">
									%2$s
								</div>
								%3$s<br />
								<div class="astra-review-notice-container">
									<a href="%4$s" class="astra-notice-close astra-review-notice button-primary" target="_blank">
									%5$s
									</a>
								<span class="dashicons dashicons-calendar"></span>
									<a href="#" data-repeat-notice-after="%6$s" class="astra-notice-close astra-review-notice">
									%7$s
									</a>
								<span class="dashicons dashicons-smiley"></span>
									<a href="#" class="astra-notice-close astra-review-notice">
									%8$s
									</a>
								</div>
							</div>',
					$image_path,
					__( 'Hello! Seems like you have used Custom Fonts to build this website — Thanks a ton!', 'custom-fonts' ),
					__( 'Could you please do us a BIG favor and give it a 5-star rating on WordPress? This would boost our motivation and help other users make a comfortable decision while choosing the Custom Fonts.', 'custom-fonts' ),
					'https://wordpress.org/support/plugin/custom-fonts/reviews/?filter=5#new-post',
					__( 'Ok, you deserve it', 'custom-fonts' ),
					MONTH_IN_SECONDS,
					__( 'Nope, maybe later', 'custom-fonts' ),
					__( 'I already did', 'custom-fonts' )
				),
				'repeat-notice-after'        => MONTH_IN_SECONDS,
				'priority'                   => 25,
				'display-with-other-notices' => false,
			)
		);
	}

	add_action( 'admin_notices', 'register_notices' );

endif;

