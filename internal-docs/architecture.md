# Architecture — Custom Fonts

## Overview

Custom Fonts is a WordPress plugin that follows standard WordPress plugin architecture patterns.

## Entry Point

The plugin entry point is `custom-fonts.php`, which:
1. Defines plugin constants (version, file path, base name, directory, URI)
2. Loads the main plugin class via a WordPress hook (`after_setup_theme` or `plugins_loaded`)

## Request Lifecycle

1. WordPress loads the plugin via `custom-fonts.php`
2. Constants are defined for use throughout the plugin
3. Main class is instantiated/loaded on the appropriate hook
4. Classes register their own hooks and filters
5. Frontend/admin output is rendered when WordPress fires the relevant hooks

## Key Patterns

- **Hook-based architecture:** All functionality is attached via `add_action()` and `add_filter()`
- **Class autoloading:** Classes are loaded via `require_once` in the main plugin file or loader class
- **Separation of concerns:** Admin and frontend code are separated into different classes/directories
- **WordPress Customizer integration:** Settings are registered via the Customizer API where applicable

## Dependencies

- WordPress core (required)
- Astra theme (recommended/required for full functionality)
- No external PHP dependencies beyond WordPress
