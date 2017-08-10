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
		 * Member Varible
		 *
		 * @var string $font_css
		 */
		public $font_css;
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
			add_action( 'astra_render_fonts', array( $this, 'render_fonts' ) );

			// Delete custom fonts action
			add_action( 'delete_term', array($this , 'delete_custom_fonts_fallback_astra' ), 10, 5);
		}

		/**
		 * Enqueue Admin Scripts
		 *
		 * @since 1.0.0
		 */
		public function enqueue_scripts(){
			wp_enqueue_style( 'bsf-custom-fonts-css', BSF_CUSTOM_FONTS_URI . 'assets/css/bsf-custom-fonts.css', array(), BSF_CUSTOM_FONTS_VER );
			wp_enqueue_media();
			wp_enqueue_script( 'bsf-custom-fonts-js', BSF_CUSTOM_FONTS_URI . 'assets/js/bsf-custom-fonts.js', array(), BSF_CUSTOM_FONTS_VER );

		}

		/**
		 * Initial Loader
		 *
		 * @since 1.0.0
		 */
		public function init_loader() {
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-taxonomy.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-admin.php';
			require_once BSF_CUSTOM_FONTS_DIR . 'includes/class-bsf-custom-fonts-add.php';

			$this->taxonomy  = new Bsf_Custom_Fonts_Taxonomy();
			$this->admin  = new Bsf_Custom_Fonts_Admin();
			$this->register  = new Bsf_Custom_Fonts_Add();
		}

		/**
		 * Enqueue Render Fonts
		 *
		 * @since 1.0.0
		 * @param array $load_fonts astra fonts.
		 */
		public function render_fonts( $load_fonts ) {

			$fonts      = Bsf_Custom_Fonts::get_instance()->taxonomy->get_fonts();

			foreach ( $load_fonts  as $load_font_name => $load_font ) {
				if ( array_key_exists( $load_font_name , $fonts ) ) {
					$this->render_font_css( $load_font_name );
					unset( $load_fonts[ $load_font_name ] );
				}
			}
			// Add Astra inline css for custom Fonys.
			wp_add_inline_style( 'astra-theme-css', $this->font_css );
			return $load_fonts;
		}

		/**
		 * Create css for font-face
		 *
		 * @since 1.0.0
		 * @param array $font selected font from custom font list.
		 */
		private function render_font_css( $font ) {
			$fonts = Bsf_Custom_Fonts::get_instance()->taxonomy->get_links_by_name( $font );

			foreach ( $fonts as $font => $links ) :
				$css  = '@font-face { font-family:' . esc_attr( $font ) .';';
				$css .= 'src:';
				$arr = array();
				if ( $links['font_woff_2'] ) {
					$arr[] = "url(" . esc_url( $links['font_woff_2'] ) . ") format('woff2')";
				}
				if ( $links['font_woff'] ) {
					$arr[] = "url(" . esc_url( $links['font_woff'] ) . ") format('woff')";
				}
				if ( $links['font_ttf'] ) {
					$arr[] = "url(" . esc_url( $links['font_ttf'] ) . ") format('truetype')";
				}
				if ( $links['font_svg'] ) {
					$arr[] = "url(" . esc_url( $links['font_svg'] ) . "#". esc_attr( $font ) .") format('svg')";
				}
				$css .= join( ', ', $arr );
				$css  .= ';}' ;
			 endforeach;

			$this->font_css = $css;
		}

		/**
		 * Set default 'inherit' if custom font is selected in customizer if this is deleted.
		 *
		 * @since 1.0.0
		 * @param int $term Term ID.
		 * @param int $tt_id Term taxonomy ID.
		 * @param string $taxonomy Taxonomy slug.
		 * @param mixed $deleted_term deleted term.
		 * @param object $object_ids objects ids.
		 */
		function delete_custom_fonts_fallback_astra( $term, $tt_id, $taxonomy, $deleted_term, $object_ids ) {

			if ( defined( 'ASTRA_THEME_SETTINGS' ) ) {
				// get astra options.
				$options = get_option( ASTRA_THEME_SETTINGS );
				foreach ( $options as $key => $value ) {
					if ( $value == $deleted_term->name ) {
						// set default inherit if custom font is deleted.
						$options[$key] = 'inherit';
					}
				}
				// update astra options.
				update_option( ASTRA_THEME_SETTINGS, $options );
			}

		}
	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts::get_instance();
}// End if().