## ADDED Requirements

### Requirement: Top loading bar during navigation
The system SHALL display a thin progress bar at the top of the viewport during page navigation.

#### Scenario: Loading bar appears on navigation start
- **WHEN** user initiates navigation to a new page
- **THEN** a thin progress bar appears at the top of the viewport and animates

#### Scenario: Loading bar disappears on navigation complete
- **WHEN** page navigation completes and new content is rendered
- **THEN** the loading bar completes its animation and fades out

### Requirement: Loading bar color matches brand
The loading bar SHALL use the primary brand color for visual consistency.

#### Scenario: Loading bar uses primary color
- **WHEN** loading bar is displayed
- **THEN** the bar color matches the application's primary theme color

### Requirement: Skeleton component for content placeholders
The system SHALL provide a skeleton component that displays animated placeholder shapes while content loads.

#### Scenario: Skeleton displays loading animation
- **WHEN** skeleton component is rendered
- **THEN** it displays a pulsing/shimmering animation to indicate loading state

#### Scenario: Skeleton matches content layout
- **WHEN** skeleton is used as placeholder for a card component
- **THEN** the skeleton shape approximates the dimensions of the actual card

### Requirement: Skeleton variants for common patterns
The system SHALL provide pre-built skeleton variants for cards, list items, and text blocks.

#### Scenario: Card skeleton available
- **WHEN** developer needs a loading placeholder for a card
- **THEN** a SkeletonCard component is available that renders a card-shaped skeleton

#### Scenario: List skeleton available
- **WHEN** developer needs a loading placeholder for a list
- **THEN** a SkeletonList component is available that renders multiple row-shaped skeletons

### Requirement: Loading state persists during slow navigation
The loading indicators SHALL remain visible for minimum 200ms to avoid flash on fast navigations.

#### Scenario: Minimum display duration
- **WHEN** navigation completes in under 200ms
- **THEN** loading bar still displays for at least 200ms to avoid jarring flash
