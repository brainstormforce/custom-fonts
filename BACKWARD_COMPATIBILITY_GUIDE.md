# Custom Fonts Backward Compatibility System

This document explains how to use the enhanced backward compatibility system implemented in the Custom Fonts plugin, similar to the Astra theme's approach.

## Overview

The backward compatibility system ensures that when the plugin is updated, existing sites maintain their functionality while new sites get the latest default settings. This is achieved through a version-based migration system.

## Architecture

### Core Files

1. **`includes/class-custom-fonts-background-updater.php`** - Main controller class
2. **`includes/custom-fonts-update-functions.php`** - Migration functions for each version
3. **`includes/class-custom-fonts-wp-background-process.php`** - Background process implementation
4. **`includes/lib/batch-processing/`** - Background processing library

### Key Components

- **Version Registry**: `$db_updates` array maps version numbers to migration functions
- **Background Processing**: Non-blocking updates using WordPress cron
- **Fallback Mode**: Direct execution if cron fails
- **Settings Management**: Centralized option handling

## How It Works

### 1. Version Detection
```php
// Checks if updates are needed
private function needs_db_update() {
    $current_version = get_option( 'custom_fonts_db_version', null );
    $updates = $this->get_db_update_callbacks();
    
    $latest_version = array_keys( $updates );
    $latest = $latest_version[ count( $latest_version ) - 1 ];
    
    return version_compare( $current_version, $latest, '<' );
}
```

### 2. Update Processing
- Loops through all versions newer than current saved version
- Executes migration functions sequentially
- Uses background queue for non-blocking updates
- Falls back to direct execution if cron fails

### 3. Migration Functions
Each version has its own migration function:
```php
function custom_fonts_background_updater_2_2_0() {
    $settings = get_option( 'custom_fonts_settings', array() );
    
    // Set new defaults for existing installations
    if ( ! isset( $settings['enable_font_optimization'] ) ) {
        $settings['enable_font_optimization'] = true;
        update_option( 'custom_fonts_settings', $settings );
    }
}
```

## Adding New Migration Logic

### Step 1: Add Version to Registry
In `class-custom-fonts-background-updater.php`, add your version to the `$db_updates` array:

```php
private static $db_updates = array(
    '2.1.16' => array(
        'custom_fonts_background_updater_2_1_16',
    ),
    '2.2.0'  => array(
        'custom_fonts_background_updater_2_2_0',
    ),
    '2.3.0'  => array( // Your new version
        'custom_fonts_background_updater_2_3_0',
    ),
);
```

### Step 2: Create Migration Function
In `custom-fonts-update-functions.php`, add your migration function:

```php
/**
 * Custom Fonts Background Updater 2.3.0
 *
 * Description of what this migration does.
 *
 * @since 2.3.0
 * @return void
 */
function custom_fonts_background_updater_2_3_0() {
    $settings = get_option( 'custom_fonts_settings', array() );

    // Example: Set new feature defaults for existing installations
    if ( ! isset( $settings['new_feature_enabled'] ) ) {
        $settings['new_feature_enabled'] = false; // Conservative default for existing sites
        update_option( 'custom_fonts_settings', $settings );
    }

    // Example: Migrate font posts if needed
    $font_posts = get_posts(
        array(
            'post_type'      => BSF_CUSTOM_FONTS_POST_TYPE,
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        )
    );

    if ( ! empty( $font_posts ) ) {
        foreach ( $font_posts as $font_post ) {
            $font_id = $font_post->ID;
            
            // Add new meta field with backward compatible default
            if ( ! get_post_meta( $font_id, 'new_font_property', true ) ) {
                update_post_meta( $font_id, 'new_font_property', 'default_value' );
            }
        }
    }
}
```

### Step 3: Update Plugin Version
Update the version constant in `custom-fonts.php`:

```php
define( 'BSF_CUSTOM_FONTS_VER', '2.3.0' );
```

## Helper Functions

### Get Plugin Option
```php
$value = custom_fonts_get_option( 'setting_key', 'default_value' );
```

### Update Plugin Option
```php
custom_fonts_update_option( 'setting_key', 'new_value' );
```

### Delete Plugin Option
```php
custom_fonts_delete_option( 'setting_key' );
```

## Best Practices

### 1. Conservative Defaults
Always set conservative defaults for existing installations to prevent breaking changes:
```php
// Good: Conservative default for existing sites
$settings['new_aggressive_feature'] = false;

// Bad: Could break existing sites
$settings['new_aggressive_feature'] = true;
```

### 2. Check Before Setting
Always check if a setting already exists before setting it:
```php
// Good: Respects existing user settings
if ( ! isset( $settings['feature_enabled'] ) ) {
    $settings['feature_enabled'] = false;
}

// Bad: Overwrites user settings
$settings['feature_enabled'] = false;
```

### 3. Batch Operations
For large datasets, consider using batch processing:
```php
function custom_fonts_background_updater_2_3_0() {
    // Process fonts in batches to avoid timeouts
    $font_posts = get_posts( array(
        'post_type'      => BSF_CUSTOM_FONTS_POST_TYPE,
        'posts_per_page' => 50, // Process in smaller batches
        'post_status'    => 'publish',
    ) );
    
    // Process batch...
}
```

### 4. Error Handling
Include proper error handling in migration functions:
```php
function custom_fonts_background_updater_2_3_0() {
    try {
        // Migration logic here
        
    } catch ( Exception $e ) {
        error_log( 'Custom Fonts Migration 2.3.0 Error: ' . $e->getMessage() );
        // Handle gracefully - don't break the site
    }
}
```

## Hooks Available

### Before Update
```php
add_action( 'custom_fonts_update_before', 'your_function' );
```

### After Update
```php
add_action( 'custom_fonts_update_after', 'your_function' );
```

### Update Initiated
```php
add_action( 'custom_fonts_update_initiated', 'your_function' );
```

## Troubleshooting

### Check Current Version
```php
$current_version = get_option( 'custom_fonts_db_version' );
echo 'Current DB Version: ' . $current_version;
```

### Check Queue Status
```php
$is_running = custom_fonts_get_option( 'is_fonts_queue_running', false );
echo 'Queue Running: ' . ( $is_running ? 'Yes' : 'No' );
```

### Force Migration
```php
// Delete version to force re-migration (use carefully!)
delete_option( 'custom_fonts_db_version' );
```

### Debug Mode
To debug migration issues, add this to wp-config.php:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
```

## Migration Examples

### Example 1: Adding New Default Setting
```php
function custom_fonts_background_updater_2_4_0() {
    $settings = get_option( 'custom_fonts_settings', array() );
    
    if ( ! isset( $settings['enable_font_caching'] ) ) {
        $settings['enable_font_caching'] = true;
        update_option( 'custom_fonts_settings', $settings );
    }
}
```

### Example 2: Font Meta Migration
```php
function custom_fonts_background_updater_2_5_0() {
    $fonts = get_posts( array(
        'post_type'      => BSF_CUSTOM_FONTS_POST_TYPE,
        'posts_per_page' => -1,
    ) );
    
    foreach ( $fonts as $font ) {
        $font_data = get_post_meta( $font->ID, 'fonts-data', true );
        
        // Add new performance metadata
        if ( ! get_post_meta( $font->ID, 'font_performance_score', true ) ) {
            update_post_meta( $font->ID, 'font_performance_score', 85 );
        }
    }
}
```

This system ensures smooth updates while maintaining backward compatibility and protecting existing user configurations.