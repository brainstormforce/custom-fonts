<?php
/**
 * Bsf Custom Fonts Admin Ui
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

defined( 'ABSPATH' ) or exit;

if ( ! class_exists( 'Bsf_Custom_Fonts_Admin' ) ) :

	/**
	 * Bsf_Custom_Fonts_Admin
	 */
	class Bsf_Custom_Fonts_Admin {

		/**
		 * Instance of Bsf_Custom_Fonts_Admin
		 *
		 * @since  1.0.0
		 * @var (Object) Bsf_Custom_Fonts_Admin
		 */
		private static $_instance = null;

		/**
		 * Parent Menu Slug
		 *
		 * @since  1.0.0
		 * @var (string) $parent_menu_slug
		 */
		protected $parent_menu_slug = 'themes.php';

		/**
		 * Instance of Bsf_Custom_Fonts_Admin.
		 *
		 * @since  1.0.0
		 *
		 * @return object Class object.
		 */
		public static function get_instance() {
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
			add_action( 'admin_menu', array( $this, 'register_custom_fonts_menu' ) );
			add_action( 'admin_head', array( $this, 'custom_fonts_menu_highlight' ) );

			add_filter( 'manage_edit-' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_columns', array( $this, 'manage_columns' ) );

			add_action( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_add_form_fields', array( $this, 'add_new_taxonomy_data' ) );
			add_action( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_edit_form_fields', array( $this, 'edit_taxonomy_data' ) );

			add_action( 'edited_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug, array( $this, 'save_metadata' ) );
			add_action( 'create_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug, array( $this, 'save_metadata' ) );

			add_filter( 'upload_mimes', array( $this, 'add_fonts_to_allowed_mimes' ) );

		}

		/**
		 * Register custom font menu
		 *
		 * @since 1.0.0
		 */
		public function register_custom_fonts_menu() {

			$title = apply_filters( 'bsf_custom_fonts_menu_title', __( 'Custom Fonts', 'custom-fonts' ) );
			add_submenu_page(
				$this->parent_menu_slug,
				$title,
				$title,
				Bsf_Custom_Fonts_Taxonomy::$capability,
				'edit-tags.php?taxonomy=' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug
			);
		}

		/**
		 * Highlight custom font menu
		 *
		 * @since 1.0.0
		 */
		public function custom_fonts_menu_highlight() {
			global $parent_file, $submenu_file;

			if ( 'edit-tags.php?taxonomy=' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug === $submenu_file ) {
				$parent_file = $this->parent_menu_slug;
			}
			if ( get_current_screen()->id != 'edit-' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ) {
				return;
			}

			?><style>#addtag div.form-field.term-slug-wrap, #edittag tr.form-field.term-slug-wrap { display: none; }
				#addtag div.form-field.term-description-wrap, #edittag tr.form-field.term-description-wrap { display: none; }</style><script>jQuery( document ).ready( function( $ ) {
					var $wrapper = $( '#addtag, #edittag' );
					$wrapper.find( 'tr.form-field.term-name-wrap p, div.form-field.term-name-wrap > p' ).text( '<?php esc_html_e( 'The name of the font as it appears in the customizer options.', 'custom-fonts' ); ?>' );
				} );</script>
				<?php
		}

		/**
		 * Manage Columns
		 *
		 * @since 1.0.0
		 * @param array $columns default columns.
		 * @return array $columns updated columns.
		 */
		public function manage_columns( $columns ) {

			$screen = get_current_screen();
			// If current screen is add new custom fonts screen.
			if ( 'edit-tags' == $screen->base ) {

				$old_columns = $columns;
				$columns     = array(
					'cb'   => $old_columns['cb'],
					'name' => $old_columns['name'],
				);

			}
			return $columns;
		}

		/**
		 * Add new Taxonomy data
		 *
		 * @since 1.0.0
		 */
		public function add_new_taxonomy_data() {
			$this->font_file_new_field( 'font_woff_2', __( 'Font .woff2', 'custom-fonts' ), __( 'Upload the font\'s woff2 file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_woff', __( 'Font .woff', 'custom-fonts' ), __( 'Upload the font\'s woff file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_ttf', __( 'Font .ttf', 'custom-fonts' ), __( 'Upload the font\'s ttf file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_eot', __( 'Font .eot', 'custom-fonts' ), __( 'Upload the font\'s eot file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_svg', __( 'Font .svg', 'custom-fonts' ), __( 'Upload the font\'s svg file or enter the URL.', 'custom-fonts' ) );
		}

		/**
		 * Edit Taxonomy data
		 *
		 * @since 1.0.0
		 * @param object $term taxonomy terms.
		 */
		public function edit_taxonomy_data( $term ) {
			$data = Bsf_Custom_Fonts_Taxonomy::get_font_links( $term->term_id );
			$this->font_file_edit_field( 'font_woff_2', __( 'Font .woff2', 'custom-fonts' ), $data['font_woff_2'], __( 'Upload the font\'s woff2 file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_edit_field( 'font_woff', __( 'Font .woff', 'custom-fonts' ), $data['font_woff'], __( 'Upload the font\'s woff file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_edit_field( 'font_ttf', __( 'Font .ttf', 'custom-fonts' ), $data['font_ttf'], __( 'Upload the font\'s ttf file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_edit_field( 'font_eot', __( 'Font .eot', 'custom-fonts' ), $data['font_eot'], __( 'Upload the font\'s eot file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_edit_field( 'font_svg', __( 'Font .svg', 'custom-fonts' ), $data['font_svg'], __( 'Upload the font\'s svg file or enter the URL.', 'custom-fonts' ) );
		}

		/**
		 * Add Taxonomy data field
		 *
		 * @since 1.0.0
		 * @param int    $id current term id.
		 * @param string $title font type title.
		 * @param string $description title font type description.
		 * @param string $value title font type meta values.
		 */
		protected function font_file_new_field( $id, $title, $description, $value = '' ) {
			?>
			<div class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap" >

				<label for="font-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></label>
				<input type="text" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-fonts-link <?php echo esc_attr( $id ); ?>" name="<?php echo Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug; ?>[<?php echo esc_attr( $id ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
				<a href="#" class="bsf-custom-fonts-upload button" data-upload-type="<?php echo esc_attr( $id ); ?>"><?php esc_html_e( 'Upload', 'custom-fonts' ); ?></a>
				<p><?php echo esc_html( $description ); ?></p>
			</div>
			<?php
		}

		/**
		 * Add Taxonomy data field
		 *
		 * @since 1.0.0
		 * @param int    $id current term id.
		 * @param string $title font type title.
		 * @param string $value title font type meta values.
		 * @param string $description title font type description.
		 */
		protected function font_file_edit_field( $id, $title, $value = '', $description ) {
			?>
			<tr class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap ">
				<th scope="row">
					<label for="metadata-<?php echo esc_attr( $id ); ?>">
						<?php echo esc_html( $title ); ?>
					</label>
				</th>
				<td>
					<input id="metadata-<?php echo esc_attr( $id ); ?>" type="text" class="bsf-custom-fonts-link <?php echo esc_attr( $id ); ?>" name="<?php echo Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug; ?>[<?php echo esc_attr( $id ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
					<a href="#" class="bsf-custom-fonts-upload button" data-upload-type="<?php echo esc_attr( $id ); ?>"><?php esc_html_e( 'Upload', 'custom-fonts' ); ?></a>
					<p><?php echo esc_html( $description ); ?></p>
				</td>
			</tr>
			<?php
		}

		/**
		 * Save Taxonomy meta data value
		 *
		 * @since 1.0.0
		 * @param int $term_id current term id.
		 */
		public function save_metadata( $term_id ) {

			if ( isset( $_POST[ Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ] ) ) {
				$value = array_map( 'esc_attr', $_POST[ Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ] );
				Bsf_Custom_Fonts_Taxonomy::update_font_links( $value, $term_id );
			}
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
			return $mimes;
		}

	}



	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts_Admin::get_instance();

endif;
