<?php
/**
 * White Label Form
 *
 * @package Bsf_Custom_Fonts
 */

?>
<li>
	<div class="branding-form postbox">
		<button type="button" class="handlediv button-link" aria-expanded="true">
			<span class="screen-reader-text"><?php _e( 'Custom Fonts Branding', 'custom-fonts' ); ?></span>
			<span class="toggle-indicator" aria-hidden="true"></span>
		</button>

		<h2 class="hndle ui-sortable-handle">
			<span><?php _e( 'Custom Fonts Branding', 'custom-fonts' ); ?></span>
		</h2>

		<div class="inside">
			<div class="form-wrap">
				<div class="form-field">
					<label><?php _e( 'Plugin Name:', 'custom-fonts' ); ?>
						<input type="text" name="ast_white_label[bsf-custom-fonts][name]" class="placeholder placeholder-active" value="<?php echo esc_attr( $settings['bsf-custom-fonts']['name'] ); ?>">
					</label>
				</div>
				<div class="form-field">
					<label><?php _e( 'Plugin Description:', 'custom-fonts' ); ?>
						<textarea name="ast_white_label[bsf-custom-fonts][description]" class="placeholder placeholder-active" rows="2"><?php echo esc_attr( $settings['bsf-custom-fonts']['description'] ); ?></textarea>
					</label>
				</div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
</li>
