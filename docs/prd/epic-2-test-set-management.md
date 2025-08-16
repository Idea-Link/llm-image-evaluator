# 7. Epic 2: Test Set Management

**Epic Goal**: The objective of this epic is to build the complete lifecycle management for "Test Sets." This will provide the core reusable entity in the platform, allowing a user to define their evaluation criteria (inputs and ground truth categories) once and then reuse them across many different evaluation runs and prompt versions.

---

## Story 2.1: Test Set List Page

**As a** Prompt Engineer, **I want** a dedicated page to view all my saved Test Sets, **so that** I can easily access and manage my evaluation criteria.

**Acceptance Criteria**

1. A navigation link (e.g., "Test Sets") is added to the main application header/layout.
    
2. The "Test Sets" page displays a table or list of all existing Test Sets.
    
3. Each item in the list displays, at a minimum, the Test Set's Name and Description.
    
4. The page includes a prominent "Create New Test Set" button.
    
5. If no Test Sets exist, a clear message and a call-to-action to create one are displayed.
    

---

## Story 2.2: Create New Test Set

**As a** Prompt Engineer, **I want** to create and save a new Test Set with a name, description, and a list of categories, **so that** I can define a new, reusable set of evaluation criteria.

**Acceptance Criteria**

1. Clicking the "Create New Test Set" button navigates to a new page or opens a modal form.
    
2. The form includes text input fields for "Name" and "Description" for the Test Set.
    
3. The form includes a dynamic list editor where the user can define ground truth categories.
    
4. Each category entry in the list editor consists of a "Category Name" (e.g., "A++") and a "Description".
    
5. The user can dynamically add or remove category rows from the list.
    
6. Submitting the form saves the complete Test Set (name, description, and all categories) to the database.
    
7. After a successful save, the user is redirected to the Test Set list page, which now includes the newly created item.
    

---

## Story 2.3: Edit an Existing Test Set

**As a** Prompt Engineer, **I want** to edit the details of an existing Test Set, **so that** I can update and maintain my evaluation criteria over time.

**Acceptance Criteria**

1. The Test Set list provides a clear way to select a Test Set for editing (e.g., an "Edit" button or by clicking the item).
    
2. The edit view is pre-populated with the existing data for the selected Test Set.
    
3. The user can modify the Name, Description, and the list of Categories (including adding, editing, or removing categories).
    
4. Saving the form updates the record in the database with the new information.
    
5. After a successful save, the user is returned to the updated Test Set list.
    

---

## **Story 2.4: Delete a Test Set (Revised)**

**As a** Prompt Engineer, **I want** to delete a Test Set I no longer need, **so that** I can keep my library of evaluation criteria organized.

**Acceptance Criteria (Revised)**

1. A "Delete" button is available on the Test Set list or edit page.
    
2. Clicking the "Delete" button triggers a confirmation prompt (e.g., "Are you sure you want to delete this Test Set?").
    
3. **Upon confirmation, the system checks if the Test Set is used by any evaluations. If it is NOT in use, it is permanently removed from the database.**
    
4. **If the Test Set IS in use, the deletion is prevented, and a clear error message is shown to the user (e.g., "This Test Set cannot be deleted because it is used by 3 evaluations.").**
    
5. After a successful deletion, the user is returned to the Test Set list, where the deleted item is no longer visible.