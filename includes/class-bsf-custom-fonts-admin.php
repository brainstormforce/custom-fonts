<?php
/**
 * Bsf Custom Fonts Admin Ui
 *
 * @since  1.0.0
 * @package Bsf_Custom_Fonts
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

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
		private static $instance = null;

		/**
		 * Parent Menu Slug
		 *
		 * @since  1.0.0
		 * @var (string) $parent_menu_slug
		 */
		protected $parent_menu_slug = 'themes.php';

		/**
		 * Edit repeater field initial count
		 *
		 * @since  x.x.x
		 * @var (string) $edit_repeater_field_count
		 */
		protected static $edit_repeater_field_count = 0;

		/**
		 * Instance of Bsf_Custom_Fonts_Admin.
		 *
		 * @since  1.0.0
		 *
		 * @return object Class object.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor.
		 *
		 * @since  1.0.0
		 */
		public function __construct() {
			add_action( 'admin_menu', array( $this, 'register_custom_fonts_menu' ), 101 );
			add_action( 'admin_head', array( $this, 'custom_fonts_menu_highlight' ) );

			add_filter( 'manage_edit-' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_columns', array( $this, 'manage_columns' ) );

			add_action( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_add_form_fields', array( $this, 'add_new_taxonomy_data' ) );
			add_action( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug . '_edit_form_fields', array( $this, 'edit_new_taxonomy_data' ) );

			add_action( 'edited_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug, array( $this, 'save_metadata' ) );
			add_action( 'create_' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug, array( $this, 'save_metadata' ) );

			add_filter( 'upload_mimes', array( $this, 'add_fonts_to_allowed_mimes' ) );
			add_filter( 'wp_check_filetype_and_ext', array( $this, 'update_mime_types' ), 10, 3 );
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
				$parent_file = $this->parent_menu_slug; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			}
			if ( get_current_screen()->id != 'edit-' . Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ) {
				return;
			}

			?><style>#addtag div.form-field.term-slug-wrap, #edittag tr.form-field.term-slug-wrap { display: none; }
				#addtag div.form-field.term-description-wrap, #edittag tr.form-field.term-description-wrap { display: none; }</style>
				<script>jQuery( document ).ready( function( $ ) {
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
			if ( isset( $screen->base ) && 'edit-tags' == $screen->base ) {

				$old_columns = $columns;
				$columns     = array(
					'cb'   => $old_columns['cb'],
					'name' => $old_columns['name'],
				);

			}
			return $columns;
		}

		/**
		 * Add new taxonomy data.
		 */
		public function add_new_taxonomy_data() {
			$this->add_new_taxonomy_default_data();
			?>
			<input type="hidden" name="repeater-field-count" value="1">
			<?php
			echo '
			<div id="repeater">
                <!-- Repeater Heading -->
                
                <div class="clearfix"></div>
                <!-- Repeater Items -->
                <div id="item-0" class="cf-bsf-items" data-group="font-weight-type">
                    <!-- Repeater Content -->
                    <div class="item-content">
						<div class="form-group">
						<div class="weight-wrapper">';
							$this->add_new_taxonomy_repeater_data();
							wp_nonce_field( basename( __FILE__ ), 'bsf_custom_font_nonce' );
							echo '</div>
					  </div>
                    </div>
                    <!-- Repeater Remove Btn -->
                    <div class="repeater-remove-btn">
                        <div class="button button-primary disabled remove-btn">
                            Remove
						</div>              
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
			<div class="cf-addbutton-wrapper">
				<div class="button button-primary repeater-add-btn">
					Add Font Variation
				</div>
			</div>';
		}

		/**
		 * Add new Taxonomy data
		 *
		 * @since 1.0.0
		 */
		public function add_new_taxonomy_default_data() {
			$this->font_new_field( 'font_fallback', __( 'Font Fallback', 'custom-fonts' ), __( 'Add the font\'s fallback names with comma(,) separator.  eg. Arial, Serif', 'custom-fonts' ) );

			$this->select_default_new_field(
				'font-display',
				__( 'Font Display', 'custom-fonts' ),
				__( 'Select font-display property for this font', 'custom-fonts' ),
				array(
					'auto'     => 'auto',
					'block'    => 'block',
					'swap'     => 'swap',
					'fallback' => 'fallback',
					'optional' => 'optional',
				)
			);
		}

		/**
		 * Add new Taxonomy data
		 *
		 * @since 1.0.0
		 */
		public function add_new_taxonomy_repeater_data() {
			$this->select_new_field(
				'font-weight-0',
				__( 'Font weight', 'custom-fonts' ),
				__( 'Select font-weight property for this font', 'custom-fonts' ),
				array(
					'100' => __( 'Thin 100', 'custom-fonts' ),
					'200' => __( 'Extra-Light 200', 'custom-fonts' ),
					'300' => __( 'Light 300', 'custom-fonts' ),
					'400' => __( 'Normal 400', 'custom-fonts' ),
					'500' => __( 'Medium 500', 'custom-fonts' ),
					'600' => __( 'Semi-Bold 600', 'custom-fonts' ),
					'700' => __( 'Bold 700', 'custom-fonts' ),
					'800' => __( 'Extra-Bold 800', 'custom-fonts' ),
					'900' => __( 'Ultra-Bold 900', 'custom-fonts' ),
				)
			);
			$this->font_file_new_field( 'font_woff_2-0', __( 'Font .woff2', 'custom-fonts' ), __( 'Upload the font\'s woff2 file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_woff-0', __( 'Font .woff', 'custom-fonts' ), __( 'Upload the font\'s woff file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_ttf-0', __( 'Font .ttf', 'custom-fonts' ), __( 'Upload the font\'s ttf file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_eot-0', __( 'Font .eot', 'custom-fonts' ), __( 'Upload the font\'s eot file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_svg-0', __( 'Font .svg', 'custom-fonts' ), __( 'Upload the font\'s svg file or enter the URL.', 'custom-fonts' ) );
			$this->font_file_new_field( 'font_otf-0', __( 'Font .otf', 'custom-fonts' ), __( 'Upload the font\'s otf file or enter the URL.', 'custom-fonts' ) );
		}

		/**
		 * Edit taxonomy data.
		 *
		 * @param object $term Term data.
		 */
		public function edit_new_taxonomy_data( $term ) {

			$data = Bsf_Custom_Fonts_Taxonomy::get_font_links( $term->term_id );
			$this->edit_new_taxonomy_default_data( $term );
			?>
			<tr>
			<th></th>
			<td>
			<div id="repeater">
				<!-- Repeater Heading -->
				<div class="clearfix"></div>
				<!-- Repeater Items -->
			<?php foreach ( $data as $key => $value ) { ?>
				<?php $this->edit_taxonomy_repeater_data( $key, $value ); ?>
			<?php	} ?>
			<input type="hidden" name="repeater-field-count" value="<?php echo esc_attr( self::$edit_repeater_field_count ); ?>">
			<?php wp_nonce_field( basename( __FILE__ ), 'bsf_custom_font_nonce' ); ?>
			</div>
			<div class="cf-addbutton-wrapper">
					<div class="button button-primary edit-repeater-add-btn">
						Add Font Variation
					</div>
				</div>
			</td>
			</tr>
			<?php

		}

		/**
		 * Edit Taxonomy data
		 *
		 * @since 1.0.0
		 * @param object $term taxonomy terms.
		 */
		public function edit_new_taxonomy_default_data( $term ) {
			$data = Bsf_Custom_Fonts_Taxonomy::get_font_links( $term->term_id );
			$this->font_edit_field( 'font_fallback', __( 'Font Fallback', 'custom-fonts' ), __( 'Add the font\'s fallback names with comma(,) separator.  eg. Arial, Serif', 'custom-fonts' ), $data['font_fallback'] );

			$this->select_default_edit_field(
				'font-display',
				__( 'Font Display', 'custom-fonts' ),
				__( 'Select font-display property for this font', 'custom-fonts' ),
				array(
					'auto'     => 'Auto',
					'block'    => 'Block',
					'swap'     => 'Swap',
					'fallback' => 'Fallback',
					'optional' => 'Optional',
				),
				$data['font-display']
			);

		}

		/**
		 * Edit Taxonomy data
		 *
		 * @since x.x.x
		 * @param string $key Font array repeater fields key.
		 * @param string $value Font array repeater fields value.
		 */
		public function edit_taxonomy_repeater_data( $key, $value ) {
			if ( strpos( $key, 'font-weight' ) !== false ) {
				?>
				<div id="<?php echo esc_attr( 'item-' . self::$edit_repeater_field_count ); ?>" class="cf-bsf-items" data-group="font-weight-type">
						<!-- Repeater Content -->
						<div class="item-content">
							<div class="form-group">
							<?php
							$this->select_new_field(
								$key,
								__( 'Font weight', 'custom-fonts' ),
								__( 'Select font-weight property for this font', 'custom-fonts' ),
								array(
									'100' => __( 'Thin 100', 'custom-fonts' ),
									'200' => __( 'Extra-Light 200', 'custom-fonts' ),
									'300' => __( 'Light 300', 'custom-fonts' ),
									'400' => __( 'Normal 400', 'custom-fonts' ),
									'500' => __( 'Medium 500', 'custom-fonts' ),
									'600' => __( 'Semi-Bold 600', 'custom-fonts' ),
									'700' => __( 'Bold 700', 'custom-fonts' ),
									'800' => __( 'Extra-Bold 800', 'custom-fonts' ),
									'900' => __( 'Ultra-Bold 900', 'custom-fonts' ),

								),
								$value
							);
							self::$edit_repeater_field_count++;
			} elseif ( strpos( $key, 'font_woff_2-' ) !== false ) {
				$this->font_file_edit_field( 'font_woff_2', __( 'Font .woff2', 'custom-fonts' ), __( 'Upload the font\'s woff2 file or enter the URL.', 'custom-fonts' ), $value, $key );
			} elseif ( strpos( $key, 'font_woff-' ) !== false ) {
				$this->font_file_edit_field( 'font_woff', __( 'Font .woff', 'custom-fonts' ), __( 'Upload the font\'s woff file or enter the URL.', 'custom-fonts' ), $value, $key );
			} elseif ( strpos( $key, 'font_ttf' ) !== false ) {
				$this->font_file_edit_field( 'font_ttf', __( 'Font .ttf', 'custom-fonts' ), __( 'Upload the font\'s ttf file or enter the URL.', 'custom-fonts' ), $value, $key );
			} elseif ( strpos( $key, 'font_eot' ) !== false ) {
				$this->font_file_edit_field( 'font_eot', __( 'Font .eot', 'custom-fonts' ), __( 'Upload the font\'s eot file or enter the URL.', 'custom-fonts' ), $value, $key );
			} elseif ( strpos( $key, 'font_svg' ) !== false ) {
				$this->font_file_edit_field( 'font_svg', __( 'Font .svg', 'custom-fonts' ), __( 'Upload the font\'s svg file or enter the URL.', 'custom-fonts' ), $value, $key );
			} elseif ( strpos( $key, 'font_otf' ) !== false ) {
				$this->font_file_edit_field( 'font_otf', __( 'Font .otf', 'custom-fonts' ), __( 'Upload the font\'s otf file or enter the URL.', 'custom-fonts' ), $value, $key );
				?>

						</div>
					</div>
					<!-- Repeater Remove Btn -->
					<div class="repeater-remove-btn">
						<div class="button button-primary remove-btn <?php echo esc_attr( 1 < self::$edit_repeater_field_count ? '' : 'disabled' ); ?>">
							Remove
						</div>
					</div>
					<div class="clearfix"></div>
				</div>
				<?php
			} else {
				return;
			}
		}

		/**
		 * Add font fallback field
		 *
		 * @since x.x.x
		 * @param int    $id current term id.
		 * @param string $title font type title.
		 * @param string $description title font type description.
		 * @param string $value title font type meta values.
		 */
		protected function font_new_field( $id, $title, $description, $value = '' ) {
			?>
			<div class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap" >

				<label for="font-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></label>
				<input type="text" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-fonts-link <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ); ?>[<?php echo esc_attr( $id ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
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
		 * @param string $description title font type description.
		 * @param string $value title font type meta values.
		 */
		protected function font_file_new_field( $id, $title, $description, $value = '' ) {
			?>
			<div class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap" >

				<label for="font-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></label>
				<input type="text" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-fonts-link <?php echo esc_attr( $id ); ?>" data-name="<?php echo '[' . esc_attr( $id ) . ']'; ?>" name="bsf_custom_fonts<?php echo '[' . esc_attr( $id ) . ']'; ?>" value="<?php echo esc_attr( $value ); ?>" />
				<a href="#" class="bsf-custom-fonts-upload button" data-upload-type="<?php echo esc_attr( $id ); ?>"><?php esc_html_e( 'Upload', 'custom-fonts' ); ?></a>
				<p><?php echo esc_html( $description ); ?></p>
			</div>
			<?php
		}

		/**
		 * Render select field for the new font screen.
		 *
		 * @param String $id Field ID.
		 * @param String $title Field Title.
		 * @param String $description Field Description.
		 * @param Array  $select_fields Select fields as Array.
		 * @return void
		 */
		protected function select_default_new_field( $id, $title, $description, $select_fields ) {
			?>
			<div class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap" >
				<label for="font-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></label>
				<select type="select" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-font-select-field <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ); ?>[<?php echo esc_attr( $id ); ?>]" />
					<?php
					foreach ( $select_fields as $key => $value ) {
						?>
						<option value="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $value ); ?></option>;
					<?php } ?>
				</select>
			</div>
			<?php
		}

		/**
		 * Select default repeater edit field.
		 *
		 * @since x.x.x
		 *
		 * @param string $id Id of the field.
		 * @param string $title Title of the field.
		 * @param string $description Description of the field.
		 * @param array  $select_fields Select - all options array.
		 * @param string $selected Key for selected field.
		 */
		protected function select_default_edit_field( $id, $title, $description, $select_fields, $selected ) {
			?>
			<tr class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap" >
				<th><label for="font-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></label></th>
				<td>
				<select type="select" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-font-select-field <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ); ?>[<?php echo esc_attr( $id ); ?>]" />
					<?php
					foreach ( $select_fields as $key => $value ) {
						?>
						<option value="<?php echo esc_attr( $key ); ?>" <?php echo ( $key == $selected ) ? ' selected="selected"' : ''; ?> ><?php echo esc_html( $value ); ?></option>;
					<?php } ?>
				</select>
				<td>
			</tr>
			<?php
		}

		/**
		 * Render select field for the new font screen.
		 *
		 * @param string $id Field ID.
		 * @param string $title Field Title.
		 * @param string $description Field Description.
		 * @param array  $select_fields Select fields as Array.
		 * @param string $selected_value Selected field.
		 * @return void
		 */
		protected function select_new_field( $id, $title, $description, $select_fields, $selected_value = '' ) {
			?>
			<div class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap" >
				<label for="font-<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $title ); ?></label>
				<select type="select" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-font-select-field <?php echo esc_attr( $id ); ?>" data-name="<?php echo '[' . esc_attr( $id ) . ']'; ?>" name="bsf_custom_fonts<?php echo '[' . esc_attr( $id ) . ']'; ?>" />
					<?php
					foreach ( $select_fields as $key => $value ) {
						?>
						<option value="<?php echo esc_attr( $key ); ?>" <?php echo $selected_value == $key ? 'selected="selected"' : ''; ?>><?php echo esc_html( $value ); ?></option>
					<?php } ?>
				</select>
			</div>
			<?php
		}

		/**
		 * Render select field for the edit font screen.
		 *
		 * @param String $id Field ID.
		 * @param String $title Field Title.
		 * @param String $description Field Description.
		 * @param Array  $select_fields Select fields as Array.
		 * @param String $saved_val Field Value.
		 * @return void
		 */
		private function select_edit_field( $id, $title, $description, $select_fields, $saved_val = '' ) {
			?>
			<tr class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap ">
				<th scope="row">
					<label for="metadata-<?php echo esc_attr( $id ); ?>">
						<?php echo esc_html( $title ); ?>
					</label>
				</th>
				<td>
				<select type="select" id="font-<?php echo esc_attr( $id ); ?>" class="bsf-custom-font-select-field <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ); ?>[<?php echo esc_attr( $id ); ?>]" />
					<?php
					foreach ( $select_fields as $key => $value ) {
						?>
						<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $key, $saved_val ); ?>><?php echo esc_html( $value ); ?></option>;
					<?php } ?>
				</select>
					<p><?php echo esc_html( $description ); ?></p>
				</td>
			</tr>
			<?php
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
		protected function font_edit_field( $id, $title, $description, $value = '' ) {
			?>
			<tr class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap ">
				<th scope="row">
					<label for="metadata-<?php echo esc_attr( $id ); ?>">
						<?php echo esc_html( $title ); ?>
					</label>
				</th>
				<td>
					<input id="metadata-<?php echo esc_attr( $id ); ?>" type="text" class="bsf-custom-fonts-link <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ); ?>[<?php echo esc_attr( $id ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
					<p><?php echo esc_html( $description ); ?></p>
				</td>
			</tr>
			<?php
		}

		/**
		 * Add Taxonomy data field
		 *
		 * @since x.x.x
		 * @param int    $id current term id.
		 * @param string $title font type title.
		 * @param string $description title font type description.
		 * @param string $value title font type meta values.
		 * @param string $key key as the part of name of the fields.
		 */
		protected function font_file_edit_field( $id, $title, $description, $value, $key ) {
			?>
			<div class="bsf-custom-fonts-file-wrap form-field term-<?php echo esc_attr( $id ); ?>-wrap ">
				<div scope="row">
					<label for="metadata-<?php echo esc_attr( $id ); ?>">
						<?php echo esc_html( $title ); ?>
					</label>
				</div>
				<div>
					<input id="metadata-<?php echo esc_attr( $id ); ?>" type="text" class="bsf-custom-fonts-link <?php echo esc_attr( $id ); ?>" name="<?php echo esc_attr( Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ); ?>[<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $value ); ?>" />
					<a href="#" class="bsf-custom-fonts-upload button" data-upload-type="<?php echo esc_attr( $id ); ?>"><?php esc_html_e( 'Upload', 'custom-fonts' ); ?></a>
					<p><?php echo esc_html( $description ); ?></p>
				</div>
			</div>
			<?php
		}

		/**
		 * Save Taxonomy meta data value
		 *
		 * @since 1.0.0
		 * @param int $term_id current term id.
		 */
		public function save_metadata( $term_id ) {
			// Verify the nonce for both Add and Edit font save data.
			if ( ! isset( $_POST['bsf_custom_font_nonce'] ) || ! wp_verify_nonce( $_POST['bsf_custom_font_nonce'], basename( __FILE__ ) ) ) {
				return;
			}

			if ( isset( $_POST[ Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ] ) ) {
				$value = $_POST[ Bsf_Custom_Fonts_Taxonomy::$register_taxonomy_slug ];
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
			$mimes['otf']   = 'font/otf';

			return $mimes;
		}

		/**
		 * Correct the mome types and extension for the font types.
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

	}

	/**
	 *  Kicking this off by calling 'get_instance()' method
	 */
	Bsf_Custom_Fonts_Admin::get_instance();

endif;
