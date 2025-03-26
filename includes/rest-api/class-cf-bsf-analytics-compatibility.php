<?php
/**
 * BSF analytics compatibility class file.
 *
 * @version 2.1.12
 *
 * @package bsf-analytics
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'CF_BSF_Analytics_Compatibility' ) ) {

	/**
	 * BSF analytics
	 *
	 * @since 2.1.12
	 */
	class CF_BSF_Analytics_Compatibility {

		/**
		 * Setup actions, load files.
		 *
		 * @since 2.1.12
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'bsf_register_rest_settings' ) );
		}

		/**
		 * Check if tracking is enabled.
		 *
		 * @return WP_REST_Response REST response with tracking status.
		 * @since 2.1.12
		 */
		public function is_tracking_enabled() {
			$is_tracking_enabled = get_site_option( 'bsf_analytics_optin' ) === 'yes' ? true : false;
			$is_tracking_enabled = $this->is_white_label_enabled() ? false : $is_tracking_enabled;
			$is_tracking_enabled = apply_filters( 'bsf_tracking_enabled', $is_tracking_enabled );

			return new WP_REST_Response(
				array(
					'success'        => true,
					'status'         => $is_tracking_enabled,
					'is_multisite'   => is_multisite(),
					'is_white_label' => $this->is_white_label_enabled(),
					'usage_doc_link' => 'https://store.brainstormforce.com/usage-tracking/?utm_source=wp_dashboard&utm_medium=general_settings&utm_campaign=usage_tracking',
				),
				200
			);
		}

		/**
		 * Check if WHITE label is enabled for BSF products.
		 *
		 * @return bool True if enabled, false otherwise.
		 * @since 2.1.12
		 */
		public function is_white_label_enabled() {
			$options    = apply_filters( 'bsf_white_label_options', array() );
			$is_enabled = false;

			if ( is_array( $options ) ) {
				foreach ( $options as $option ) {
					if ( true === $option ) {
						$is_enabled = true;
						break;
					}
				}
			}

			return $is_enabled;
		}

		/**
		 * Register REST API for tracking status.
		 *
		 * @since 2.1.12
		 */
		public function bsf_register_rest_settings() {
			register_rest_route(
				'custom-fonts/v1',
				'/get-tracking-status',
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'is_tracking_enabled' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);

			register_rest_route(
				'custom-fonts/v1',
				'/update-tracking-status',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'update_tracking_status' ),
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
				)
			);
		}

		/**
		 * Updating tracking status.
		 *
		 * @param WP_REST_Request $request Request object.
		 * @return WP_REST_Response REST response indicating success or failure.
		 * @since 2.1.12
		 */
		public function update_tracking_status( WP_REST_Request $request ) {
			// Verifying the white label status.
			if ( $this->is_white_label_enabled() ) {
				return new WP_REST_Response(
					array(
						'success'        => false,
						'message'        => __( 'Tracking disabled by white label settings', 'custom-fonts' ),
						'is_multisite'   => is_multisite(),
						'is_white_label' => true,
					),
					403
				);
			}

			$params       = $request->get_params();
			$optin_status = isset( $params['status'] ) ? ( $params['status'] ? 'yes' : 'no' ) : 'no';
			$option_name  = 'bsf_analytics_optin';
			update_site_option( $option_name, $optin_status );

			return new WP_REST_Response(
				array(
					'success'      => true,
					'message'      => __( 'Tracking status updated successfully.', 'custom-fonts' ),
					'is_multisite' => is_multisite(),
					'new_status'   => $optin_status,
				),
				200
			);
		}

	}

	new CF_BSF_Analytics_Compatibility();
}
