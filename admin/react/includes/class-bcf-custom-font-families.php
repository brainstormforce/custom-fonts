<?php
/**
 * Helper class for font settings.
 *
 * @package     Bsf_Custom_Fonts
 * @since       2.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Font info class for System and Google fonts.
 */
if ( ! class_exists( 'BCF_Custom_Font_Families' ) ) :

	/**
	 * Font info class for System and Google fonts.
	 */
	final class BCF_Custom_Font_Families {

		/**
		 * Google Fonts
		 *
		 * @since 1.0.19
		 * @var array
		 */
		public static $google_fonts = array();

		/**
		 * Variant labels.
		 *
		 * @since 2.0.0
		 * @return array
		 */
		public static function font_variant_labels() {
			return array(
				'100'       => __( 'Thin 100', 'custom-fonts' ),
				'200'       => __( 'Extra Light 200', 'custom-fonts' ),
				'300'       => __( 'Light 300', 'custom-fonts' ),
				'400'       => __( 'Regular 400', 'custom-fonts' ),
				'500'       => __( 'Medium 500', 'custom-fonts' ),
				'600'       => __( 'Semi-Bold 600', 'custom-fonts' ),
				'700'       => __( 'Bold 700', 'custom-fonts' ),
				'800'       => __( 'Extra-Bold 800', 'custom-fonts' ),
				'900'       => __( 'Ultra-Bold 900', 'custom-fonts' ),
				'100italic' => __( 'Thin 100 Italic', 'custom-fonts' ),
				'200italic' => __( 'Extra Light 200 Italic', 'custom-fonts' ),
				'300italic' => __( 'Light 300 Italic', 'custom-fonts' ),
				'400italic' => __( 'Regular 400 Italic', 'custom-fonts' ),
				'italic'    => __( 'Regular 400 Italic', 'custom-fonts' ),
				'500italic' => __( 'Medium 500 Italic', 'custom-fonts' ),
				'600italic' => __( 'Semi-Bold 600 Italic', 'custom-fonts' ),
				'700italic' => __( 'Bold 700 Italic', 'custom-fonts' ),
				'800italic' => __( 'Extra-Bold 800 Italic', 'custom-fonts' ),
				'900italic' => __( 'Ultra-Bold 900 Italic', 'custom-fonts' ),
			);
		}

		/**
		 * Get existing Google Fonts to strip from dropdown list from add new.
		 *
		 * @since  2.0.0
		 *
		 * @return Array Array of existing Google fonts.
		 */
		public static function get_existing_google_fonts() {
			$args         = array(
				'post_type'      => BSF_CUSTOM_FONTS_POST_TYPE,
				'post_status'    => 'publish',
				'fields'         => 'ids',
				'no_found_rows'  => true,
				'posts_per_page' => '-1',
				'meta_query'     => array(
					array(
						'key'     => 'font-type',
						'value'   => 'google',
						'compare' => '=',
					),
				),
			);
			$google_fonts = array();
			$query        = new WP_Query( $args );

			if ( $query->posts ) {
				foreach ( $query->posts as $key => $post_id ) {
					$google_fonts[] = get_the_title( $post_id );
				}
				wp_reset_postdata();
			}

			return $google_fonts;
		}

		/**
		 * Google Fonts used in Bsf Custom Fonts.
		 * Array is generated from the google-fonts.json file.
		 *
		 * @since  2.0.0
		 *
		 * @return Array Array of Google Fonts.
		 */
		public static function get_google_fonts() {

			if ( empty( self::$google_fonts ) ) {

				/**
				 * Deprecating the Filter to change the Google Fonts JSON file path.
				 *
				 * @since 2.0.0
				 * @param string $json_file File where google fonts json format added.
				 * @return array
				 */
				$google_fonts_file = apply_filters( 'bsf_custom_font_google_fonts_php_file', BSF_CUSTOM_FONTS_DIR . 'assets/fonts/google-fonts.php' );

				if ( ! file_exists( $google_fonts_file ) ) {
					return array();
				}

				$google_fonts_arr = include $google_fonts_file;// phpcs:ignore: WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
				foreach ( $google_fonts_arr as $key => $font ) {
					$name = key( $font );
					foreach ( $font[ $name ] as $font_key => $single_font ) {

						if ( 'variants' === $font_key ) {
							foreach ( $single_font as $variant_key => $variant ) {
								if ( 'regular' == $variant ) {
									$font[ $name ][ $font_key ][ $variant_key ] = '400';
								}
							}
						}

						if ( 'files' === $font_key ) {
							foreach ( $single_font as $file_key => $var ) {
								if ( 'regular' == $file_key ) {
									$font[ $name ][ $font_key ]['400'] = $var;
									unset( $font[ $name ][ $font_key ]['regular'] );
								} else {
									$font[ $name ][ $font_key ][ $file_key ] = $var;
								}
							}
						}

						self::$google_fonts[ $name ] = array_values( $font[ $name ] );
					}
				}
			}

			return apply_filters( 'bsf_custom_font_google_fonts', self::$google_fonts );
		}
	}

endif;
