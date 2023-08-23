<?php
/**
 * Class BSF_Custom_Fonts_Menu.
 *
 * @package Bsf_Custom_Fonts
 * @since 2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * BSF_Custom_Fonts_Menu.
 *
 * @since 2.0.0
 */
class BSF_Custom_Fonts_Menu {

	/**
	 * Instance
	 *
	 * @access private
	 * @var null $instance
	 * @since 2.0.0
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since 2.0.0
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
	 * @since 2.0.0
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
	 * @since 2.0.0
	 */
	public function __construct() {
		$this->initialize_hooks();
	}

	/**
	 * Init Hooks.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function initialize_hooks() {

		add_action( 'admin_menu', array( $this, 'register_custom_fonts_menu' ) );
		add_action( 'admin_init', array( $this, 'settings_admin_scripts' ) );

		add_filter( 'upload_mimes', array( $this, 'add_fonts_to_allowed_mimes' ) );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'update_mime_types' ), 10, 3 );
	}

	/**
	 * Register custom font menu
	 *
	 * @since 1.0.0
	 */
	public function register_custom_fonts_menu() {
		$title = apply_filters( 'bsf_custom_fonts_menu_title', _x( 'Custom Fonts', 'Menu title', 'custom-fonts' ) );
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
	 *  Initialize after Astra gets loaded.
	 *
	 * @since 2.0.0
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
	 * @since 2.0.0
	 */
	public function is_custom_fonts_screen() {
		if ( isset( $_GET['page'] ) && sanitize_text_field( $_GET['page'] ) === self::$plugin_slug ) { //phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return true;
		}
		return false;
	}

	/**
	 * Renders the admin settings.
	 *
	 * @since 2.0.0
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
	 * @return void
	 * @since 2.0.0
	 */
	public function styles_scripts() {

		if ( is_customize_preview() ) {
			return;
		}

		wp_enqueue_style( 'bsf-custom-fonts-admin-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap', array(), BSF_CUSTOM_FONTS_VER ); // Styles.

		wp_enqueue_style( 'wp-components' );

		$localize = array(
			'admin_base_url'      => admin_url(),
			'plugin_dir'          => BSF_CUSTOM_FONTS_URI,
			'plugin_ver'          => defined( 'BSF_CUSTOM_FONTS_VER' ) ? BSF_CUSTOM_FONTS_VER : '',
			'plugin_name'         => 'Custom Fonts',
			'ajax_url'            => admin_url( 'admin-ajax.php' ),
			'home_slug'           => self::$plugin_slug,
			'app_base_url'        => admin_url( 'themes.php?page=' . self::$plugin_slug ),
			'update_nonce'        => wp_create_nonce( 'astra_update_admin_setting' ),
			'add_font_nonce'      => wp_create_nonce( 'add_font_nonce' ),
			'edit_font_nonce'     => wp_create_nonce( 'edit_font_nonce' ),
			'delete_font_nonce'   => wp_create_nonce( 'delete_font_nonce' ),
			'preload_font_nonce'  => wp_create_nonce( 'preload_font_nonce' ),
			'googleFonts'         => BCF_Custom_Font_Families::get_google_fonts(),
			'existingGoogleFonts' => BCF_Custom_Font_Families::get_existing_google_fonts(),
			'fontPostCount'       => wp_count_posts( BSF_CUSTOM_FONTS_POST_TYPE )->publish,
			'googleFontAPI'       => 'https://fonts.googleapis.com/css?family',
			'fontWeightList'      => BCF_Custom_Font_Families::get_font_weight_list(),
			'preloading'          => get_option( 'bcf_preloading_fonts', false ),
		);

		$this->settings_app_scripts( apply_filters( 'bsf_custom_fonts_dashboard_admin_localize', $localize ) );
	}

	/**
	 * Settings app scripts
	 *
	 * @param array $localize Variable names.
	 *
	 * @return void
	 * @since 2.0.0
	 */
	public function settings_app_scripts( $localize ) {
		$handle    = 'bsf-custom-fonts-admin-dashboard-app';
		$build_url = BSF_CUSTOM_FONTS_ADMIN_URL . '/assets/build/';

		wp_enqueue_media();
		$script_dep = array( 'react', 'react-dom', 'wp-api-fetch', 'wp-components', 'wp-element', 'wp-i18n', 'updates', 'wp-hooks' );

		wp_register_script(
			$handle,
			$build_url . 'dashboard-app.js',
			$script_dep,
			BSF_CUSTOM_FONTS_VER,
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

		wp_set_script_translations( $handle, 'custom-fonts' );

		wp_enqueue_style( 'bsf-custom-fonts-admin-google-fonts' );
		wp_enqueue_style( $handle );

		wp_style_add_data( $handle, 'rtl', 'replace' );

		wp_localize_script( $handle, 'bsf_custom_fonts_admin', $localize );
	}

	/**
	 *  Add footer link.
	 *
	 * @since 2.0.0
	 */
	public function bsf_custom_fonts_admin_footer_link() {
		$footer_text = sprintf(
			/* translators: 1: Custom Fonts, 2: Plugin rating link */
			__( 'Enjoyed %1$s? Please leave us a %2$s rating. We really appreciate your support!', 'custom-fonts' ),
			'<span class="bcf-footer-thankyou"><strong> Custom Fonts </strong>',
			'<a href="https://wordpress.org/support/plugin/custom-fonts/reviews/?filter=5#new-post" target="_blank">&#9733;&#9733;&#9733;&#9733;&#9733;</a></span>'
		);
		return $footer_text;
	}
}

BSF_Custom_Fonts_Menu::get_instance();
