<?php
/**
 * Bsf Custom Fonts update class
 *
 * @since  1.2.5
 * @package Bsf_Custom_Fonts
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Custom_Fonts_Update initial setup
 *
 * @since 1.2.5
 */
class Custom_Fonts_Update {

	/**
	 * Member Variable
	 *
	 * @var instance
	 */
	private static $instance;

	/**
	 * Option key for stored version number.
	 *
	 * @var instance
	 */
	private $db_version_key = '_custom_fonts_db_version';

	/**
	 *  Initiator
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	public function __construct() {

		// Plugin updates.
		if ( is_admin() ) {
			add_action( 'admin_init', array( $this, 'init' ), 5 );
		} else {
			add_action( 'wp', array( $this, 'init' ), 5 );
		}
	}

	/**
	 * Implement plugin update logic.
	 *
	 * @since 1.2.5
	 */
	public function init() {
		do_action( 'custom_fonts_update_before' );

		if ( ! $this->needs_db_update() ) {
			return;
		}

		$db_version = get_option( $this->db_version_key, false );

		if ( version_compare( $db_version, '1.2.4', '<=' ) ) {
			$this->v_1_2_5();
		}

		if ( version_compare( $db_version, '1.2.6', '<=' ) ) {
			$this->v_1_3_0();
		}

		if ( version_compare( $db_version, '2.0.2', '<=' ) ) {
			$this->v_2_0_2();
		}

		$this->update_db_version();

		do_action( 'custom_fonts_update_after' );
	}

	/**
	 * Removes the http:// from the font display property.
	 *
	 * @since 1.2.5
	 */
	public function v_1_2_5() {

		$terms = get_terms(
			'bsf_custom_fonts',
			array(
				'hide_empty' => false,
			)
		);

		if ( ! empty( $terms ) && class_exists( 'Bsf_Custom_Fonts_Taxonomy' ) ) {
			foreach ( $terms as $term ) {
				$font_links = Bsf_Custom_Fonts_Taxonomy::get_font_links( $term->term_id );

				$font_links['font-display'] = str_replace( 'http://', '', $font_links['font-display'] );

				Bsf_Custom_Fonts_Taxonomy::update_font_links( $font_links, $term->term_id );
			}
		}

	}

	/**
	 * Update the font array according to new font weight repeater fields.
	 *
	 * @since 2.0.0
	 */
	public function v_1_3_0() {

		$terms = get_terms(
			'bsf_custom_fonts',
			array(
				'hide_empty' => false,
			)
		);

		if ( ! empty( $terms ) && class_exists( 'Bsf_Custom_Fonts_Taxonomy' ) ) {
			foreach ( $terms as $term ) {
				$font_links = Bsf_Custom_Fonts_Taxonomy::get_font_links( $term->term_id );

				$new_font_arr                  = array();
				$new_font_arr['font_fallback'] = '';
				$new_font_arr['font-display']  = isset( $font_links['font-display'] ) ? $font_links['font-display'] : '';
				$new_font_arr['font-weight-0'] = '400';
				$new_font_arr['font_woff_2-0'] = isset( $font_links['font_woff_2'] ) ? $font_links['font_woff_2'] : '';
				$new_font_arr['font_woff-0']   = isset( $font_links['font_woff'] ) ? $font_links['font_woff'] : '';
				$new_font_arr['font_ttf-0']    = isset( $font_links['font_ttf'] ) ? $font_links['font_ttf'] : '';
				$new_font_arr['font_eot-0']    = isset( $font_links['font_eot'] ) ? $font_links['font_eot'] : '';
				$new_font_arr['font_svg-0']    = isset( $font_links['font_svg'] ) ? $font_links['font_svg'] : '';
				$new_font_arr['font_otf-0']    = isset( $font_links['font_otf'] ) ? $font_links['font_otf'] : '';

				Bsf_Custom_Fonts_Taxonomy::update_font_links( $new_font_arr, $term->term_id );
			}
		}
	}

	/**
	 * Hotfix update for handling following migration cases.
	 * 1. v1.3.7 <> v2.0.0 <> v2.0.1 <> v2.0.2
	 * 2. v1.3.7 <> v2.0.2
	 * 3. v2.0.0 <> v2.0.2 && v2.0.1 <> v2.0.2
	 *
	 * @since 2.0.2
	 */
	public function v_2_0_2() {
		$is_already_migrated_2_0_2 = get_option( 'bcf_custom_fonts_2_0_2_migration', false ); // Check if already migrated.

		// Halt if already migrated.
		if ( false !== $is_already_migrated_2_0_2 ) {
			return;
		}

		$tax_fonts               = Bsf_Custom_Fonts_Taxonomy::get_fonts(); // Get all fonts from taxonomy.
		$all_font_posts          = Bsf_Custom_Fonts_Render::get_instance()->get_existing_font_posts(); // Get all fonts from v2 post type posts.
		$is_already_migrated_2_0 = get_option( 'bcf_custom_fonts_2_0_migration', false ); // Migrated flag 2.0.
		$v2_0_migration_done     = ( ! empty( $all_font_posts ) && false !== $is_already_migrated_2_0 ) ? true : false;

		if ( ! empty( $tax_fonts ) ) {
			foreach ( $tax_fonts as $load_font_name => $load_font ) {
				if ( $v2_0_migration_done ) {
					// Fixing v1.3.7 <> v2.0.0 <> v2.0.2 migration case.
					foreach ( $all_font_posts as $font_post => $font_post_id ) {
						if ( get_the_title( $font_post_id ) === $load_font_name ) {
							$font_data = bcf_prepare_backward_font_data( $load_font_name );
							$font_face = bcf_get_font_face_css( $font_post_id, $font_data, true );

							update_post_meta( $font_post_id, 'fonts-data', $font_data );
							update_post_meta( $font_post_id, 'fonts-face', $font_face );
						} else {
							$font_metadata = get_post_meta( $font_post_id, 'fonts-data', true );
							$font_data     = bcf_make_font_url_meta_as_array( $font_metadata );
							$font_face     = bcf_get_font_face_css( $font_post_id, $font_data, true );

							update_post_meta( $font_post_id, 'fonts-data', $font_data );
							update_post_meta( $font_post_id, 'fonts-face', $font_face );
						}
					}
				} else {
					// Fixing v1.3.7 <> v2.0.2 migration case.
					$font_data = bcf_prepare_backward_font_data( $load_font_name );

					// Create post object.
					$new_font_post = array(
						'post_title'  => ! empty( $font_data['font_name'] ) ? $font_data['font_name'] : 'untitled',
						'post_status' => 'publish',
						'post_type'   => BSF_CUSTOM_FONTS_POST_TYPE,
					);

					// Insert the post into the database.
					$font_post_id = wp_insert_post( $new_font_post );

					if ( is_wp_error( $font_post_id ) ) {
						return;
					}

					$font_face = bcf_get_font_face_css( $font_post_id, $font_data, true );

					update_post_meta( $font_post_id, 'fonts-data', $font_data );
					update_post_meta( $font_post_id, 'fonts-face', $font_face );
					update_post_meta( $font_post_id, 'font-type', 'local' );
				}
			}
		}

		if ( ! empty( $all_font_posts ) && false === $is_already_migrated_2_0 ) {
			// Fixing v2.0.0 <> v2.0.2 migration case.
			foreach ( $all_font_posts as $font_post => $font_post_id ) {
				$font_metadata = get_post_meta( $font_post_id, 'fonts-data', true );
				$font_data     = bcf_make_font_url_meta_as_array( $font_metadata );
				$font_face     = bcf_get_font_face_css( $font_post_id, $font_data, true );

				update_post_meta( $font_post_id, 'fonts-data', $font_data );
				update_post_meta( $font_post_id, 'fonts-face', $font_face );
			}
		}

		update_option( 'bcf_custom_fonts_2_0_2_migration', true );
	}

	/**
	 * Check if db upgrade is required.
	 *
	 * @since 1.2.5
	 * @return true|false True if stored database version is lower than constant; false if otherwise.
	 */
	private function needs_db_update() {
		$db_version = get_option( $this->db_version_key, false );

		if ( false === $db_version || version_compare( $db_version, BSF_CUSTOM_FONTS_VER, '!=' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Update DB version.
	 *
	 * @since 1.2.5
	 * @return void
	 */
	private function update_db_version() {
		update_option( '_custom_fonts_db_version', BSF_CUSTOM_FONTS_VER );
	}
}

Custom_Fonts_Update::get_instance();
