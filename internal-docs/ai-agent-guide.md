# AI Agent Guide — Custom Fonts

## Quick Start for AI Agents

1. **Entry point:** Start at `custom-fonts.php` to understand plugin initialization
2. **Constants:** Look for `define()` calls in the main file for paths and versions
3. **Hook registration:** Search for `add_action` and `add_filter` to find where functionality is attached
4. **Text domain:** Use `custom-fonts` for all translatable strings

## Common Tasks

### Adding a new feature
1. Create a new class file in the appropriate directory
2. Register it via `require_once` in the loader or main class
3. Use `add_action`/`add_filter` to hook into WordPress
4. Follow existing class patterns for consistency

### Modifying existing behavior
1. Find the relevant class by searching for the hook or function name
2. Check for filters that allow modification without editing core files
3. If editing, maintain the existing code style and patterns

### Adding translatable strings
1. Wrap strings in `__( 'text', 'custom-fonts' )` or `esc_html__( 'text', 'custom-fonts' )`
2. Run `npx grunt i18n` to update the POT file

## WordPress Checklist

- [ ] All output is escaped (`esc_html`, `esc_attr`, `esc_url`, `wp_kses`)
- [ ] All input is sanitized (`sanitize_text_field`, `absint`, etc.)
- [ ] Nonces used for forms and AJAX (`wp_nonce_field`, `check_ajax_referer`)
- [ ] Capability checks before privileged operations (`current_user_can`)
- [ ] Text domain `custom-fonts` used for all user-facing strings
- [ ] No direct file access (files start with `defined( 'ABSPATH' )` check or silence)

## Pitfalls

- Plugin may depend on Astra theme being active — check for theme dependency logic
- Constants are defined only once — don't redefine them
- Follow WordPress coding standards (spaces not tabs for alignment, tabs for indentation)
