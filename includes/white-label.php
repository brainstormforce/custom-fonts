<?php
/**
 * White Label Form
 *
 * @package Bsf_Custom_Fonts
 */

?>
<?php
// Bail from displaying settings screen if Astra Pro is older version.
if ( ! is_callable( 'Astra_Ext_White_Label_Markup::branding_key_to_constant' ) ) {
	return;
}
?>
<li>
	<div class="branding-form postbox">
		<button type="button" class="handlediv button-link" aria-expanded="true">
			<span class="screen-reader-text"><?php esc_html_e( 'Custom Fonts Branding', 'custom-fonts' ); ?></span>
			<span class="toggle-indicator" aria-hidden="true"></span>
		</button>

		<h2 class="hndle ui-sortable-handle">
			<span><?php esc_html_e( 'Custom Fonts Branding', 'custom-fonts' ); ?></span>
		</h2>

		<div class="inside">
			<div class="form-wrap">
				<div class="form-field">
					<label><?php esc_html_e( 'Plugin Name:', 'custom-fonts' ); ?>
						<input type="text" name="ast_white_label[bsf-custom-fonts][name]" class="placeholder placeholder-active" <?php disabled( defined( Astra_Ext_White_Label_Markup::branding_key_to_constant( 'bsf-custom-fonts', 'name' ) ), true, true ); ?> value="<?php echo esc_attr( Astra_Ext_White_Label_Markup::get_whitelabel_string( 'bsf-custom-fonts', 'name' ) ); ?>">
					</label>
				</div>
				<div class="form-field">
					<label><?php esc_html_e( 'Plugin Description:', 'custom-fonts' ); ?>
						<textarea name="ast_white_label[bsf-custom-fonts][description]" class="placeholder placeholder-active" <?php disabled( defined( Astra_Ext_White_Label_Markup::branding_key_to_constant( 'bsf-custom-fonts', 'description' ) ), true, true ); ?> rows="2"><?php echo esc_attr( Astra_Ext_White_Label_Markup::get_whitelabel_string( 'astra-sites', 'description' ) ); ?></textarea>
					</label>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</li>
