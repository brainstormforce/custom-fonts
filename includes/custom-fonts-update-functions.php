<?php
/**
 * Custom Fonts Update Functions
 *
 * @package Custom_Fonts
 * @since   2.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Custom Fonts Background Updater 2.1.16
 *
 * Sets default performance settings for new installations.
 *
 * @since 2.1.16
 * @return void
 */
function custom_fonts_background_updater_2_1_16() {
	$settings = get_option( 'custom_fonts_settings', array() );

	// Set default font preload setting for performance.
	if ( ! isset( $settings['enable_font_preload'] ) ) {
		$settings['enable_font_preload'] = true;
		update_option( 'custom_fonts_settings', $settings );
	}

	// Set default font display setting.
	if ( ! isset( $settings['font_display_default'] ) ) {
		$settings['font_display_default'] = 'swap';
		update_option( 'custom_fonts_settings', $settings );
	}
}

/**
 * Custom Fonts Background Updater 2.2.0
 *
 * Introduces new font optimization settings and migrates existing fonts.
 *
 * @since 2.2.0
 * @return void
 */
function custom_fonts_background_updater_2_2_0() {
	$settings = get_option( 'custom_fonts_settings', array() );

	// Set font optimization defaults.
	if ( ! isset( $settings['enable_font_optimization'] ) ) {
		$settings['enable_font_optimization'] = true;
		update_option( 'custom_fonts_settings', $settings );
	}

	// Set subsetting defaults.
	if ( ! isset( $settings['enable_font_subsetting'] ) ) {
		$settings['enable_font_subsetting'] = false;
		update_option( 'custom_fonts_settings', $settings );
	}

	// Set WOFF2 priority setting.
	if ( ! isset( $settings['prioritize_woff2'] ) ) {
		$settings['prioritize_woff2'] = true;
		update_option( 'custom_fonts_settings', $settings );
	}

	// Set local Google Fonts hosting default.
	if ( ! isset( $settings['host_google_fonts_locally'] ) ) {
		$settings['host_google_fonts_locally'] = false;
		update_option( 'custom_fonts_settings', $settings );
	}

	// Migrate existing font posts to include new meta fields.
	$font_posts = get_posts(
		array(
			'post_type'      => BSF_CUSTOM_FONTS_POST_TYPE,
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		)
	);

	if ( ! empty( $font_posts ) ) {
		foreach ( $font_posts as $font_post ) {
			$font_id = $font_post->ID;

			// Add font optimization meta if not set.
			if ( ! get_post_meta( $font_id, 'font_optimization_enabled', true ) ) {
				update_post_meta( $font_id, 'font_optimization_enabled', true );
			}

			// Add font loading strategy meta if not set.
			if ( ! get_post_meta( $font_id, 'font_loading_strategy', true ) ) {
				update_post_meta( $font_id, 'font_loading_strategy', 'swap' );
			}

			// Add font subset meta if not set.
			if ( ! get_post_meta( $font_id, 'font_subset', true ) ) {
				update_post_meta( $font_id, 'font_subset', 'latin' );
			}
		}
	}
}

/**
 * Helper function to get Custom Fonts plugin option.
 *
 * @since 2.2.0
 * @param string $key     Option key.
 * @param mixed  $default Default value.
 * @return mixed
 */
function custom_fonts_get_option( $key, $default = false ) {
	$settings = get_option( 'custom_fonts_settings', array() );
	return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
}

/**
 * Helper function to update Custom Fonts plugin option.
 *
 * @since 2.2.0
 * @param string $key   Option key.
 * @param mixed  $value Option value.
 */
function custom_fonts_update_option( $key, $value ) {
	$settings         = get_option( 'custom_fonts_settings', array() );
	$settings[ $key ] = $value;
	update_option( 'custom_fonts_settings', $settings );
}

/**
 * Helper function to delete Custom Fonts plugin option.
 *
 * @since 2.2.0
 * @param string $key Option key.
 */
function custom_fonts_delete_option( $key ) {
	$settings = get_option( 'custom_fonts_settings', array() );
	if ( isset( $settings[ $key ] ) ) {
		unset( $settings[ $key ] );
		update_option( 'custom_fonts_settings', $settings );
	}
}