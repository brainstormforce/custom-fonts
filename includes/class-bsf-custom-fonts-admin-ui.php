<?php
/**
 * Bsf Custom Fonts Admin Ui
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

defined( 'ABSPATH' ) or exit;

if ( ! class_exists( 'Bsf_Custom_Fonts_Admin_Ui' ) ) :

	/**
	 * Bsf_Custom_Fonts_Admin_Ui
	 */
	class Bsf_Custom_Fonts_Admin_Ui {

		/**
		 * Instance of Bsf_Custom_Fonts_Admin_Ui
		 *
		 * @since  1.0.0
		 * @var (Object) Bsf_Custom_Fonts_Admin_Ui
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
			add_action( 'admin_menu', array( $this, 'register_custom_fonts_menu' ) );
			add_action( 'admin_head', array( $this, 'custom_fonts_menu_highlight' ) );

			add_filter( 'manage_edit-' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_columns', array( $this, 'manage_columns' ) );
			add_filter( 'manage_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_custom_column', array( $this, 'manage_custom_columns' ), 10, 3 );

			add_action( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_add_form_fields', array( $this, 'extra_new_metadata' ) );
			add_action( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_edit_form_fields', array( $this, 'extra_edit_metadata' ) );

			add_action( 'edited_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug, array( $this, 'save_metadata' ) );
			add_action( 'create_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug, array( $this, 'save_metadata' ) );

			add_filter( 'upload_mimes', array( $this, 'add_fonts_to_allowed_mimes' ), 10, 2 );

		}

		/**
		 * Register custom font menu
		 *
		 * @since 1.0.0
		 */
		public function register_custom_fonts_menu() {
			add_submenu_page(
				$this->parent_menu_slug,
				__( 'Bsf Custom Fonts', 'bsf-custom-fonts' ),
				__( 'Bsf Custom Fonts', 'bsf-custom-fonts' ),
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
			if ( 'edit-' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug !== get_current_screen()->id ) {
				return;
			}

			?><style>#addtag div.form-field.term-slug-wrap, #edittag tr.form-field.term-slug-wrap { display: none; }
				#addtag div.form-field.term-description-wrap, #edittag tr.form-field.term-description-wrap { display: none; }</style><script>jQuery( document ).ready( function( $ ) {
					var $wrapper = $( '#addtag, #edittag' );
					$wrapper.find( 'tr.form-field.term-name-wrap p, div.form-field.term-name-wrap > p' ).text( '<?php _e( 'The name of the font as it appears in the attached CSS file.', 'bsf-custom-fonts' ); ?>' );
				} );</script><?php
		}

		/**
		 * Manage Columns
		 *
		 * @since 1.0.0
		 * @param array $columns default columns.
		 * @return array $columns updated columns.
		 */
		public function manage_columns( $columns ) {
			$old_columns = $columns;
			$columns = array(
				'cb' => $old_columns['cb'],
				'name' => $old_columns['name'],
				'ID' => __( 'ID', 'bsf-custom-fonts' ),
			);

			return $columns;
		}

		/**
		 * Manage Custom Columns
		 *
		 * @since 1.0.0
		 * @param array $columns default columns.
		 * @return array $columns updated columns.
		 */
		public function manage_custom_columns( $value, $column_name, $term_id ) {
			switch ( $column_name ) {
				case 'ID':
					$value = '#' . $term_id;
					break;
			}

			return $value;
		}

		/**
		 * Add new metadata
		 *
		 * @since 1.0.0
		 * @param array $columns default columns.
		 * @return array $columns updated columns.
		 */
		public function extra_new_metadata() {
			$this->font_file_new_field( 'font_woff', __( 'Font .woff', 'bsf-custom-fonts' ), __( 'Upload the font\'s woff file', 'bsf-custom-fonts' ) );
			$this->font_file_new_field( 'font_ttf', __( 'Font .ttf', 'bsf-custom-fonts' ), __( 'Upload the font\'s ttf file', 'bsf-custom-fonts' ) );
			$this->font_file_new_field( 'font_eot', __( 'Font .eot', 'bsf-custom-fonts' ), __( 'Upload the font\'s eot file', 'bsf-custom-fonts' ) );
			$this->font_file_new_field( 'font_svg', __( 'Font .svg', 'bsf-custom-fonts' ), __( 'Upload the font\'s svg file', 'bsf-custom-fonts' ) );
		}

		public function extra_edit_metadata( $term ) {
			$data = Bsf_Custom_Fonts::get_instance()->taxonomy->get_font_links( $term->term_id );
			$this->font_file_edit_field( 'font_woff', __( 'Font .woff', 'bsf-custom-fonts' ), __( 'Upload the font\'s woff file', 'bsf-custom-fonts' ), $data['font_woff'] );
			$this->font_file_edit_field( 'font_ttf', __( 'Font .ttf', 'bsf-custom-fonts' ), __( 'Upload the font\'s ttf file', 'bsf-custom-fonts' ), $data['font_ttf'] );
			$this->font_file_edit_field( 'font_eot', __( 'Font .eot', 'bsf-custom-fonts' ), __( 'Upload the font\'s eot file', 'bsf-custom-fonts' ), $data['font_eot'] );
			$this->font_file_edit_field( 'font_svg', __( 'Font .svg', 'bsf-custom-fonts' ), __( 'Upload the font\'s svg file', 'bsf-custom-fonts' ), $data['font_svg'] );
		}

		protected function font_file_new_field( $id, $title, $description, $value = '' ) {
			?>
			<div class="form-field term-<?php echo esc_attr( $id ); ?>-wrap <?php if ( 'font_svg' !== $id ) echo ' form-required'; ?>">

				<label><?php echo esc_html( $title ); ?></label>
				<input type="text" class="bsf-custom-fonts-link <?php echo esc_attr( $id );?>" name="<?php echo Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug; ?>[<?php echo esc_attr( $id ); ?>]" placeholder="<?php _e( 'Upload or enter the file URL', 'bsf-custom-fonts' ); ?>" value="<?php echo esc_attr( $value ); ?>"<?php if ( 'font_svg' !== $id ) echo ' required'; ?> />

				<a href="javascript:void(0);" class="bsf-custom-fonts-upload button" data-upload-type="<?php echo esc_attr( $id );?>"><?php _e( 'Upload', 'bsf-custom-fonts' ); ?></a>
				<p><?php echo $description; ?></p>
			</div>
			<?php
		}

		protected function font_file_edit_field( $id, $title, $description, $value = '' ) {
			?>
			<tr class="form-field term-<?php echo esc_attr( $id ); ?>-wrap <?php if ( 'font_svg' !== $id ) echo ' form-required'; ?>">
				<th scope="row">
					<label for="metadata-<?php echo esc_attr( $id ); ?>">
						<?php echo $title; ?>
					</label>
				</th>
				<td>
					<input id="metadata-<?php echo esc_attr( $id ); ?>" type="text" class="bsf-custom-fonts-link <?php echo esc_attr( $id );?>" name="<?php echo Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug; ?>[<?php echo esc_attr( $id ); ?>]" placeholder="<?php _e( 'Upload or enter the file URL', 'bsf-custom-fonts' ); ?>" value="<?php echo esc_attr( $value ); ?>"<?php if ( 'font_svg' !== $id ) echo ' required'; ?> />
					<a href="javascript:void(0);" class="bsf-custom-fonts-upload button" data-upload-type="<?php echo esc_attr( $id );?>"><?php _e( 'Upload', 'bsf-custom-fonts' ); ?></a>
					<p><?php echo $description; ?></p>
				</td>
			</tr>
			<?php
		}

		public function save_metadata( $term_id ) {
			if ( isset( $_POST[Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug] ) ) {
				Bsf_Custom_Fonts::get_instance()->taxonomy->update_font_links( $_POST[Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug], $term_id );
			}
		}

		public function add_fonts_to_allowed_mimes( $mimes, $user ) {
			if ( current_user_can( Bsf_Custom_Fonts_Taxonomy::$capability ) ) {
				$mimes['svg'] = 'image/svg+xml';
				$mimes['woff'] = 'application/octet-stream';
				$mimes['eot'] = 'application/vnd.ms-fontobject';
				$mimes['ttf'] = 'font/ttf';
			}
			return $mimes;
		}



	}

endif;
