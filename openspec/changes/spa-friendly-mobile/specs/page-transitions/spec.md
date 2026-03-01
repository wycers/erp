## ADDED Requirements

### Requirement: Page transition animation on navigation
The system SHALL display a smooth visual transition when navigating between pages using the View Transitions API.

#### Scenario: Forward navigation shows slide-in animation
- **WHEN** user navigates from materials page to products page
- **THEN** the new page content slides in from the right while the old content fades out

#### Scenario: Back navigation shows slide-out animation
- **WHEN** user navigates back from products page to materials page
- **THEN** the new page content slides in from the left while the old content fades out

### Requirement: Graceful degradation for unsupported browsers
The system SHALL function normally without animations in browsers that do not support View Transitions API.

#### Scenario: Browser without View Transitions support
- **WHEN** user navigates pages on a browser without View Transitions support
- **THEN** navigation works normally with instant page swap (no animation, no error)

### Requirement: Transition respects reduced motion preference
The system SHALL disable animations when user has enabled "reduce motion" in their OS accessibility settings.

#### Scenario: Reduced motion preference enabled
- **WHEN** user has prefers-reduced-motion media query active
- **THEN** page transitions complete instantly without animation

### Requirement: Transition does not block interaction
The system SHALL ensure that page transitions do not prevent user interaction during the animation.

#### Scenario: User can interact during transition
- **WHEN** page transition animation is in progress
- **THEN** user can still scroll, click links, or interact with visible elements

### Requirement: Consistent transition duration
Page transitions SHALL complete within 300ms to maintain responsive feel.

#### Scenario: Transition duration is bounded
- **WHEN** any page navigation triggers a transition
- **THEN** the transition animation completes within 300 milliseconds
