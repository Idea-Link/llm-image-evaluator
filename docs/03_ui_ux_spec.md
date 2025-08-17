# AI Prompt Evaluation Platform UI/UX Specification

### 1. Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the AI Prompt Evaluation Platform's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

#### Overall UX Goals & Principles

- **Usability Goals**
    
    - **Efficiency**: The user should be able to set up a new evaluation for an existing Test Set in under 90 seconds.
        
    - **Clarity**: The results page must be instantly understandable, with a clear, unambiguous accuracy score and an easy way to identify failed cases.
        
    - **Confidence**: The user must feel confident that the results are accurate and that they can take decisive action based on the data presented.
        
- **Design Principles**
    
    1. **Data First, Decoration Second**: Prioritize clear information display over aesthetic flourishes.
        
    2. **Efficiency in Every Click**: Relentlessly optimize workflows to minimize steps and user effort.
        
    3. **Unambiguous Feedback**: Every user action, especially triggering a background process, must provide clear, immediate, and persistent feedback on its status.
### 2. Information Architecture (IA)

#### Site Map / Screen Inventory

Code snippet

```
graph TD
    subgraph "Authenticated App"
        B(Dashboard: Evaluations List) --> C(Evaluation Setup Page);
        B --> D(Evaluation Results Page);
        B --> E(Test Set Management Page);
        E --> C(Select Test Set);
    end

    A[Login Page - Admin Authentication] --> B;
```

#### Navigation Structure

- **Primary Navigation**: A persistent header will be visible on all pages after login. It will contain main navigation links for "Evaluations" (the Dashboard) and "Test Sets".
    
- **Secondary Actions**: Key actions like "New Evaluation" or "New Test Set" will be presented as prominent buttons on their respective list pages.
    
- **Breadcrumbs**: We will use breadcrumbs on nested pages (like editing a Test Set or viewing results) to help the user understand where they are, e.g., `Home > Test Sets > Edit: My Test Set`.

### 3. User Flows

#### Flow: Create and Manage a Test Set

**User Goal**: To create, review, and maintain a reusable set of ground truth criteria for evaluations.

**Entry Points**: Clicking the "Test Sets" link in the primary navigation; Clicking the "Create New Test Set" button.

**Success Criteria**: A new or updated Test Set is successfully saved and available for use in evaluations. A deleted Test Set is no longer visible or available.

**Flow Diagram**

Code snippet


graph TD
    A(Start on any page) --> B(Click 'Test Sets' Nav Link);
    B --> C[View Test Set List Page];
    C --> D(Click 'New Test Set' Button);
    D --> E[Fill out Form: Name, Desc, Categories];
    E --> F{Click Save};
    F -- Success --> G[Return to List Page, New Set is Visible];
    F -- Validation Error --> E;
    C --> H(Click 'Edit' on an Existing Set);
    H --> I[View/Edit Form, Pre-filled];
    I --> J{Click Save Changes};
    J -- Success --> K[Return to List Page, Set is Updated];
    C --> L(Click 'Delete' on an Existing Set);
    L --> M[Show Confirmation Dialog];
    M -- Confirm --> N[Set is Deleted, Return to List];
    M -- Cancel --> C;


**Edge Cases & Error Handling**

- What happens if the user tries to save a Test Set with a blank name? (A validation error should appear).
    
- What happens if the user tries to delete a Test Set that is currently being used by one or more Evaluations? (The system should prevent deletion and provide an informative message).
    
- How does the UI handle a Test Set with a very large number of categories? (The list should be scrollable).

#### Flow: Run a New Evaluation and View Results

**User Goal**: To test a specific prompt against a predefined Test Set and analyze its performance.

**Entry Points**: Clicking the "New Evaluation" button from the Dashboard.

**Success Criteria**: A new evaluation is successfully executed and scored, and the user can view a detailed, understandable results report.

#### Flow: Run a New Evaluation and View Results (Revised)

**User Goal**: To test a specific prompt (containing text and/or images) against a predefined Test Set and analyze its performance.

**Flow Diagram**

Code snippet

```
graph TD
    A(Start on Dashboard) --> B(Click 'New Evaluation' Button);
    B --> C[Arrive on Evaluation Setup Page];
    C --> D(Select a pre-made Test Set);
    D --> E(Compose System Prompt with text and optional images);
    E --> F(Select the AI Model);
    F --> G{Click 'Run Evaluation'};
    G -- API Call Sent --> H[Redirected to Dashboard];
    H --> I(New evaluation appears in list with 'In Progress' status);
    I --> J(User waits for job to complete);
    J --> K(Status on dashboard updates to 'Completed');
    K --> L{User clicks on the completed run};
    L --> M[View Detailed Results Page];
    M --> N(User analyzes overall score and individual results);
```
**Edge Cases & Error Handling**

- What if the user navigates to the Setup Page but has no Test Sets created yet? (The "Select Test Set" control should be disabled, with a clear message and a link to create one).
    
- What happens if the backend job fails during the run? (The status on the Dashboard should change to "Failed", and clicking it should show any available error information).

### 4. Wireframes & mockups
#### Key Screen Layout: Evaluation Setup Page

- **Purpose**: To configure all parameters for a new evaluation run in a clear, single view.
    
- **Proposed Layout**: I envision a two-column layout to separate configuration from the creative task of prompt writing.
    
    - **Left Column (Configuration Settings):**
        
        - An input field for the **"Evaluation Name"**.
            
        - A dropdown menu to select an existing **"Test Set"**.
            
        - A button right next to it to **"Create New Test Set"** (this would open a modal/popup to avoid leaving the page).
            
        - A dropdown menu to select the **"AI Model"**.
            
        - A large, prominent **"Run Evaluation"** button at the bottom that becomes active once all required fields are filled.
            
    - **Right Column (Prompt Composition):**
        
        - This area would be dominated by a large, advanced input component for the **"System Prompt"**.
            
        - This component must allow for both typing text and uploading one or more images.
            
- **Interaction Notes**: This layout helps the user focus. They can set up the configuration on the left, then dedicate their attention to the larger right-hand panel to compose their multi-modal prompt.

#### Key Screen Layout: Evaluation Results Page

- **Purpose**: To display the outcome of an evaluation run, providing both a high-level summary and detailed, item-by-item results for analysis.
    
- **Proposed Layout**: A top-down structure with the summary first, followed by the detailed breakdown.
    
    - **Summary Header (Top of Page):**
        
        - A large, prominent display of the overall **Accuracy Score** (e.g., a big "87% Success" graphic).
            
        - A summary of the evaluation's configuration:
            
            - Evaluation Name
                
            - Test Set Used
                
            - AI Model Used
                
            - The full System Prompt that was tested (perhaps in a collapsible section).
                
    - **Filtering Controls:**
        
        - Simple buttons or tabs directly above the results list to filter the view. The most important one would be **"Show Only Failures"**. Other options could be "Show All" and "Show Only Passes."
            
    - **Results Table:**
        
        - A detailed table with a row for each item in the Test Set.
            
        - Columns would include:
            
            - **Input**: The original input (e.g., the image).
                
            - **Ground Truth**: The expected category.
                
            - **LLM Output**: The actual output from the model.
                
            - **Status**: A very clear icon or tag for **Pass / Fail**.
                
- **Interaction Notes**: The most common user action will be to immediately filter for failures. This allows them to disregard the successful outputs and focus their attention on analyzing the prompt's weaknesses.

### 5. Component Library / Design System

#### Design System Approach

Our approach will be to leverage **Shadcn UI** as the foundation for our component library. We will not build a new design system from scratch. Instead, we will use Shadcn's unstyled, accessible components and apply our own minimal, professional styling to them. This provides maximum flexibility and development speed while ensuring a high-quality user experience.

#### Core Components

Based on the layouts we've designed, we will immediately need to implement and style the following core components from the Shadcn library:

- **Button**: For all primary actions (`Run Evaluation`, `Save`, `Create New`) and secondary actions (`Cancel`, `Edit`).
    
- **Input**: For text fields like "Evaluation Name" and "Category Name".
    
- **Table**: For displaying the lists of Evaluations, Test Sets, and the detailed breakdown on the Results Page.
    
- **Select (Dropdown)**: For choosing a Test Set and AI Model during evaluation setup.
    
- **Dialog (Modal)**: For confirmation prompts (e.g., "Are you sure you want to delete?") and potentially for creating a new Test Set without leaving the current page.
    
- **Badge**: To display status indicators like `Pass`/`Fail` and `In Progress`.
    
- **Textarea**: As a potential base for the text-entry part of the system prompt composer.

### 6. Branding & Style Guide

#### Visual Identity

- **Brand Guidelines**: No pre-existing brand guidelines. The style defined below will serve as the visual identity for the application.
    

#### Color Palette

I propose a modern, dark-theme-first palette that is easy on the eyes and provides excellent contrast.

|Color Type|Hex Code|Usage|
|---|---|---|
|Primary|`#3B82F6` (Blue)|Primary buttons, links, active states|
|Secondary|`#64748B` (Slate)|Secondary text, borders, disabled states|
|Accent|`#10B981` (Emerald)|Highlights, special callouts|
|Success|`#22C55E` (Green)|Positive feedback, confirmations|
|Warning|`#F59E0B` (Amber)|Cautions, important notices|
|Error|`#EF4444` (Red)|Errors, destructive actions|
|Neutral|Dark grays, e.g., `#0F172A` (bg), `#1E293B` (card), `#94A3B8` (text)|Text, borders, backgrounds|

#### Typography

- **Font Family**: **Inter**, a clean and highly readable sans-serif font, available from Google Fonts. It's excellent for UI design.
    

|Element|Size|Weight|Line Height|
|---|---|---|---|
|H1|30px|Bold|36px|
|H2|24px|Bold|32px|
|H3|20px|Semi-Bold|28px|
|Body|16px|Regular|24px|
|Small|14px|Regular|20px|

Export to Sheets

#### Iconography

- **Icon Library**: **Lucide Icons** (`lucide-react`). This is a beautiful, open-source icon set that is the default for Shadcn and offers over 1000 icons, ensuring we have everything we need.
    
- **Usage Guidelines**: Icons should be used sparingly to support text labels, not replace them, ensuring clarity.
    

#### Spacing & Layout

- **Grid System**: We will use an **8-point grid system**. All spacing, padding, and margins will be in multiples of 8px (8, 16, 24, 32px, etc.). This ensures visual consistency and a harmonious rhythm throughout the application.

### 7. Accessibility Requirements

#### Compliance Target

- **Standard**: The application will conform to the **Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA**.
    

#### Key Requirements

- **Visual**:
    
    - **Color Contrast**: All text must have a contrast ratio of at least 4.5:1 against its background. The color palette we chose was designed with this in mind.
        
    - **Focus Indicators**: All interactive elements (buttons, links, inputs) must have a clear and visible focus indicator (e.g., an outline) when navigated to via a keyboard.
        
    - **Text Sizing**: Users should be able to resize text up to 200% without loss of content or functionality.
        
- **Interaction**:
    
    - **Keyboard Navigation**: The entire application must be navigable and fully operable using only a keyboard. The logical tab order will follow the visual layout.
        
    - **Screen Reader Support**: All interactive components built with Shadcn must be compatible with modern screen readers (like NVDA, VoiceOver, and JAWS).
        
- **Content**:
    
    - **Alternative Text**: All images that convey meaningful information must have descriptive alternative (`alt`) text.
        
    - **Headings**: We will use proper semantic heading structures (H1, H2, H3, etc.) to create a logical and navigable outline for each page.
        
    - **Form Labels**: Every form input will have a clearly associated and descriptive `<label>`.
        

#### Testing Strategy

- We will employ a hybrid testing approach:
    
    1. **Automated Testing**: We'll integrate an automated tool like `axe-core` into our development process to catch common issues.
        
    2. **Manual Testing**: We will perform regular manual checks for keyboard navigation and do a basic screen reader pass-through before releasing major features.

### 8. Responsiveness Strategy

#### Breakpoints

We will use a standard set of breakpoints to control how the layout adapts to different screen sizes.

|Breakpoint|Min Width|Max Width|Target Devices|
|---|---|---|---|
|Mobile|320px|767px|Smartphones (Portrait & Landscape)|
|Tablet|768px|1023px|Tablets (e.g., iPad)|
|Desktop|1024px|1279px|Standard Laptops / Desktops|
|Wide|1280px|-|Large & Widescreen Monitors|

Export to Sheets

#### Adaptation Patterns

- **Layout Changes**: On smaller screens (tablet and mobile), our two-column layouts (like the Evaluation Setup page) will stack into a single vertical column to ensure readability.
    
- **Navigation Changes**: On the smallest screens (mobile), the main header navigation may collapse into a standard "hamburger" menu icon to save space.
    
- **Content Priority**: The primary content and action buttons will always be prioritized and positioned for easy access on any screen size.
    
- **Touch Targets**: On smaller screens, the size of interactive elements like buttons and links will be large enough to be easily tapped.

### 9. Animation & Micro-interactions

#### Motion Principles

Our motion design will be subtle and functional. All animations should serve a clear purpose, such as providing feedback or explaining a state change, without ever slowing down the user's workflow. We will also fully support the `prefers-reduced-motion` accessibility feature for users who disable animations.

#### Key Animations

- **State Changes**: Buttons and interactive elements will have subtle transitions for hover, focus, and active/pressed states to provide clear, immediate feedback.
    
- **Loading Indicators**: When data is being fetched or a background job is running (like an evaluation), we will use clean loading spinners or skeleton loaders to manage user expectation and indicate activity.
    
- **Modal Transitions**: Dialogs and modals will gently fade or scale into view to draw the user's focus without being jarring.
    
- **List Updates**: When a new item is added to a list (like a new evaluation), it can subtly fade in to draw the user's attention to the change.

### 10. Performance Considerations

#### Performance Goals

- **Page Load**: Initial application load and subsequent page navigations should feel nearly instantaneous, aiming for Google's Core Web Vitals (LCP, FID, CLS) to be in the "Good" range.
    
- **Interaction Response**: All UI interactions, such as clicking buttons, typing in fields, or filtering lists, must register and provide visual feedback in under 100 milliseconds.
    
- **Animation Smoothness**: Any animations or transitions should maintain a smooth 60 frames per second to avoid appearing jerky or laggy.
    

#### Design Strategies

- We will leverage the built-in performance optimizations of our chosen framework, Next.js, such as automatic code-splitting.
    
- For any data-fetching operation expected to take longer than 300ms, we will display a loading state (like a spinner or skeleton screen) to manage user expectation.
    
- We will be mindful of asset sizes, especially images, to ensure they are optimized for the web and do not slow down page loads.

