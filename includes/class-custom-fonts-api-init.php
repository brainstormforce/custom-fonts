<?php
/**
 * Class Custom_Fonts_API.
 *
 * @package BSF_Custom_Fonts
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Bail if WP_REST_Controller class does not exist.
if ( ! class_exists( 'WP_REST_Controller' ) ) {
	return;
}

/**
 * Custom_Fonts_API.
 *
 * @since x.x.x
 */
class Custom_Fonts_API extends WP_REST_Controller {

	/**
	 * Instance
	 *
	 * @access private
	 * @var null $instance
	 * @since x.x.x
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since x.x.x
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'bsf-custom-fonts/v1';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $rest_base = '/admin/settings/';

	/**
	 * Option name
	 *
	 * @access private
	 * @var string $option_name DB option name.
	 * @since x.x.x
	 */
	private static $option_name = 'bsf_custom_fonts_settings';

	/**
	 * Admin settings dataset
	 *
	 * @access private
	 * @var array $bsf_custom_fonts_settings Settings array.
	 * @since x.x.x
	 */
	private static $bsf_custom_fonts_settings = array();

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {
		self::$bsf_custom_fonts_settings = get_option( self::$option_name, array() );
		// REST API extensions init.
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register API routes.
	 *
	 * @since x.x.x
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			$this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_admin_settings' ),
					'permission_callback' => array( $this, 'get_permissions_check' ),
					'args'                => array(),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Get common settings.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return array $updated_option defaults + set DB option data.
	 *
	 * @since x.x.x
	 */
	public function get_admin_settings( $request ) {
		$db_option = get_option( 'bsf_custom_fonts_settings', array() );

		$defaults = apply_filters(
			'bsf_custom_fonts_dashboard_rest_options',
			array(
				'self_hosted_gfonts'    => self::get_admin_settings_option( 'self_hosted_gfonts', false ),
			)
		);

		$updated_option = wp_parse_args( $db_option, $defaults );
		return $updated_option;
	}

	/**
	 * Check whether a given request has permission to read notes.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return WP_Error|boolean
	 * @since x.x.x
	 */
	public function get_permissions_check( $request ) {

		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return new WP_Error( 'bsf_custom_fonts_rest_cannot_view', __( 'Sorry, you cannot list resources.', 'custom-fonts' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	/**
	 * Returns an value,
	 * based on the settings database option for the admin settings page.
	 *
	 * @param  string $key     The sub-option key.
	 * @param  mixed  $default Option default value if option is not available.
	 * @return mixed            Return the option value based on provided key
	 * @since x.x.x
	 */
	public static function get_admin_settings_option( $key, $default = false ) {
		$value = isset( self::$bsf_custom_fonts_settings[ $key ] ) ? self::$bsf_custom_fonts_settings[ $key ] : $default;
		return $value;
	}

	/**
	 * Update an value of a key,
	 * from the settings database option for the admin settings page.
	 *
	 * @param string $key       The option key.
	 * @param mixed  $value     The value to update.
	 * @return mixed            Return the option value based on provided key
	 * @since x.x.x
	 */
	public static function update_admin_settings_option( $key, $value ) {
		$admin_updated_settings         = get_option( self::$option_name, array() );
		$admin_updated_settings[ $key ] = $value;
		update_option( self::$option_name, $admin_updated_settings );
	}
}

Custom_Fonts_API::get_instance();
