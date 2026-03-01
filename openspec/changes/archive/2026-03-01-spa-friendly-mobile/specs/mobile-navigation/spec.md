## ADDED Requirements

### Requirement: Bottom tab bar navigation on mobile
The system SHALL display a fixed bottom tab bar navigation when viewport width is below 768px (md breakpoint).

#### Scenario: Mobile viewport shows bottom navigation
- **WHEN** user views the ERP system on a device with viewport width < 768px
- **THEN** a fixed bottom tab bar is displayed with navigation icons

#### Scenario: Desktop viewport hides bottom navigation
- **WHEN** user views the ERP system on a device with viewport width >= 768px
- **THEN** the bottom tab bar is hidden and desktop navigation is shown instead

### Requirement: Tab bar displays core modules
The bottom tab bar SHALL display navigation icons for the core ERP modules: 总览 (Overview), 原料 (Materials), 成品 (Products), 进货 (Purchases), 更多 (More).

#### Scenario: Tab bar shows five main icons
- **WHEN** user views the bottom tab bar on mobile
- **THEN** five icons are displayed: 总览, 原料, 成品, 进货, 更多

#### Scenario: More menu shows additional modules
- **WHEN** user taps the "更多" (More) icon
- **THEN** a popup menu displays links to: 生产 (Production), 销售 (Sales), 库存 (Inventory)

### Requirement: Current page indicator
The bottom tab bar SHALL visually highlight the currently active navigation item.

#### Scenario: Active tab is highlighted
- **WHEN** user is on the materials page (/erp/materials)
- **THEN** the "原料" tab icon is visually highlighted (different color/style)

#### Scenario: More menu items show active state
- **WHEN** user is on the production page (/erp/production)
- **THEN** the "更多" tab is highlighted, and when opened, the "生产" option shows active state

### Requirement: Navigation triggers client-side routing
Tapping a tab bar item SHALL trigger SvelteKit client-side navigation without full page reload.

#### Scenario: Tab navigation uses client-side routing
- **WHEN** user taps the "成品" tab icon
- **THEN** the URL changes to /erp/products and page content updates without full browser reload

### Requirement: Tab bar safe area handling
The bottom tab bar SHALL account for device safe areas (e.g., iPhone home indicator area).

#### Scenario: Safe area padding on iOS devices
- **WHEN** user views the app on an iOS device with home indicator
- **THEN** the tab bar has additional bottom padding to avoid overlap with the home indicator
