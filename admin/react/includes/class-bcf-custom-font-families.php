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
				'100'       => __( 'Thin 100', 'astra' ),
				'200'       => __( 'Extra Light 200', 'astra' ),
				'300'       => __( 'Light 300', 'astra' ),
				'400'       => __( 'Regular 400', 'astra' ),
				'500'       => __( 'Medium 500', 'astra' ),
				'600'       => __( 'Semi-Bold 600', 'astra' ),
				'700'       => __( 'Bold 700', 'astra' ),
				'800'       => __( 'Extra-Bold 800', 'astra' ),
				'900'       => __( 'Ultra-Bold 900', 'astra' ),
				'100italic' => __( 'Thin 100 Italic', 'astra' ),
				'200italic' => __( 'Extra Light 200 Italic', 'astra' ),
				'300italic' => __( 'Light 300 Italic', 'astra' ),
				'400italic' => __( 'Regular 400 Italic', 'astra' ),
				'italic'    => __( 'Regular 400 Italic', 'astra' ),
				'500italic' => __( 'Medium 500 Italic', 'astra' ),
				'600italic' => __( 'Semi-Bold 600 Italic', 'astra' ),
				'700italic' => __( 'Bold 700 Italic', 'astra' ),
				'800italic' => __( 'Extra-Bold 800 Italic', 'astra' ),
				'900italic' => __( 'Ultra-Bold 900 Italic', 'astra' ),
			);
		}

		/**
		 * Get existing Google Fonts to strip from dropdown list from add new.
		 *
		 * @since  x.x.x
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
				$google_fonts_file = apply_filters( 'bsf_custom_font_google_fonts_php_file', BSF_CUSTOM_FONTS_DIR . 'includes/google-fonts.php' );

				if ( ! file_exists( $google_fonts_file ) ) {
					return array();
				}

				$google_fonts_arr = include $google_fonts_file;// phpcs:ignore: WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
				$existing_gfonts  = self::get_existing_google_fonts();
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

						self::$google_fonts[ $name ] = array_values( $font[ $name ] );
					}
				}
			}

			return apply_filters( 'bsf_custom_font_google_fonts', self::$google_fonts );
		}

	}

endif;
