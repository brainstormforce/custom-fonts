<?php
/**
 * Bsf Custom fonts - Init
 *
 * @package Bsf_Custom_Fonts
 */

if ( ! class_exists( 'Bsf_Custom_Fonts' ) ) {

	/**
	 * Bsf Custom fonts
	 *
	 * @since 1.0.0
	 */
	class Bsf_Custom_Fonts {

		/**
		 * Member Varible
		 *
		 * @var object instance
		 */
		private static $instance;

		/**
		 * @var Bsf_custom_fonts_admin_ui
		 */
		public $admin_ui;

		/**
		 * @var Bsf_custom_fonts_taxonomy
		 */
		public $taxonomy;

		/**
		 * @var Bsf_custom_fonts_register
		 */
		public $register;

		/**
		 *  Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self;
			}
			return self::$instance;
		}

		/**
		 * Constructor function that initializes required actions and hooks
		 */
		public function __construct() {
			add_action( 'init', array( $this, 'init_loader' ) );
			add_action( 'admin_enqueue_scripts', array( $this , 'enqueue_scripts') );

			// Enqueue the custom fonts
			add_action( 'astra_render_fonts', array( $this, 'render_fonts' ), 0 );
		}

		public function enqueue_scripts(){
			wp_enqueue_media();
			wp_enqueue_script( 'bsf-custom-fonts-js', BSF_CUSTOM_FONTS_URI . 'assets/js/bsf-custom-fonts.js', array(), null );

		}

		/**
		 * Initial loader
		 */
		public function init_loader() {
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-taxonomy.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-admin-ui.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-register.php';
			$this->taxonomy  = new Bsf_Custom_Fonts_Taxonomy();
			$this->admin_ui  = new Bsf_Custom_Fonts_Admin_Ui();
			$this->register  = new Bsf_Custom_Fonts_Register();
		}

		public function render_fonts( $load_fonts ) {
			$fonts = Bsf_Custom_Fonts::get_instance()->taxonomy->get_fonts();

			foreach ( $load_fonts  as $load_font_name => $load_font ) {
					if ( array_key_exists( $load_font_name , $fonts ) ) {
						$this->render_font_css( $load_font_name );

						unset( $load_fonts[ $load_font_name ] );
					}
				}
			

			return $load_fonts;
		}

		private function render_font_css( $font ) {

			?>

			<style type="text/css">

			@font-face {
				font-family: '<?php echo esc_attr( $font->name ); ?>';
				src:url('<?php echo esc_attr( $font->links['font_woff'] ); ?>') format('woff');
				font-style: normal;
				font-weight: normal;
			}

			</style>

			<?php
		}
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts::get_instance();
}// End if().
