<?php
/**
 * Helper functions font settings.
 *
 * @package     Bsf_Custom_Fonts
 * @since       2.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return image media ID on basis of file URL.
 *
 * @param string $url file url.
 * @since 2.0.0
 * @return string
 */
function bcf_get_media_image_id_by_url( $url ) {
	global $wpdb;
	$image = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM $wpdb->posts WHERE guid='%s';", $url ) ); // phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.QuotedSimplePlaceholder
	if ( ! empty( $image ) ) {
		return $image[0];
	}
	return false;
}

/**
 * Create css for font-face
 *
 * @param array $font selected font from custom font list.
 *
 * @return array Font data.
 * @since 2.0.0
 */
function bcf_prepare_backward_font_data( $font ) {
	$fonts     = Bsf_Custom_Fonts_Taxonomy::get_links_by_name( $font );
	$font_data = array();
	$temp_arr  = array();
	$counter   = 0;

	foreach ( $fonts as $font_key => $font_value ) {
		$font_data['font_name'] = $font_key;
		foreach ( $font_value as $key => $value ) {
			if ( isset( $temp_arr[ $counter ]['id'] ) && '' !== $temp_arr[ $counter ]['id'] &&
				isset( $temp_arr[ $counter ]['font_style'] ) && '' !== $temp_arr[ $counter ]['font_style'] &&
				isset( $temp_arr[ $counter ]['font_url'] ) && '' !== $temp_arr[ $counter ]['font_url'] &&
				isset( $temp_arr[ $counter ]['font_file'] ) && '' !== $temp_arr[ $counter ]['font_file'] &&
				isset( $temp_arr[ $counter ]['font_weight'] ) && '' !== $temp_arr[ $counter ]['font_weight']
			) {
				$counter = $counter + 1; // phpcs:ignore Squiz.Operators.IncrementDecrementUsage.Found
			}

			$consider_counter = false;

			if ( strpos( $key, 'display' ) !== false ) {
				$font_data['font_display'] = $value;
				$consider_counter          = true;
			}
			if ( strpos( $key, 'fallback' ) !== false ) {
				$font_data['font_fallback'] = $value;
				$consider_counter           = true;
			}
			if ( strpos( $key, 'weight' ) !== false ) {
				$temp_arr[ $counter ]['font_weight'] = $value;
				$consider_counter                    = true;
			}

			if ( strpos( $key, 'font_woff_2' ) !== false && $value ) {
				$consider_counter                  = true;
				$temp_arr[ $counter ]['font_url']  = esc_url( $value );
				$temp_arr[ $counter ]['font_file'] = bcf_get_media_image_id_by_url( $value );
			}
			if ( strpos( $key, 'font_woff-' ) !== false && $value ) {
				$consider_counter                  = true;
				$temp_arr[ $counter ]['font_url']  = esc_url( $value );
				$temp_arr[ $counter ]['font_file'] = bcf_get_media_image_id_by_url( $value );
			}
			if ( strpos( $key, 'font_ttf-' ) !== false && $value ) {
				$consider_counter                  = true;
				$temp_arr[ $counter ]['font_url']  = esc_url( $value );
				$temp_arr[ $counter ]['font_file'] = bcf_get_media_image_id_by_url( $value );
			}
			if ( strpos( $key, 'font_eot-' ) !== false && $value ) {
				$consider_counter                  = true;
				$temp_arr[ $counter ]['font_url']  = esc_url( $value );
				$temp_arr[ $counter ]['font_file'] = bcf_get_media_image_id_by_url( $value );
			}
			if ( strpos( $key, 'font_svg-' ) !== false && $value ) {
				$consider_counter                  = true;
				$temp_arr[ $counter ]['font_url']  = esc_url( $value );
				$temp_arr[ $counter ]['font_file'] = bcf_get_media_image_id_by_url( $value );
			}
			if ( strpos( $key, 'font_otf-' ) !== false && $value ) {
				$consider_counter                  = true;
				$temp_arr[ $counter ]['font_url']  = esc_url( $value );
				$temp_arr[ $counter ]['font_file'] = bcf_get_media_image_id_by_url( $value );
			}

			if ( true === $consider_counter ) {
				$temp_arr[ $counter ]['id']         = $counter + 1;
				$temp_arr[ $counter ]['font_style'] = 'normal';
			}
		}

		$final_font_arr = array();
		if ( ! empty( $temp_arr ) ) {
			foreach ( $temp_arr as $index => $data ) {
				if ( ! empty( $data['font_weight'] ) ) {
					$final_font_arr[] = $data;
				}
			}
		}

		$font_data['variations'] = $final_font_arr;
	}

	return $font_data;
}

/**
 * Sanitize data recursively, eg: font-face data.
 *
 * @param array $data Data to sanitize.
 *
 * @return array
 * @since 2.0.0
 */
function bcf_sanitize_text_field_recursive( $data ) {
	if ( is_array( $data ) ) {
		foreach ( $data as $key => $value ) {
			$data[ $key ] = bcf_sanitize_text_field_recursive( $value );
		}

		return $data;
	}
	return sanitize_text_field( $data );
}

/**
 * Get font source as per the asked type.
 *
 * @param string $font_type Font type.
 * @param string $font_url Font URL.
 *
 * @return string
 * @since 2.0.0
 */
function bcf_get_font_src( $font_type, $font_url ) {
	$font_src = 'url(\'' . esc_url( $font_url ) . '\') ';
	switch ( $font_type ) {
		case 'woff':
		case 'woff2':
		case 'svg':
			$font_src .= 'format(\'' . $font_type . '\')';
			break;

		case 'ttf':
			$font_src .= 'format(\'truetype\')';
			break;

		case 'otf':
			$font_src .= 'format(\'OpenType\')';
			break;

		case 'eot':
			$font_src = 'url(\'' . esc_url( $font_url ) . '?#iefix\') format(\'embedded-opentype\')';
			break;
	}

	return $font_src;
}

/**
 * Get the file extension of font file.
 *
 * @param string $font_url Font URL.
 *
 * @return mixed
 * @since 2.0.0
 */
function bcf_get_font_file_extension( $font_url ) {
	$file_last_chunk = substr( $font_url, -6 );
	if ( strpos( $file_last_chunk, '.woff2' ) !== false ) {
		return 'woff2';
	}

	if ( strpos( $file_last_chunk, '.woff' ) !== false ) {
		return 'woff';
	}

	if ( strpos( $file_last_chunk, '.ttf' ) !== false ) {
		return 'ttf';
	}

	if ( strpos( $file_last_chunk, '.eot' ) !== false ) {
		return 'eot';
	}

	if ( strpos( $file_last_chunk, '.svg' ) !== false ) {
		return 'svg';
	}

	if ( strpos( $file_last_chunk, '.otf' ) !== false ) {
		return 'otf';
	}

	return false;
}

/**
 * Based on the font post data create font-face CSS.
 *
 * @param string $font_family Font family name.
 * @param array  $font_data Font data.
 * @param array  $variation_data Font variation data.
 *
 * @return string
 * @since 2.0.0
 */
function bcf_prepare_gfont_face_css( $font_family, $font_data, $variation_data ) {
	$src       = array();
	$font_urls = $variation_data['font_url'];

	foreach ( $font_urls as $url ) {
		$file_extension = bcf_get_font_file_extension( $url );
		if ( ! $file_extension ) {
			return '';
		}

		foreach ( array( 'eot', 'woff2', 'woff', 'ttf', 'svg', 'otf' ) as $type ) {
			if ( empty( $url ) || $file_extension !== $type ) {
				continue;
			}

			$src[] = bcf_get_font_src( $type, $url );
		}
	}

	$font_face  = '@font-face {' . PHP_EOL;
	$font_face .= "\tfont-family: '" . $font_family . "';" . PHP_EOL;
	$font_face .= ! empty( $variation_data['font_style'] ) ? "\tfont-style: " . $variation_data['font_style'] . ';' . PHP_EOL : '';
	$font_face .= ! empty( $variation_data['font_weight'] ) ? "\tfont-weight: " . $variation_data['font_weight'] . ';' . PHP_EOL : '';
	$font_face .= ! empty( $font_data['font_display'] ) ? "\tfont-display: " . $font_data['font_display'] . ';' . PHP_EOL : '';
	$font_face .= ! empty( $font_data['font_fallback'] ) ? "\tfont-fallback: " . $font_data['font_fallback'] . ';' . PHP_EOL : '';

	if ( empty( $font_urls ) ) {
		$font_face .= '}';
		return $font_face;
	}

	$font_face .= "\tsrc: " . implode( ',' . PHP_EOL . "\t\t", $src ) . ';' . PHP_EOL . '}';

	return $font_face;
}

/**
 * Based on the post-meta create font-face CSS.
 *
 * @param string $font_family Font family name.
 * @param array  $font_data   Font data.
 * @param array  $variation_data Font variation data.
 *
 * @return string
 * @since 2.0.0
 */
function bcf_prepare_lfont_face_css( $font_family, $font_data, $variation_data ) {
	$src            = array();
	$file_extension = bcf_get_font_file_extension( $variation_data['font_url'] );
	if ( ! $file_extension ) {
		return '';
	}

	foreach ( array( 'eot', 'woff2', 'woff', 'ttf', 'svg', 'otf' ) as $type ) {
		if ( empty( $variation_data['font_url'] ) || $file_extension !== $type ) {
			continue;
		}

		$src[] = bcf_get_font_src( $type, $variation_data['font_url'] );
	}

	$font_face  = '@font-face {' . PHP_EOL;
	$font_face .= "\tfont-family: '" . $font_family . "';" . PHP_EOL;
	$font_face .= ! empty( $variation_data['font_weight'] ) ? "\tfont-weight: " . $variation_data['font_weight'] . ';' . PHP_EOL : '';
	$font_face .= ! empty( $font_data['font_display'] ) ? "\tfont-display: " . $font_data['font_display'] . ';' . PHP_EOL : '';
	$font_face .= ! empty( $font_data['font_fallback'] ) ? "\tfont-fallback: " . $font_data['font_fallback'] . ';' . PHP_EOL : '';

	if ( empty( $variation_data['font_url'] ) ) {
		$font_face .= '}';
		return $font_face;
	}

	$font_face .= "\tsrc: " . implode( ',' . PHP_EOL . "\t\t", $src ) . ';' . PHP_EOL . '}';

	return $font_face;
}

/**
 * Retrieve font-face CSS for assigned $post_id.
 *
 * @param int   $post_id Post ID.
 * @param array $font_data Font data.
 * @param bool  $force_update Force update.
 * @param bool  $is_google_font Is Google font.
 *
 * @since 2.0.0
 * @return string css
 */
function bcf_get_font_face_css( $post_id, $font_data = array(), $force_update = false, $is_google_font = false ) {
	$saved = get_post_meta( $post_id, 'fonts-face', true );
	if ( ! empty( $saved ) && false === $force_update ) {
		return $saved;
	}

	$font_face = '';
	if ( true === $is_google_font ) {
		$font_family = ! empty( $font_data['font_name'] ) ? $font_data['font_name'] : '';
	} else {
		$font_family = get_the_title( $post_id );
	}

	if ( empty( $font_data ) ) {
		$font_data = get_post_meta( $post_id, 'fonts-data', true );
	}
	if ( empty( $font_data ) || ( ! empty( $font_data ) && empty( $font_data['variations'] ) ) ) {
		return '';
	}

	foreach ( $font_data['variations'] as $key => $variation_data ) {
		if ( true === $is_google_font ) {
			$font_face .= bcf_prepare_gfont_face_css( $font_family, $font_data, $variation_data ) . PHP_EOL;
		} else {
			$font_face .= bcf_prepare_lfont_face_css( $font_family, $font_data, $variation_data ) . PHP_EOL;
		}
	}

	return $font_face;
}
