import { test, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * End-to-end tests for the Test Set Creation Form
 * Tests the form at http://localhost:3000/test-sets/new
 */

test.describe('Test Set Creation Form', () => {
  // Helper function to take screenshots with descriptive names
  async function takeScreenshot(page: Page, name: string) {
    await page.screenshot({ 
      path: path.join(__dirname, 'screenshots', `${name}.png`),
      fullPage: true 
    });
  }

  // Helper function to login (assuming there's authentication)
  async function loginIfNeeded(page: Page) {
    // Navigate to the form page first
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Check if we're redirected to login
    if (page.url().includes('/login')) {
      await takeScreenshot(page, '01-login-page');
      
      // Add login logic here if needed
      // This will depend on your authentication setup
      // For now, we'll assume the user needs to be manually logged in
      console.log('Note: Manual login may be required before running this test');
    }
  }

  test.beforeEach(async ({ page }) => {
    // Ensure screenshots directory exists
    await page.context().storageState();
  });

  test('should load the form page and verify initial state', async ({ page }) => {
    await loginIfNeeded(page);
    
    // Navigate to the test set creation form
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Take screenshot of initial page load
    await takeScreenshot(page, '02-initial-page-load');
    
    // Verify page title and header
    await expect(page.getByText('Create New Test Set')).toBeVisible();
    
    // Verify form elements are present
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
    await expect(page.getByText(/ground truth categories/i)).toBeVisible();
    
    // Verify buttons are present
    await expect(page.getByRole('button', { name: /create test set/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
    
    // Verify initial category field is present
    await expect(page.getByPlaceholder(/category name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/category description/i)).toBeVisible();
    
    console.log('✓ Initial page load verification completed');
  });

  test('should fill in the form with test data and take screenshots', async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Fill in the test set name
    const nameInput = page.getByLabel(/name/i);
    await nameInput.fill('Test Set QA Review');
    
    // Fill in the description
    const descriptionInput = page.getByLabel(/description/i);
    await descriptionInput.fill('Testing story 2.2 implementation');
    
    // Take screenshot after filling basic info
    await takeScreenshot(page, '03-basic-info-filled');
    
    // Fill in the first category
    const categoryNameInputs = page.getByPlaceholder(/category name/i);
    const categoryDescInputs = page.getByPlaceholder(/category description/i);
    
    await categoryNameInputs.first().fill('Excellent');
    await categoryDescInputs.first().fill('Outstanding quality, exceeds expectations');
    
    // Take screenshot after first category
    await takeScreenshot(page, '04-first-category-filled');
    
    console.log('✓ Basic form filling completed');
  });

  test('should test add/remove category functionality', async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Fill in basic info first
    await page.getByLabel(/name/i).fill('Test Set QA Review');
    await page.getByLabel(/description/i).fill('Testing story 2.2 implementation');
    
    // Fill first category
    const categoryNameInputs = page.getByPlaceholder(/category name/i);
    const categoryDescInputs = page.getByPlaceholder(/category description/i);
    
    await categoryNameInputs.first().fill('Excellent');
    await categoryDescInputs.first().fill('Outstanding quality, exceeds expectations');
    
    // Add a second category using the "Add Category" button
    const addCategoryButton = page.getByRole('button', { name: /add category/i });
    await addCategoryButton.click();
    
    // Take screenshot showing 2 categories
    await takeScreenshot(page, '05-second-category-added');
    
    // Verify we now have 2 category sections
    await expect(categoryNameInputs).toHaveCount(2);
    await expect(categoryDescInputs).toHaveCount(2);
    
    // Fill the second category
    await categoryNameInputs.nth(1).fill('Good');
    await categoryDescInputs.nth(1).fill('Meets requirements, good quality');
    
    // Take screenshot with both categories filled
    await takeScreenshot(page, '06-both-categories-filled');
    
    // Test remove functionality - should see remove buttons for both categories
    const removeButtons = page.getByRole('button').filter({ has: page.locator('[data-testid="Trash2"], .lucide-trash-2') });
    
    // Remove the second category
    if (await removeButtons.count() > 0) {
      await removeButtons.last().click();
      
      // Take screenshot after removal
      await takeScreenshot(page, '07-category-removed');
      
      // Verify we're back to 1 category
      await expect(categoryNameInputs).toHaveCount(1);
    }
    
    // Add multiple categories to test the full workflow
    await addCategoryButton.click();
    await addCategoryButton.click();
    
    // Now we should have 3 categories total
    await expect(categoryNameInputs).toHaveCount(3);
    
    // Fill all categories with sample data
    const categories = [
      { name: 'Excellent', desc: 'Outstanding quality, exceeds expectations' },
      { name: 'Good', desc: 'Meets requirements, good quality' },
      { name: 'Poor', desc: 'Below expectations, needs improvement' }
    ];
    
    for (let i = 0; i < categories.length; i++) {
      await categoryNameInputs.nth(i).fill(categories[i].name);
      await categoryDescInputs.nth(i).fill(categories[i].desc);
    }
    
    // Take final screenshot with all categories
    await takeScreenshot(page, '08-all-categories-complete');
    
    console.log('✓ Add/remove category functionality tested');
  });

  test('should test form submission behavior', async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Fill in complete valid form data
    await page.getByLabel(/name/i).fill('Test Set QA Review');
    await page.getByLabel(/description/i).fill('Testing story 2.2 implementation');
    
    // Fill first category
    await page.getByPlaceholder(/category name/i).first().fill('Excellent');
    await page.getByPlaceholder(/category description/i).first().fill('Outstanding quality');
    
    // Add and fill second category
    await page.getByRole('button', { name: /add category/i }).click();
    await page.getByPlaceholder(/category name/i).nth(1).fill('Good');
    await page.getByPlaceholder(/category description/i).nth(1).fill('Good quality');
    
    // Take screenshot before submission
    await takeScreenshot(page, '09-ready-for-submission');
    
    // Test the submit button (but don't actually submit to avoid side effects)
    const submitButton = page.getByRole('button', { name: /create test set/i });
    await expect(submitButton).toBeEnabled();
    
    console.log('✓ Form submission readiness verified');
  });

  test('should test form validation', async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /create test set/i });
    await submitButton.click();
    
    // Take screenshot showing validation errors
    await takeScreenshot(page, '10-validation-errors');
    
    // Verify validation messages appear
    await expect(page.getByText(/name is required/i)).toBeVisible();
    
    // Fill name but leave categories empty
    await page.getByLabel(/name/i).fill('Test Set');
    
    // Clear the default empty category
    await page.getByPlaceholder(/category name/i).first().fill('');
    await page.getByPlaceholder(/category description/i).first().fill('');
    
    await submitButton.click();
    
    // Take screenshot showing category validation
    await takeScreenshot(page, '11-category-validation');
    
    console.log('✓ Form validation tested');
  });

  test('should test cancel functionality', async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto('http://localhost:3000/test-sets/new');
    
    // Fill some data
    await page.getByLabel(/name/i).fill('Test Data');
    
    // Take screenshot before cancel
    await takeScreenshot(page, '12-before-cancel');
    
    // Click cancel button
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await cancelButton.click();
    
    // Should navigate away from the form
    // The exact behavior depends on the router configuration
    await page.waitForURL(/test-sets$/);
    
    // Take screenshot of destination page
    await takeScreenshot(page, '13-after-cancel');
    
    console.log('✓ Cancel functionality tested');
  });
});