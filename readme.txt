=== Custom Fonts ===
Contributors: brainstormforce
Donate link: https://www.paypal.me/BrainstormForce
Tags: Beaver Builder, Elementor, Astra, woff2, woff, ttf, svg, eot, otf, Custom Fonts, Font, Typography
Requires at least: 4.4
Tested up to: 5.7
Stable tag: 1.3.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Custom Fonts allows you to add more fonts that extend formatting options in your site.

== Description ==

This plugin helps you easily embed custom fonts files (woff2, woff, ttf, svg, eot, otf) easily in your WordPress website.

Currently, it works with:

* <a href="https://wpastra.com/?utm_source=wp-repo&utm_campaign=custom-fonts&utm_medium=description">Astra Theme</a>
* <a href="https://www.wpbeaverbuilder.com/">Beaver Builder Theme</a>
* <a href="https://www.wpbeaverbuilder.com/">Beaver Builder Plugin</a>
* <a href="https://elementor.com/">Elementor Page Builder</a>

How does it work?

1. Install the plugin
2. Upload the font files in as many formats as possible for best browser compatibility.
3. And done. You will be able to see the fonts added in the settings of Astra / Beaver Builder / Elementor. Please refer screenshots.

If you're not using any of the supported plugins and theme, you can write the custom CSS to apply the fonts.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/custom-fonts` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Appearance -> Custom Fonts -> Add Custom Fonts name, woff2, woff, ttf, eot, otf and svg files.

== Screenshots ==

1. Add new custom font
2. Select your any custom font into the Customizer of Astra Theme


== Changelog ==

= 1.3.2 =
- Fix: JS conflict with Jetpack plugin on admin.

= 1.3.1 =
- Fix: Font not rendered properly when multiple font format files are added for a single font.

= 1.3.0 =
- New: Add multiple font weight to the Custom Fonts.

= 1.2.6 =
- Improvement: PHP 8.0 compatibility.

= 1.2.5 =
- Fix: Font display not added properly.

= 1.2.4 =
- Improvement: Hardened the security of plugin

= 1.2.3 =
- Fix: Fixed compatibility with other plugins with respect to the admin notice.

= 1.2.2 =
- New: Users can now share non-personal usage data to help us test and develop better products. ( https://store.brainstormforce.com/usage-tracking/?utm_source=wp_dashboard&utm_medium=general_settings&utm_campaign=usage_tracking )

= 1.2.1 =
- Improvement: Hardened the security of plugin
- Improvement: Compatibility with latest WordPress PHP_CodeSniffer rules

= 1.2.0 =
- Improvement: Displaying Menu after Astra options Menu.

= 1.1.0 =
- New: Option to select font-display property.

= 1.0.8 =
- New: Now you can also upload otf fonts.
- Fix: ttf fonts not being uploaded in WordPress media library.

= 1.0.7 =
- Fix: Custom Fonts loading the Block Editor breaking styling of the editor.

= 1.0.6 =
- Improvement: Enqueue the custom fonts in the Blocck Editor to correctly prefiew the custom fonts.

= 1.0.5 =
- Fix: JavaScript error in the Firefox browser not allowing to upload any fonts.

= 1.0.4 =
- New: Added compatibility with Beaver Builder Theme, Beaver Builder Plugin and Elementor.

= 1.0.3 =
- Fix: When two custom fonts are loaded on a site, only one of the fonts will be actually enqueued.

= 1.0.2 =
- White Label support added from the [Astra Pro](https://wpastra.com/pro/) plugin.

= 1.0.1 =
- Improved the design of the Admin UI.
- Changed the plugin name to be Custom Fonts instead of BSF Custom Fonts.

= 1.0.0 =
- Initial release.
