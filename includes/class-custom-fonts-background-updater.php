<?php
/**
 * Custom Fonts Background Updater
 *
 * @package Custom_Fonts
 * @since   2.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Custom_Fonts_Background_Updater' ) ) {

	/**
	 * Custom_Fonts_Background_Updater Class.
	 */
	class Custom_Fonts_Background_Updater {

		/**
		 * Background update class.
		 *
		 * @var object
		 */
		private static $background_updater;

		/**
		 * DB updates and callbacks that need to be run per version.
		 *
		 * @var array
		 */
		private static $db_updates = array(
			'2.1.16' => array(
				'custom_fonts_background_updater_2_1_16',
			),
			'2.2.0'  => array(
				'custom_fonts_background_updater_2_2_0',
			),
			'2.2.1'  => array(
				'custom_fonts_background_updater_2_2_1',
			),
		);

		/**
		 * Option key for stored version number.
		 *
		 * @var string
		 */
		private $db_version_key = 'custom_fonts_db_version';

		/**
		 * Option key for plugin settings.
		 *
		 * @var string
		 */
		private $settings_key = 'custom_fonts_settings';

		/**
		 * Constructor
		 */
		public function __construct() {
			// Plugin Updates.
			if ( is_admin() ) {
				add_action( 'admin_init', array( $this, 'install_actions' ) );
			} else {
				add_action( 'wp', array( $this, 'install_actions' ) );
			}

			// Include background processing library if not available.
			$this->include_background_processing();

			// Initialize background updater.
			if ( class_exists( 'Custom_Fonts_Theme_Background_Process' ) ) {
				self::$background_updater = new Custom_Fonts_Theme_Background_Process();
			}
		}

		/**
		 * Include background processing library.
		 */
		private function include_background_processing() {
			if ( ! class_exists( 'Custom_Fonts_WP_Async_Request' ) ) {
				require_once BSF_CUSTOM_FONTS_DIR . 'includes/lib/batch-processing/class-custom-fonts-wp-async-request.php';
			}
			if ( ! class_exists( 'Custom_Fonts_WP_Background_Process' ) ) {
				require_once BSF_CUSTOM_FONTS_DIR . 'includes/lib/batch-processing/class-custom-fonts-wp-background-process.php';
			}
			if ( ! class_exists( 'Custom_Fonts_Theme_Background_Process' ) ) {
				require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-custom-fonts-wp-background-process.php';
			}
		}

		/**
		 * Check Cron Status
		 *
		 * @since 2.2.0
		 * @return bool true if there is a problem spawning a call to WP-Cron system, else false.
		 */
		public function test_cron() {
			if ( defined( 'DISABLE_WP_CRON' ) && DISABLE_WP_CRON ) {
				return true;
			}

			if ( defined( 'ALTERNATE_WP_CRON' ) && ALTERNATE_WP_CRON ) {
				return true;
			}

			$cached_status = get_transient( 'custom-fonts-cron-test-ok' );

			if ( $cached_status ) {
				return false;
			}

			$doing_wp_cron = sprintf( '%.22F', microtime( true ) );

			$cron_request = apply_filters(
				'cron_request',
				array(
					'url'  => site_url( 'wp-cron.php?doing_wp_cron=' . $doing_wp_cron ),
					'args' => array(
						'timeout'   => 3,
						'blocking'  => true,
						'sslverify' => apply_filters( 'https_local_ssl_verify', false ),
					),
				)
			);

			$result = wp_remote_post( $cron_request['url'], $cron_request['args'] );

			if ( wp_remote_retrieve_response_code( $result ) >= 300 ) {
				return true;
			}

			set_transient( 'custom-fonts-cron-test-ok', 1, 3600 );
			return false;
		}

		/**
		 * Install actions when a update button is clicked within the admin area.
		 */
		public function install_actions() {
			do_action( 'custom_fonts_update_initiated', self::$background_updater );

			if ( true === $this->is_new_install() ) {
				self::update_db_version();
				return;
			}

			$fallback         = $this->test_cron();
			$db_migrated      = $this->check_if_data_migrated();
			$is_queue_running = $this->get_option( 'is_fonts_queue_running', false );

			$fallback = $db_migrated ? $db_migrated : $fallback;

			if ( $this->needs_db_update() && ! $is_queue_running ) {
				$this->update( $fallback );
			} else {
				if ( ! $is_queue_running ) {
					self::update_db_version();
				}
			}
		}

		/**
		 * Is this a brand new plugin install?
		 *
		 * @since 2.2.0
		 * @return bool
		 */
		public function is_new_install() {
			$saved_version = get_option( $this->db_version_key, false );

			if ( false === $saved_version ) {
				return true;
			}

			return false;
		}

		/**
		 * Is a DB update needed?
		 *
		 * @since 2.2.0
		 * @return bool
		 */
		private function needs_db_update() {
			$current_plugin_version = get_option( $this->db_version_key, null );
			$updates                = $this->get_db_update_callbacks();

			if ( empty( $updates ) ) {
				return false;
			}

			$versions = array_keys( $updates );
			$latest   = $versions[ count( $versions ) - 1 ];

			return ! is_null( $current_plugin_version ) && version_compare( $current_plugin_version, $latest, '<' );
		}

		/**
		 * Get list of DB update callbacks.
		 *
		 * @since 2.2.0
		 * @return array
		 */
		public function get_db_update_callbacks() {
			return self::$db_updates;
		}

		/**
		 * Check if database is migrated
		 *
		 * @since 2.2.0
		 * @return bool If the database migration should not be run through CRON.
		 */
		public function check_if_data_migrated() {
			$fallback = false;

			$is_db_version_updated = $this->is_db_version_updated();

			if ( ! $is_db_version_updated ) {
				$db_migrated = get_transient( 'custom-fonts-db-migrated' );

				if ( ! $db_migrated ) {
					$db_migrated = array();
				}

				array_push( $db_migrated, $is_db_version_updated );
				set_transient( 'custom-fonts-db-migrated', $db_migrated, 3600 );

				$db_migrate_count = count( $db_migrated );
				if ( $db_migrate_count >= 5 ) {
					$this->delete_option( 'is_fonts_queue_running' );
					$fallback = true;
				}
			}
			return $fallback;
		}

		/**
		 * Checks if custom fonts plugin version is updated in the database
		 *
		 * @since 2.2.0
		 * @return bool If plugin version is updated.
		 */
		public function is_db_version_updated() {
			$saved_version = get_option( $this->db_version_key, false );
			return version_compare( $saved_version, BSF_CUSTOM_FONTS_VER, '=' );
		}

		/**
		 * Push all needed DB updates to the queue for processing.
		 *
		 * @param bool $fallback Fallback migration.
		 * @return void
		 */
		private function update( $fallback ) {
			$current_db_version = get_option( $this->db_version_key );

			if ( count( $this->get_db_update_callbacks() ) > 0 ) {
				foreach ( $this->get_db_update_callbacks() as $version => $update_callbacks ) {
					if ( version_compare( $current_db_version, $version, '<' ) ) {
						foreach ( $update_callbacks as $update_callback ) {
							if ( $fallback ) {
								call_user_func( $update_callback );
							} else {
								if ( self::$background_updater ) {
									self::$background_updater->push_to_queue( $update_callback );
								}
							}
						}
					}
				}

				if ( $fallback ) {
					self::update_db_version();
				} else {
					$this->update_option( 'is_fonts_queue_running', true );
					if ( self::$background_updater ) {
						self::$background_updater->push_to_queue( 'update_db_version' );
					}
				}
			} else {
				if ( self::$background_updater ) {
					self::$background_updater->push_to_queue( 'update_db_version' );
				}
			}

			if ( self::$background_updater ) {
				self::$background_updater->save()->dispatch();
			}
		}

		/**
		 * Update DB version to current.
		 *
		 * @param string|null $version New Custom Fonts plugin version or null.
		 */
		public static function update_db_version( $version = null ) {
			do_action( 'custom_fonts_update_before' );

			$saved_version = get_option( 'custom_fonts_db_version', false );

			if ( false === $saved_version ) {
				$saved_version = BSF_CUSTOM_FONTS_VER;
				update_option( 'custom_fonts_db_version', BSF_CUSTOM_FONTS_VER );
			}

			// If equals then return.
			if ( version_compare( $saved_version, BSF_CUSTOM_FONTS_VER, '=' ) ) {
				$instance = new self();
				$instance->update_option( 'is_fonts_queue_running', false );
				return;
			}

			// Not have stored?
			if ( empty( $saved_version ) ) {
				// Get old version.
				$plugin_version = get_option( '_custom_fonts_db_version', BSF_CUSTOM_FONTS_VER );
				// Remove old option.
				delete_option( '_custom_fonts_db_version' );
			} else {
				// Get latest version.
				$plugin_version = BSF_CUSTOM_FONTS_VER;
			}

			// Update version number.
			update_option( 'custom_fonts_db_version', $plugin_version );

			$instance = new self();
			$instance->update_option( 'is_fonts_queue_running', false );

			delete_transient( 'custom-fonts-db-migrated' );

			do_action( 'custom_fonts_update_after' );
		}

		/**
		 * Get plugin option.
		 *
		 * @param string $key     Option key.
		 * @param mixed  $default Default value.
		 * @return mixed
		 */
		public function get_option( $key, $default = false ) {
			$settings = get_option( $this->settings_key, array() );
			return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
		}

		/**
		 * Update plugin option.
		 *
		 * @param string $key   Option key.
		 * @param mixed  $value Option value.
		 */
		public function update_option( $key, $value ) {
			$settings         = get_option( $this->settings_key, array() );
			$settings[ $key ] = $value;
			update_option( $this->settings_key, $settings );
		}

		/**
		 * Delete plugin option.
		 *
		 * @param string $key Option key.
		 */
		public function delete_option( $key ) {
			$settings = get_option( $this->settings_key, array() );
			if ( isset( $settings[ $key ] ) ) {
				unset( $settings[ $key ] );
				update_option( $this->settings_key, $settings );
			}
		}
	}
}