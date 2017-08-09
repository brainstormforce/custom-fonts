<?php
/**
 * Bsf Custom Fonts Admin Ui
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

defined( 'ABSPATH' ) or exit;

if ( ! class_exists( 'Bsf_Custom_Fonts_Register' ) ) :

	/**
	 * Bsf_Custom_Fonts_Register
	 */
	class Bsf_Custom_Fonts_Register {

		/**
		 * Instance of Bsf_Custom_Fonts_Register
		 *
		 * @since  1.0.0
		 * @var (Object) Bsf_Custom_Fonts_Register
		 */
		private static $_instance = null;

		/**
		 * Instance of Bsf_Custom_Fonts_Admin_Ui.
		 *
		 * @since  1.0.0
		 *
		 * @return object Class object.
		 */
		public static function set_instance() {
			if ( ! isset( self::$_instance ) ) {
				self::$_instance = new self;
			}

			return self::$_instance;
		}

		/**
		 * Constructor.
		 *
		 * @since  1.0.0
		 */
		public function __construct() {
			// if ( !Bsf_Custom_Fonts::get_instance()->taxonomy->has_fonts() )
			// return;

			// add_action( 'wp_head', array( $this, 'print_css_fonts' ), 1 );
			add_filter( 'astra-add-custom-fonts', array( $this, 'add_custom_fonts' ) );
			add_filter( 'add_custom_font_list', array( $this , 'add_custom_font_list') );


			add_action( 'astra_customizer_font_list', array( $this, 'add_customizer_font_list') );
		}

	public function add_custom_fonts() {
		$fonts = Bsf_Custom_Fonts::get_instance()->taxonomy->get_fonts();

		?><style><?php
		foreach ( $fonts as $font ) :
		$svg_syntax = '';
		if ( ! empty( $font->links['font_svg'] ) )
			$svg_syntax = ", url('" . esc_attr( $font->links['font_svg'] ) . "#{$font->slug}') format('svg')";
		?>
		@font-face {
			font-family: '<?php echo esc_attr( $font->name ); ?>';
			src: url('<?php echo esc_attr( $font->links['font_eot'] ); ?>');
			src: url('<?php echo esc_attr( $font->links['font_eot'] ); ?>?#iefix') format('embedded-opentype'),
			url('<?php echo esc_attr( $font->links['font_woff'] ); ?>') format('woff'),
			url('<?php echo esc_attr( $font->links['font_ttf'] ); ?>') format('truetype')<?php echo $svg_syntax; ?>;
			font-style: normal;
			font-weight: normal;
		}
		<?php endforeach;
		?></style><?php
		}

		public function add_customizer_font_list( $value ){
			
			$fonts = Bsf_Custom_Fonts::get_instance()->taxonomy->get_fonts();

			echo '<optgroup label="Custom">';

			foreach ( $fonts as $font ) {
				echo '<option value="' . esc_attr( $font->name ) . '" ' . selected( $font->name, $value , false ) . '>' . esc_attr( $font->name ) . '</option>';
			}
		}
		
	}

endif;
