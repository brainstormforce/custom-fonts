<?php
/**
 * BSF analytics class file.
 *
 * @version 1.0.0
 *
 * @package bsf-analytics
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'BSF_Analytics' ) ) {

	/**
	 * BSF analytics
	 */
	class BSF_Analytics {

		/**
		 * Member Variable
		 *
		 * @var array Entities data.
		 */
		private $entities;

		/**
		 * Member Variable
		 *
		 * @var string Usage tracking document URL
		 */
		public $usage_doc_link = 'https://store.brainstormforce.com/usage-tracking/?utm_source=wp_dashboard&utm_medium=general_settings&utm_campaign=usage_tracking';

		/**
		 * Setup actions, load files.
		 *
		 * @param array  $args entity data for analytics.
		 * @param string $analytics_path directory path to analytics library.
		 * @param float  $analytics_version analytics library version.
		 * @since 1.0.0
		 */
		public function __construct( $args, $analytics_path, $analytics_version ) {

			// Bail when no analytics entities are registered.
			if ( empty( $args ) ) {
				return;
			}

			$this->entities = $args;

			define( 'BSF_ANALYTICS_VERSION', $analytics_version );
			define( 'BSF_ANALYTICS_URI', $this->get_analytics_url( $analytics_path ) );

			add_action( 'admin_init', array( $this, 'handle_optin_optout' ) );
			add_action( 'admin_notices', array( $this, 'option_notice' ) );
			add_action( 'init', array( $this, 'maybe_track_analytics' ), 99 );

			$this->set_actions();

			add_action( 'rest_api_init', array( $this, 'bcf_register_rest_settings' ) );

			$this->includes();
		}

		/**
		 * Setup actions for admin notice style and analytics cron event.
		 *
		 * @since 1.0.4
		 */
		public function set_actions() {

			foreach ( $this->entities as $key => $data ) {
				add_action( 'astra_notice_before_markup_' . $key . '-optin-notice', array( $this, 'enqueue_assets' ) );
				add_action( 'update_option_' . $key . '_analytics_optin', array( $this, 'update_analytics_option_callback' ), 10, 3 );
				add_action( 'add_option_' . $key . '_analytics_optin', array( $this, 'add_analytics_option_callback' ), 10, 2 );
			}
		}

		/**
		 * BSF Analytics URL
		 *
		 * @param string $analytics_path directory path to analytics library.
		 * @return String URL of bsf-analytics directory.
		 * @since 1.0.0
		 */
		public function get_analytics_url( $analytics_path ) {

			$content_dir_path = wp_normalize_path( WP_CONTENT_DIR );

			$analytics_path = wp_normalize_path( $analytics_path );

			return str_replace( $content_dir_path, content_url(), $analytics_path );
		}

		/**
		 * Get API URL for sending analytics.
		 *
		 * @return string API URL.
		 * @since 1.0.0
		 */
		private function get_api_url() {
			return defined( 'BSF_API_URL' ) ? BSF_API_URL : 'https://support.brainstormforce.com/';
		}

		/**
		 * Enqueue Scripts.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function enqueue_assets() {

			/**
			 * Load unminified if SCRIPT_DEBUG is true.
			 *
			 * Directory and Extensions.
			 */
			$dir_name = ( SCRIPT_DEBUG ) ? 'unminified' : 'minified';
			$file_rtl = ( is_rtl() ) ? '-rtl' : '';
			$css_ext  = ( SCRIPT_DEBUG ) ? '.css' : '.min.css';

			$css_uri = BSF_ANALYTICS_URI . '/assets/css/' . $dir_name . '/style' . $file_rtl . $css_ext;

			wp_enqueue_style( 'bsf-analytics-admin-style', $css_uri, false, BSF_ANALYTICS_VERSION, 'all' );
		}

		/**
		 * Send analytics API call.
		 *
		 * @since 1.0.0
		 */
		public function send() {
			wp_remote_post(
				$this->get_api_url() . 'wp-json/bsf-core/v1/analytics/',
				array(
					'body'     => BSF_Analytics_Stats::instance()->get_stats(),
					'timeout'  => 5,
					'blocking' => false,
				)
			);
		}

		/**
		 * Check if usage tracking is enabled.
		 *
		 * @return bool
		 * @since 1.0.0
		 */
		public function is_tracking_enabled() {

			foreach ( $this->entities as $key => $data ) {

				$is_enabled = get_site_option( $key . '_analytics_optin' ) === 'yes' ? true : false;
				$is_enabled = $this->is_white_label_enabled( $key ) ? false : $is_enabled;

				if ( apply_filters( $key . '_tracking_enabled', $is_enabled ) ) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Check if WHITE label is enabled for BSF products.
		 *
		 * @param string $source source of analytics.
		 * @return bool
		 * @since 1.0.0
		 */
		public function is_white_label_enabled( $source ) {

			$options    = apply_filters( $source . '_white_label_options', array() );
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
		 * Display admin notice for usage tracking.
		 *
		 * @since 1.0.0
		 */
		public function option_notice() {

			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			foreach ( $this->entities as $key => $data ) {

				$time_to_display = isset( $data['time_to_display'] ) ? $data['time_to_display'] : '+24 hours';
				$usage_doc_link  = isset( $data['usage_doc_link'] ) ? $data['usage_doc_link'] : $this->usage_doc_link;

				// Don't display the notice if tracking is disabled or White Label is enabled for any of our plugins.
				if ( false !== get_site_option( $key . '_analytics_optin', false ) || $this->is_white_label_enabled( $key ) ) {
					continue;
				}

				// Show tracker consent notice after 24 hours from installed time.
				if ( strtotime( $time_to_display, $this->get_analytics_install_time( $key ) ) > time() ) {
					continue;
				}

				/* translators: %s product name */
				$notice_string = __( 'Want to help make <strong>%1s</strong> even more awesome? Allow us to collect non-sensitive diagnostic data and usage information. ', 'custom-fonts' );

				if ( is_multisite() ) {
					$notice_string .= __( 'This will be applicable for all sites from the network.', 'custom-fonts' );
				}

				$language_dir = is_rtl() ? 'rtl' : 'ltr';

				Astra_Notices::add_notice(
					array(
						'id'                         => $key . '-optin-notice',
						'type'                       => '',
						'message'                    => sprintf(
							'<div class="notice-content">
									<div class="notice-heading">
										%1$s
									</div>
									<div class="astra-notices-container">
										<a href="%2$s" class="astra-notices button-primary">
										%3$s
										</a>
										<a href="%4$s" data-repeat-notice-after="%5$s" class="astra-notices button-secondary">
										%6$s
										</a>
									</div>
								</div>',
							/* translators: %s usage doc link */
							sprintf( $notice_string . '<span dir="%2s"><a href="%3s" target="_blank" rel="noreferrer noopener">%4s</a><span>', esc_html( $data['product_name'] ), $language_dir, esc_url( $usage_doc_link ), __( ' Know More.', 'custom-fonts' ) ),
							add_query_arg(
								array(
									$key . '_analytics_optin' => 'yes',
									$key . '_analytics_nonce' => wp_create_nonce( $key . '_analytics_optin' ),
									'bsf_analytics_source' => $key,
								)
							),
							__( 'Yes! Allow it', 'custom-fonts' ),
							add_query_arg(
								array(
									$key . '_analytics_optin' => 'no',
									$key . '_analytics_nonce' => wp_create_nonce( $key . '_analytics_optin' ),
									'bsf_analytics_source' => $key,
								)
							),
							MONTH_IN_SECONDS,
							__( 'No Thanks', 'custom-fonts' )
						),
						'show_if'                    => true,
						'repeat-notice-after'        => false,
						'priority'                   => 18,
						'display-with-other-notices' => true,
					)
				);
			}
		}

		/**
		 * Process usage tracking opt out.
		 *
		 * @since 1.0.0
		 */
		public function handle_optin_optout() {

			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			$source = isset( $_GET['bsf_analytics_source'] ) ? sanitize_text_field( wp_unslash( $_GET['bsf_analytics_source'] ) ) : '';

			if ( ! isset( $_GET[ $source . '_analytics_nonce' ] ) ) {
				return;
			}

			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET[ $source . '_analytics_nonce' ] ) ), $source . '_analytics_optin' ) ) {
				return;
			}

			$optin_status = isset( $_GET[ $source . '_analytics_optin' ] ) ? sanitize_text_field( wp_unslash( $_GET[ $source . '_analytics_optin' ] ) ) : '';

			if ( 'yes' === $optin_status ) {
				$this->optin( $source );
			} elseif ( 'no' === $optin_status ) {
				$this->optout( $source );
			}

			wp_safe_redirect(
				remove_query_arg(
					array(
						$source . '_analytics_optin',
						$source . '_analytics_nonce',
						'bsf_analytics_source',
					)
				)
			);
		}

		/**
		 * Opt in to usage tracking.
		 *
		 * @param string $source source of analytics.
		 * @since 1.0.0
		 */
		private function optin( $source ) {
			update_site_option( $source . '_analytics_optin', 'yes' );
		}

		/**
		 * Opt out to usage tracking.
		 *
		 * @param string $source source of analytics.
		 * @since 1.0.0
		 */
		private function optout( $source ) {
			update_site_option( $source . '_analytics_optin', 'no' );
		}

		/**
		 * Load analytics stat class.
		 *
		 * @since 1.0.0
		 */
		private function includes() {
			require_once __DIR__ . '/class-bsf-analytics-stats.php';
		}


		/**
		 * Register REST API for tracking status.
		 *
		 * @since x.x.x
		 */
		public function bcf_register_rest_settings() {
			register_rest_route(
				'custom-fonts/v1',
				'/get-tracking-status',
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_tracking_status' ),
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
		 * Get current tracking status.
		 *
		 * @since x.x.x
		 */
		public function get_tracking_status() {
			$option_name = 'bsf_analytics_optin';
			$key         = 'bsf_analytics';

			// Collecting entity data.
			$entity_data = $this->entities[ $key ] ?? array();

			// Added check if tracking is allowed or not.
			if ( $this->is_white_label_enabled( $key ) ||
				! apply_filters( $key . '_tracking_enabled', true ) ) {
				return new WP_REST_Response(
					array(
						'status'         => 'disabled',
						'value'          => 'no',
						'author'         => $entity_data['author'] ?? 'Brainstorm Force',
						'usage_doc_link' => $entity_data['usage_doc_link'] ?? $this->usage_doc_link,
					),
					200
				);
			}

			return new WP_REST_Response(
				array(
					'status'         => 'active',
					'value'          => get_site_option( $option_name, 'no' ),
					'is_multisite'   => is_multisite(),
					'author'         => $entity_data['author'] ?? 'Brainstorm Force',
					'usage_doc_link' => $entity_data['usage_doc_link'] ?? $this->usage_doc_link,
				),
				200
			);
		}

		/**
		 * Updateing tracking status.
		 *
		 * @since x.x.x
		 */
		public function update_tracking_status( WP_REST_Request $request ) {
			$params = $request->get_params();
			$status = isset( $params['status'] ) ? ( $params['status'] ? 'yes' : 'no' ) : 'no';

			// Verifying the white label status.
			if ( $this->is_white_label_enabled( 'bsf_analytics' ) ) {
				return new WP_REST_Response(
					array(
						'success'        => false,
						'message'        => __( 'Tracking disabled by white label settings', 'custom-fonts' ),
						'is_white_label' => true,
					),
					403
				);
			}

			// Verifying tracking filter.
			if ( ! apply_filters( 'bsf_analytics_tracking_enabled', true ) ) {
				return new WP_REST_Response(
					array(
						'success'            => false,
						'message'            => __( 'Tracking disabled by filter', 'custom-fonts' ),
						'is_filter_disabled' => true,
					),
					403
				);
			}

			$option_name = 'bsf_analytics_optin';
			update_site_option( $option_name, $status );

			return new WP_REST_Response(
				array(
					'success'      => true,
					'message'      => __( 'Tracking status updated successfully.', 'custom-fonts' ),
					'is_multisite' => is_multisite(),
					'new_status'   => $status,
				),
				200
			);
		}

		/**
		 * Set analytics installed time in option.
		 *
		 * @param string $source source of analytics.
		 * @return string $time analytics installed time.
		 * @since 1.0.0
		 */
		private function get_analytics_install_time( $source ) {

			$time = get_site_option( $source . '_analytics_installed_time' );

			if ( ! $time ) {
				$time = time();
				update_site_option( $source . '_analytics_installed_time', time() );
			}

			return $time;
		}

		/**
		 * Schedule/unschedule cron event on updation of option.
		 *
		 * @param string $old_value old value of option.
		 * @param string $value value of option.
		 * @param string $option Option name.
		 * @since 1.0.0
		 */
		public function update_analytics_option_callback( $old_value, $value, $option ) {
			if ( is_multisite() ) {
				$this->add_option_to_network( $option, $value );
			}
		}

		/**
		 * Analytics option add callback.
		 *
		 * @param string $option Option name.
		 * @param string $value value of option.
		 * @since 1.0.0
		 */
		public function add_analytics_option_callback( $option, $value ) {
			if ( is_multisite() ) {
				$this->add_option_to_network( $option, $value );
			}
		}

		/**
		 * Send analaytics track event if tracking is enabled.
		 *
		 * @since 1.0.0
		 */
		public function maybe_track_analytics() {

			if ( ! $this->is_tracking_enabled() ) {
				return;
			}

			$analytics_track = get_site_transient( 'bsf_analytics_track' );

			// If the last data sent is 2 days old i.e. transient is expired.
			if ( ! $analytics_track ) {
				$this->send();
				set_site_transient( 'bsf_analytics_track', true, 2 * DAY_IN_SECONDS );
			}
		}

		/**
		 * Save analytics option to network.
		 *
		 * @param string $option name of option.
		 * @param string $value value of option.
		 * @since 1.0.0
		 */
		public function add_option_to_network( $option, $value ) {

			// If action coming from general settings page.
			if ( isset( $_POST['option_page'] ) && 'general' === $_POST['option_page'] ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing

				if ( get_site_option( $option ) ) {
					update_site_option( $option, $value );
				} else {
					add_site_option( $option, $value );
				}
			}
		}
	}
}
