# Custom Fonts Backward Compatibility - Simple Guide

Simple backward compatibility system following Astra's approach - just set a flag and check it.

## How It Works

### Step 1: Add Migration Function
In `custom-fonts-update-functions.php`:

```php
/**
 * Background updater function for plugin v2.2.1
 *
 * @since 2.2.1
 * @return void
 */
function custom_fonts_background_updater_2_2_1() {
    $plugin_options = get_option( 'custom_fonts_settings', array() );

    // Set font key sanitization backward compatibility flag.
    if ( ! isset( $plugin_options['font-key-compat'] ) ) {
        $plugin_options['font-key-compat'] = false;
        update_option( 'custom_fonts_settings', $plugin_options );
    }
}
```

### Step 2: Add Version to Registry
In `class-custom-fonts-background-updater.php`:

```php
private static $db_updates = array(
    '2.2.1'  => array(
        'custom_fonts_background_updater_2_2_1',
    ),
);
```

### Step 3: Create Compatibility Check Function
In `custom-fonts-update-functions.php`:

```php
/**
 * Check if the font key backward compatibility is enabled.
 *
 * @return bool true|false.
 * @since 2.2.1
 */
function custom_fonts_font_key_compatibility() {
    $plugin_settings = get_option( 'custom_fonts_settings', array() );
    return apply_filters( 'custom_fonts_get_option_font-key-compat', isset( $plugin_settings['font-key-compat'] ) ? false : true );
}
```

### Step 4: Use in Code
In your functions, check the compatibility flag:

```php
// Use backward compatible method or new method based on flag
if ( function_exists( 'custom_fonts_font_key_compatibility' ) && custom_fonts_font_key_compatibility() ) {
    // Use old method for existing sites
    $font_family_key = sanitize_key( strtolower( str_replace( ' ', '-', $font_family ) ) );
} else {
    // Use new method for new sites  
    $font_family_key = strtolower( str_replace( ' ', '-', $font_family ) );
    $font_family_key = preg_replace( '/[^a-z0-9\-]/', '', $font_family_key );
}
```

## Logic:

1. **Existing sites**: Key doesn't exist → `Custom_Fonts_Compatibility::font_key_compatibility()` returns `true` → Use **old method**
2. **New sites**: Key exists and is `false` → `Custom_Fonts_Compatibility::font_key_compatibility()` returns `false` → Use **new method**

## How Old Users Can Get New Features:

### Via Filter Hook
Add this to your theme's functions.php or plugin:

```php
add_filter( 'custom_fonts_get_option_font-key-compat', '__return_false' );
```

This will enable the new font key method for existing sites.

That's it! Simple flag-based backward compatibility just like Astra, with easy upgrade path for existing users.