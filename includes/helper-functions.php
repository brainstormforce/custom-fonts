<?php
/**
 * Helper functions font settings.
 *
 * @package     Bsf_Custom_Fonts
 * @since       x.x.x
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitize data recursively, eg: font-face data.
 *
 * @since x.x.x
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
 * @since x.x.x
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
 * @return mixed
 * @since x.x.x
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
 * Based on the post-meta create font-face CSS.
 *
 * @since x.x.x
 */
function bcf_prepare_font_face_css( $font_family, $font_data, $variation_data ) {
	$src = array();
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

	$font_face = '@font-face {' . PHP_EOL;
	$font_face .= "\tfont-family: '" . $font_family . "';" . PHP_EOL;
	$font_face .= ! empty( $variation_data['font_style'] ) ? "\tfont-style: " . $variation_data['font_style'] . ';' . PHP_EOL : '';
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
 * @since x.x.x
 * @return string css
 */
function bcf_get_font_face_css( $post_id, $font_data = array() ) {
	$saved = get_post_meta( $post_id, 'fonts-face', true );
	if ( ! empty( $saved ) ) {
		return $saved;
	}

	$font_face   = '';
	$font_family = get_the_title( $post_id );

	if ( empty( $font_data ) ) {
		$font_data = get_post_meta( $post_id, 'fonts-data', true );
	}
	if ( empty( $font_data ) || ( ! empty( $font_data ) && empty( $font_data['variations'] ) ) ) {
		return '';
	}

	foreach ( $font_data['variations'] as $key => $variation_data ) {
		$font_face .= bcf_prepare_font_face_css( $font_family, $font_data, $variation_data ) . PHP_EOL;
	}

	return $font_face;
}
