<?php
/**
 * Class Bsf_Custom_Fonts_Menu.
 *
 * @package Bsf_Custom_Fonts
 * @since 2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Bsf_Custom_Fonts_Menu.
 *
 * @since 2.0.0
 */
class Bsf_Custom_Fonts_Menu {

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
			/** @psalm-suppress InvalidPropertyAssignmentValue */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			self::$instance = new self();
			/** @psalm-suppress InvalidPropertyAssignmentValue */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
		}
		return self::$instance;
	}

	/**
	 * Page title
	 *
	 * @since 2.0.0
	 * @var string $page_title
	 */
	public static $page_title = 'Bsf Custom Fonts';

	/**
	 * Plugin slug
	 *
	 * @since 2.0.0
	 * @var string $plugin_slug
	 */
	public static $plugin_slug = 'bsf-custom-fonts';

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

		self::$page_title  = apply_filters( 'bsf_custom_fonts_page_title', __( 'Bsf Custom Fonts', 'bsf-custom-fonts' ) );
		self::$plugin_slug = self::get_theme_page_slug();

		add_action( 'admin_menu', array( $this, 'setup_menu' ) );
		add_action( 'admin_init', array( $this, 'settings_admin_scripts' ) );

		add_action( 'after_setup_theme', array( $this, 'init_admin_settings' ), 99 );
	}

	/**
	 * Admin settings init.
	 *
	 * @since 2.0.0
	 */
	public function init_admin_settings() {
		if ( ! is_customize_preview() ) {
			add_action( 'admin_head', array( $this, 'admin_submenu_css' ) );
		}
	}

	/**
	 * Add custom CSS for admin area sub menu icons.
	 *
	 * @since 2.0.0
	 */
	public function admin_submenu_css() {
		echo '<style class="astra-menu-appearance-style">
				#toplevel_page_' . esc_attr( self::$plugin_slug ) . ' .wp-menu-image.svg {
					background-size: 18px auto !important;
				}
			</style>';
	}

	/**
	 * Theme options page Slug getter including White Label string.
	 *
	 * @since 2.0.0
	 * @return string Theme Options Page Slug.
	 */
	public static function get_theme_page_slug() {
		return apply_filters( 'astra_theme_page_slug', self::$plugin_slug );
	}

	/**
	 *  Initialize after Astra gets loaded.
	 *
	 * @since 2.0.0
	 */
	public function settings_admin_scripts() {
		// Enqueue admin scripts.
		/** @psalm-suppress PossiblyInvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
		if ( ! empty( $_GET['page'] ) && ( self::$plugin_slug === $_GET['page'] || false !== strpos( $_GET['page'], self::$plugin_slug . '_' ) ) ) { //phpcs:ignore
			/** @psalm-suppress PossiblyInvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			add_action( 'admin_enqueue_scripts', array( $this, 'styles_scripts' ) );
			add_filter( 'admin_footer_text', array( $this, 'bsf_custom_fonts_admin_footer_link' ), 99 );
		}
	}

	/**
	 * Add submenu to admin menu.
	 *
	 * @since 2.0.0
	 */
	public function setup_menu() {
		global $submenu;

		$capability = 'manage_options';

		if ( ! current_user_can( $capability ) ) {
			return;
		}

		$astra_icon = apply_filters( 'astra_menu_icon', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iI2E3YWFhZCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAyMEMxNS41MjI4IDIwIDIwIDE1LjUyMjggMjAgMTBDMjAgNC40NzcxNSAxNS41MjI4IDAgMTAgMEM0LjQ3NzE1IDAgMCA0LjQ3NzE1IDAgMTBDMCAxNS41MjI4IDQuNDc3MTUgMjAgMTAgMjBaTTUuODczMDQgMTEuMTY0MUM3LjIwMjM0IDguNDQyNzggOC41MzE4MSA1LjcyMTEyIDkuODYxMjcgMy4wMDAzOEwxMS4yNTUyIDUuNzA3NTlDMTAuMjA2NCA3Ljc2MjQ0IDkuMTU3NSA5LjgxNjg1IDguMTA4NzggMTEuODcwOEw2LjUxMTkgMTQuOTk4NUg0TDUuODczMDQgMTEuMTY0MVpNMTAuMDQ2NCAxMi44MzM5TDEyLjQ2NTUgNy45NjE2NUMxMi45OTMzIDkuMDEyOTIgMTMuNTIxMyAxMC4wNjQyIDE0LjA0OTQgMTEuMTE1NkMxNC42OTk2IDEyLjQxMDEgMTUuMzQ5OSAxMy43MDQ4IDE2IDE1SDEzLjMwMjVMMTIuODM5MyAxMy45NjY2TDEyLjM3MjIgMTIuOTI0NUgxMC4wNDY0SDkuOTk5NzZMMTAuMDQ2NCAxMi44MzM5WiIgZmlsbD0iI2E3YWFhZCIvPgo8L3N2Zz4K' );
		$priority   = apply_filters( 'astra_menu_priority', 59 );

		$page_slug = 'bsf-custom-fonts';

		add_menu_page( // phpcs:ignore WPThemeReview.PluginTerritory.NoAddAdminPages.add_menu_pages_add_menu_page -- Taken the menu on top level
			self::$page_title,
			self::$page_title,
			$capability,
			$page_slug,
			array( $this, 'render_admin_dashboard' ),
			$astra_icon,
			$priority
		);

		// Rename to Home menu.
		//$submenu[ self::$plugin_slug ][0][0] = __( 'Dashboard', 'bsf-custom-fonts' ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Required to rename the home menu.
	}

	/**
	 * Renders the admin settings.
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function render_admin_dashboard() {
		$page_action = '';

		if ( isset( $_GET['action'] ) ) { //phpcs:ignore
			/** @psalm-suppress PossiblyInvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			$page_action = sanitize_text_field( wp_unslash( $_GET['action'] ) ); //phpcs:ignore
			/** @psalm-suppress PossiblyInvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			$page_action = str_replace( '_', '-', $page_action );
		}

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
	 * @since 2.0.0
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
			'show_self_branding'     => $show_self_branding,
			'admin_url'              => admin_url( 'admin.php' ),
			'home_slug'              => self::$plugin_slug,
			'bsf_custom_fonts_base_url'         => admin_url( 'admin.php?page=' . self::$plugin_slug ),
			'logo_url'               => apply_filters( 'bsf_custom_fonts_admin_menu_icon', BSF_CUSTOM_FONTS_URI . 'inc/assets/images/astra-logo.svg' ),
			'update_nonce'           => wp_create_nonce( 'astra_update_admin_setting' ),
			'plugin_installer_nonce' => wp_create_nonce( 'updates' ),
			'googleFonts'            => Bsf_Custom_Font_Families::get_google_fonts(),
		);

		$this->settings_app_scripts( apply_filters( 'bsf_custom_fonts_react_admin_localize', $localize ) );
	}

	/**
	 * Get plugin status
	 *
	 * @since 2.0.0
	 *
	 * @param  string $plugin_init_file Plguin init file.
	 * @return mixed
	 */
	public static function get_plugin_status( $plugin_init_file ) {

		$installed_plugins = get_plugins();

		if ( ! isset( $installed_plugins[ $plugin_init_file ] ) ) {
			return 'install';
		} elseif ( is_plugin_active( $plugin_init_file ) ) {
			return 'activated';
		} else {
			return 'installed';
		}
	}

	/**
	 * Settings app scripts
	 *
	 * @since 2.0.0
	 * @param array $localize Variable names.
	 */
	public function settings_app_scripts( $localize ) {
		$handle            = 'bsf-custom-fonts-admin-dashboard-app';
		$build_path        = BSF_CUSTOM_FONTS_DIR . 'admin/react/assets/build/';
		$build_url         = BSF_CUSTOM_FONTS_URI . 'admin/react/assets/build/';
		$script_asset_path = $build_path . 'dashboard-app.asset.php';

		/** @psalm-suppress MissingFile */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
		$script_info = file_exists( $script_asset_path ) ? include $script_asset_path : array(  // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound -- Not a template file so loading in a normal way.
			'dependencies' => array(),
			'version'      => BSF_CUSTOM_FONTS_VER,
		);
		/** @psalm-suppress MissingFile */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort

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
	 * @since 2.0.0
	 */
	public function bsf_custom_fonts_admin_footer_link() {
		return '<span id="footer-thankyou"> Thank you for using <span class="focus:text-astra-hover active:text-astra-hover hover:text-astra-hover"> ' . esc_html( 'BSF Custom Fonts' ) . '.</span></span>';
	}

}

Bsf_Custom_Fonts_Menu::get_instance();
