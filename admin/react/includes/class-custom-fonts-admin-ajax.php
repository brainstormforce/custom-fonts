<?php
/**
 * Ajax class for font settings.
 *
 * @package     Bsf_Custom_Fonts
 * @since       x.x.x
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * AJAX events class to manage dashboard application requests.
 *
 * @since x.x.x
 */
class BSF_Custom_Fonts_Admin_Ajax {
	/**
	 * Instance
	 *
	 * @access private
	 * @var null $instance
	 * @since 4.0.0
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since 4.0.0
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Errors class instance.
	 *
	 * @var array
	 * @since 4.0.0
	 */
	private $errors = array();

	/**
	 * Constructor
	 *
	 * @since 4.0.0
	 */
	public function __construct() {
		$this->errors = array(
			'permission' => __( 'Sorry, you are not allowed to do this operation.', 'astra' ),
			'nonce'      => __( 'Nonce validation failed', 'astra' ),
			'default'    => __( 'Sorry, something went wrong.', 'astra' ),
			'invalid'    => __( 'No post data found!', 'astra' ),
		);

		$ajax_events = array(
			'bcf_add_new_local_font',
			'bcf_add_new_google_font',
			'bcf_delete_font',
			'bcf_edit_font',
		);

		foreach ( $ajax_events as $key => $event ) {
			add_action( 'wp_ajax_' . $event, array( $this, $event ) );
		}
	}

	/**
	 * Get ajax error message.
	 *
	 * @param string $type Message type.
	 * @return string
	 * @since 4.0.0
	 */
	public function get_error_msg( $type ) {

		if ( ! isset( $this->errors[ $type ] ) ) {
			$type = 'default';
		}

		return $this->errors[ $type ];
	}

	/**
	 * Create the local font post.
	 *
	 * @since x.x.x
	 */
	public function bcf_add_new_local_font() {

		$response_data = array( 'message' => $this->get_error_msg( 'permission' ) );

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( $response_data );
		}

		/**
		 * Nonce verification
		 */
		if ( ! check_ajax_referer( 'add_font_nonce', 'security', false ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'nonce' ) );
			wp_send_json_error( $response_data );
		}

		$font_data = isset( $_POST['font_data'] ) ? bcf_sanitize_text_field_recursive( json_decode( stripslashes( $_POST['font_data'] ), true ) ) : array();
		$font_variations = ! empty( $font_data['variations'] ) ? $font_data['variations'] : array();
		$font_type = ! empty( $_POST['font_type'] ) ? sanitize_text_field( $_POST['font_type'] ) : 'local';

		if ( empty( $font_variations ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'invalid' ) );
			wp_send_json_error( $response_data );
		}

		// Create post object.
		$new_font_post = array(
			'post_title'   => ! empty( $font_data['font_name'] ) ? $font_data['font_name'] : 'untitled',
			'post_status'  => 'publish',
			'post_type'    => BSF_CUSTOM_FONTS_POST_TYPE,
		);

		// Insert the post into the database.
		$font_post_id = wp_insert_post( $new_font_post );

		if ( is_wp_error( $font_post_id ) ) {
			$response_data = array( 'message' => $font_post_id->get_error_message() );
			wp_send_json_error( $response_data );
		}

		$font_face = bcf_get_font_face_css( $font_post_id, $font_data );

		update_post_meta( $font_post_id, 'fonts-data', $font_data );
		update_post_meta( $font_post_id, 'fonts-face', $font_face );
		update_post_meta( $font_post_id, 'font-type', $font_type );

		/**
		 * Send the response.
		 */
		$response_data = array(
			'message'      => __( 'Successfully created the Font!', 'custom-fonts' ),
		);
		wp_send_json_success( $response_data );
	}

	/**
	 * Create the Google font post.
	 *
	 * @since x.x.x
	 */
	public function bcf_add_new_google_font() {

		$response_data = array( 'message' => $this->get_error_msg( 'permission' ) );

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( $response_data );
		}

		/**
		 * Nonce verification
		 */
		if ( ! check_ajax_referer( 'add_font_nonce', 'security', false ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'nonce' ) );
			wp_send_json_error( $response_data );
		}

		$font_data = isset( $_POST['font_data'] ) ? bcf_sanitize_text_field_recursive( json_decode( stripslashes( $_POST['font_data'] ), true ) ) : array();
		$font_type = ! empty( $_POST['font_type'] ) ? sanitize_text_field( $_POST['font_type'] ) : 'local';

		if ( empty( $font_data ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'invalid' ) );
			wp_send_json_error( $response_data );
		}

		$font_face = bcf_google_fonts_compatibility()->save_google_fonts_to_theme( $font_data );

		// Create post object.
		$new_font_post = array(
			'post_title'   => ! empty( $font_data['font_name'] ) ? $font_data['font_name'] : 'untitled',
			'post_status'  => 'publish',
			'post_type'    => BSF_CUSTOM_FONTS_POST_TYPE,
		);

		// Insert the post into the database.
		$font_post_id = wp_insert_post( $new_font_post );

		if ( is_wp_error( $font_post_id ) ) {
			$response_data = array( 'message' => $font_post_id->get_error_message() );
			wp_send_json_error( $response_data );
		}

		update_post_meta( $font_post_id, 'fonts-data', $font_data );
		update_post_meta( $font_post_id, 'fonts-face', $font_face );
		update_post_meta( $font_post_id, 'font-type', $font_type );

		/**
		 * Send the response.
		 */
		$response_data = array(
			'message'      => __( 'Successfully created the Font!', 'custom-fonts' ),
		);
		wp_send_json_success( $response_data );
	}

	/**
	 * Edit the existing font post.
	 *
	 * @since x.x.x
	 */
	public function bcf_edit_font() {

		$response_data = array( 'message' => $this->get_error_msg( 'permission' ) );

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( $response_data );
		}

		/**
		 * Nonce verification
		 */
		if ( ! check_ajax_referer( 'edit_font_nonce', 'security', false ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'nonce' ) );
			wp_send_json_error( $response_data );
		}

		$font_data = isset( $_POST['font_data'] ) ? bcf_sanitize_text_field_recursive( json_decode( stripslashes( $_POST['font_data'] ), true ) ) : array();
		$font_variations = ! empty( $font_data['variations'] ) ? $font_data['variations'] : array();
		$font_type = ! empty( $_POST['font_type'] ) ? sanitize_text_field( $_POST['font_type'] ) : 'local';
		$font_id = ! empty( $_POST['font_id'] ) ? absint( $_POST['font_id'] ) : false;

		if ( empty( $font_variations ) || false === $font_id ) {
			$response_data = array( 'message' => $this->get_error_msg( 'invalid' ) );
			wp_send_json_error( $response_data );
		}

		$font_face = bcf_google_fonts_compatibility()->save_google_fonts_to_theme( $font_data );

		update_post_meta( $font_id, 'fonts-data', $font_data );
		update_post_meta( $font_id, 'fonts-face', $font_face );
		update_post_meta( $font_id, 'font-type', $font_type );

		/**
		 * Send the response.
		 */
		$response_data = array(
			'message'      => __( 'Successfully updated the Font!', 'custom-fonts' ),
		);
		wp_send_json_success( $response_data );
	}

	/**
	 * Delete the font post.
	 *
	 * @since x.x.x
	 */
	public function bcf_delete_font() {
		$response_data = array( 'message' => $this->get_error_msg( 'permission' ) );

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			wp_send_json_error( $response_data );
		}

		/**
		 * Nonce verification
		 */
		if ( ! check_ajax_referer( 'delete_font_nonce', 'security', false ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'nonce' ) );
			wp_send_json_error( $response_data );
		}

		$font_id = isset( $_POST['font_id'] ) ? absint( $_POST['font_id'] ) : 0;

		if ( ! $font_id ) {
			$response_data = array( 'message' => $this->get_error_msg( 'invalid' ) );
			wp_send_json_error( $response_data );
		}

		$delete_post_response = wp_delete_post( $font_id );

		if ( ! is_object( $delete_post_response ) ) {
			$response_data = array( 'message' => $this->get_error_msg( 'invalid' ) );
			wp_send_json_error( $response_data );
		}

		$response_data = array(
			'message'      => __( 'Successfully deleted the Font!', 'custom-fonts' ),
		);
		wp_send_json_success( $response_data );
	}
}

BSF_Custom_Fonts_Admin_Ajax::get_instance();
