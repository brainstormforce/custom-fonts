<?php
/**
 * Class Bsf_Custom_Fonts_Menu.
 *
 * @package Bsf_Custom_Fonts
 * @since x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bsf_Custom_Fonts_Menu.
 *
 * @since x.x.x
 */
class Bsf_Custom_Fonts_Menu {

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
	 * Plugin slug
	 *
	 * @since x.x.x
	 * @var string $plugin_slug
	 */
	public static $plugin_slug = 'bsf-custom-fonts';

	/**
	 * Parent Menu Slug
	 *
	 * @since  1.0.0
	 * @var (string) $parent_menu_slug
	 */
	protected $parent_menu_slug = 'themes.php';

	/**
	 * Constructor
	 *
	 * @since x.x.x
	 */
	public function __construct() {
		$this->initialize_hooks();
	}

	/**
	 * Init Hooks.
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function initialize_hooks() {

		add_action( 'admin_menu', array( $this, 'register_custom_fonts_menu' ) );
		add_action( 'admin_init', array( $this, 'settings_admin_scripts' ) );

		add_filter( 'upload_mimes', array( $this, 'add_fonts_to_allowed_mimes' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'update_mime_types' ), 10, 3 );

		add_action( 'after_setup_theme', array( $this, 'init_admin_settings' ), 99 );
	}

	/**
	 * Register custom font menu
	 *
	 * @since 1.0.0
	 */
	public function register_custom_fonts_menu() {
		$title = apply_filters( 'bsf_custom_fonts_menu_title', __( 'Custom Fonts', 'custom-fonts' ) );
		add_theme_page(
			$title,
			$title,
			'edit_theme_options',
			self::$plugin_slug,
			array( $this, 'render_admin_dashboard' )
		);
	}

	/**
	 * Allowed mime types and file extensions
	 *
	 * @since 1.0.0
	 * @param array $mimes Current array of mime types.
	 * @return array $mimes Updated array of mime types.
	 */
	public function add_fonts_to_allowed_mimes( $mimes ) {
		$mimes['woff']  = 'application/x-font-woff';
		$mimes['woff2'] = 'application/x-font-woff2';
		$mimes['ttf']   = 'application/x-font-ttf';
		$mimes['svg']   = 'image/svg+xml';
		$mimes['eot']   = 'application/vnd.ms-fontobject';
		$mimes['otf']   = 'font/otf';

		return $mimes;
	}

	/**
	 * Correct the mime types and extension for the font types.
	 *
	 * @param array  $defaults File data array containing 'ext', 'type', and
	 *                                          'proper_filename' keys.
	 * @param string $file                      Full path to the file.
	 * @param string $filename                  The name of the file (may differ from $file due to
	 *                                          $file being in a tmp directory).
	 * @return Array File data array containing 'ext', 'type', and
	 */
	public function update_mime_types( $defaults, $file, $filename ) {
		if ( 'ttf' === pathinfo( $filename, PATHINFO_EXTENSION ) ) {
			$defaults['type'] = 'application/x-font-ttf';
			$defaults['ext']  = 'ttf';
		}

		if ( 'otf' === pathinfo( $filename, PATHINFO_EXTENSION ) ) {
			$defaults['type'] = 'application/x-font-otf';
			$defaults['ext']  = 'otf';
		}

		return $defaults;
	}

	/**
	 * Admin settings init.
	 *
	 * @since x.x.x
	 */
	public function init_admin_settings() {
		if ( ! is_customize_preview() ) {
		}
	}

	/**
	 *  Initialize after Astra gets loaded.
	 *
	 * @since x.x.x
	 */
	public function settings_admin_scripts() {
		if ( $this->is_custom_fonts_screen() ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'styles_scripts' ) );
			add_filter( 'admin_footer_text', array( $this, 'bsf_custom_fonts_admin_footer_link' ), 99 );
		}
	}

	/**
	 * Check BSF Custom Fonts plugin screen.
	 *
	 * @return bool true|false after checking plugins page.
	 * @since x.x.x
	 */
	public function is_custom_fonts_screen() {
		if ( isset( $_GET['page'] ) && self::$plugin_slug === sanitize_text_field( $_GET['page'] ) ) { //phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return true;
		}
		return false;
	}

	/**
	 * Renders the admin settings.
	 *
	 * @since x.x.x
	 * @return void
	 */
	public function render_admin_dashboard() {
		?>
			<div class="bsf-cf-menu-page-wrapper">
				<div id="bsf-cf-menu-page">
					<div class="bsf-cf-menu-page-content">
						<div id="bsf-custom-font-dashboard-app" class="bsf-custom-font-dashboard-app"> </div>
					</div>
				</div>
			</div>
		<?php
	}

	/**
	 * Enqueues the needed CSS/JS for the builder's admin settings page.
	 *
	 * @since x.x.x
	 */
	public function styles_scripts() {

		if ( is_customize_preview() ) {
			return;
		}

		wp_enqueue_style( 'bsf-custom-fonts-admin-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap', array(), BSF_CUSTOM_FONTS_VER ); // Styles.

		wp_enqueue_style( 'wp-components' );

		/** @psalm-suppress UndefinedClass */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
		$user_firstname = wp_get_current_user()->user_firstname;
		$localize       = array(
			'current_user'           => ! empty( $user_firstname ) ? ucfirst( $user_firstname ) : ucfirst( wp_get_current_user()->display_name ),
			'admin_base_url'         => admin_url(),
			'plugin_dir'             => BSF_CUSTOM_FONTS_URI,
			'plugin_ver'             => defined( 'BSF_CUSTOM_FONTS_VER' ) ? BSF_CUSTOM_FONTS_VER : '',
			'plugin_name'            => 'Custom Fonts',
			'ajax_url'               => admin_url( 'admin-ajax.php' ),
			'admin_url'              => admin_url( 'admin.php' ),
			'home_slug'              => self::$plugin_slug,
			'app_base_url'           => admin_url( 'admin.php?page=' . self::$plugin_slug ),
			'update_nonce'           => wp_create_nonce( 'astra_update_admin_setting' ),
			'add_font_nonce'         => wp_create_nonce( 'add_font_nonce' ),
			'edit_font_nonce'        => wp_create_nonce( 'edit_font_nonce' ),
			'delete_font_nonce'      => wp_create_nonce( 'delete_font_nonce' ),
			'googleFonts'            => Bsf_Custom_Font_Families::get_google_fonts(),
		);

		$this->settings_app_scripts( apply_filters( 'bsf_custom_fonts_react_admin_localize', $localize ) );
	}

	/**
	 * Settings app scripts
	 *
	 * @since x.x.x
	 * @param array $localize Variable names.
	 */
	public function settings_app_scripts( $localize ) {
		$handle            = 'bsf-custom-fonts-admin-dashboard-app';
		$build_path        = BSF_CUSTOM_FONTS_ADMIN_DIR . '/assets/build/';
		$build_url         = BSF_CUSTOM_FONTS_ADMIN_URL . '/assets/build/';
		$script_asset_path = $build_path . 'dashboard-app.asset.php';

		$script_info = file_exists( $script_asset_path ) ? include $script_asset_path : array(  // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.
			'dependencies' => array(),
			'version'      => BSF_CUSTOM_FONTS_VER,
		);

		wp_enqueue_media();
		$script_dep = array_merge( $script_info['dependencies'], array( 'updates', 'wp-hooks' ) );

		wp_register_script(
			$handle,
			$build_url . 'dashboard-app.js',
			$script_dep,
			$script_info['version'],
			true
		);

		wp_register_style(
			$handle,
			$build_url . 'dashboard-app.css',
			array(),
			BSF_CUSTOM_FONTS_VER
		);

		wp_register_style(
			'bsf-custom-fonts-admin-google-fonts',
			'https://fonts.googleapis.com/css2?family=Inter:wght@200&display=swap',
			array(),
			BSF_CUSTOM_FONTS_VER
		);

		wp_enqueue_script( $handle );

		wp_set_script_translations( $handle, 'bsf-custom-fonts' );

		wp_enqueue_style( 'bsf-custom-fonts-admin-google-fonts' );
		wp_enqueue_style( $handle );

		wp_style_add_data( $handle, 'rtl', 'replace' );

		wp_localize_script( $handle, 'bsf_custom_fonts_admin', $localize );
	}

	/**
	 *  Add footer link.
	 *
	 * @since x.x.x
	 */
	public function bsf_custom_fonts_admin_footer_link() {
		return '<span id="footer-thankyou"> Thank you for using <span class="focus:text-astra-hover active:text-astra-hover hover:text-astra-hover"> ' . esc_html( 'Custom Fonts', 'custom-fonts' ) . '.</span></span>';
	}
}

Bsf_Custom_Fonts_Menu::get_instance();
