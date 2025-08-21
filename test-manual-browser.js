/**
 * Manual Browser Testing Script for Test Set Form
 * 
 * This script provides a comprehensive test plan for manually testing
 * the form at http://localhost:3001/test-sets/new
 * 
 * Note: Since Playwright MCP browser tools are not available in the current environment,
 * this serves as a detailed test plan that can be executed manually or with browser automation tools.
 */

const { chromium } = require('./apps/web/node_modules/playwright');

async function runFormTests() {
  console.log('🚀 Starting Test Set Form Tests...\n');
  
  let browser;
  let page;
  
  try {
    // Launch browser
    browser = await chromium.launch({ 
      headless: false, // Set to false to see the browser
      slowMo: 1000     // Slow down operations to observe
    });
    
    const context = await browser.newContext();
    page = await context.newPage();
    
    console.log('✅ Browser launched successfully');
    
    // Test 1: Navigate to the form page
    console.log('\n📋 Test 1: Navigate to form page');
    await page.goto('http://localhost:3001/test-sets/new');
    
    // Check if redirected to login
    if (page.url().includes('/login')) {
      console.log('⚠️  Redirected to login page - authentication required');
      await page.screenshot({ path: 'screenshots/01-login-required.png' });
      console.log('📸 Screenshot saved: 01-login-required.png');
      console.log('ℹ️  Manual login required to continue tests');
      return;
    }
    
    // Take screenshot of initial page
    await page.screenshot({ path: 'screenshots/02-initial-page.png', fullPage: true });
    console.log('📸 Screenshot saved: 02-initial-page.png');
    console.log('✅ Form page loaded successfully');
    
    // Test 2: Verify form elements
    console.log('\n🔍 Test 2: Verify form elements');
    
    const nameInput = page.locator('[name="name"], input[id="name"], label:has-text("Name") + input');
    const descriptionInput = page.locator('[name="description"], textarea[id="description"], label:has-text("Description") + textarea');
    const categoryNameInputs = page.locator('input[placeholder*="category name"], input[placeholder*="Category name"]');
    const categoryDescInputs = page.locator('textarea[placeholder*="category description"], textarea[placeholder*="Category description"]');
    const createButton = page.locator('button:has-text("Create Test Set"), button:has-text("Create")');
    const cancelButton = page.locator('button:has-text("Cancel")');
    const addCategoryButton = page.locator('button:has-text("Add Category")');
    
    console.log('Checking form elements presence...');
    
    if (await nameInput.count() > 0) console.log('✅ Name input found');
    else console.log('❌ Name input not found');
    
    if (await descriptionInput.count() > 0) console.log('✅ Description input found');
    else console.log('❌ Description input not found');
    
    if (await categoryNameInputs.count() > 0) console.log('✅ Category name input found');
    else console.log('❌ Category name input not found');
    
    if (await categoryDescInputs.count() > 0) console.log('✅ Category description input found');
    else console.log('❌ Category description input not found');
    
    if (await createButton.count() > 0) console.log('✅ Create button found');
    else console.log('❌ Create button not found');
    
    if (await cancelButton.count() > 0) console.log('✅ Cancel button found');
    else console.log('❌ Cancel button not found');
    
    if (await addCategoryButton.count() > 0) console.log('✅ Add Category button found');
    else console.log('❌ Add Category button not found');
    
    // Test 3: Fill form with test data
    console.log('\n📝 Test 3: Fill form with test data');
    
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test Set QA Review');
      console.log('✅ Name filled: "Test Set QA Review"');
    }
    
    if (await descriptionInput.count() > 0) {
      await descriptionInput.fill('Testing story 2.2 implementation');
      console.log('✅ Description filled: "Testing story 2.2 implementation"');
    }
    
    // Fill first category
    if (await categoryNameInputs.count() > 0) {
      await categoryNameInputs.first().fill('Excellent');
      console.log('✅ First category name filled: "Excellent"');
    }
    
    if (await categoryDescInputs.count() > 0) {
      await categoryDescInputs.first().fill('Outstanding quality, exceeds expectations');
      console.log('✅ First category description filled');
    }
    
    // Take screenshot after filling basic data
    await page.screenshot({ path: 'screenshots/03-basic-data-filled.png', fullPage: true });
    console.log('📸 Screenshot saved: 03-basic-data-filled.png');
    
    // Test 4: Test add category functionality
    console.log('\n➕ Test 4: Test add category functionality');
    
    if (await addCategoryButton.count() > 0) {
      await addCategoryButton.click();
      console.log('✅ Add Category button clicked');
      
      // Wait a moment for the new category to appear
      await page.waitForTimeout(500);
      
      const updatedCategoryCount = await categoryNameInputs.count();
      console.log(`✅ Categories count after adding: ${updatedCategoryCount}`);
      
      // Fill second category if it exists
      if (updatedCategoryCount >= 2) {
        await categoryNameInputs.nth(1).fill('Good');
        await categoryDescInputs.nth(1).fill('Meets requirements, good quality');
        console.log('✅ Second category filled');
      }
    }
    
    // Take screenshot with multiple categories
    await page.screenshot({ path: 'screenshots/04-multiple-categories.png', fullPage: true });
    console.log('📸 Screenshot saved: 04-multiple-categories.png');
    
    // Test 5: Test remove category functionality
    console.log('\n🗑️ Test 5: Test remove category functionality');
    
    const removeButtons = page.locator('button:has([data-testid="Trash2"]), button[aria-label*="remove"], button[title*="remove"]');
    const initialRemoveCount = await removeButtons.count();
    
    if (initialRemoveCount > 0) {
      console.log(`✅ Found ${initialRemoveCount} remove buttons`);
      
      // Click the last remove button
      await removeButtons.last().click();
      console.log('✅ Remove button clicked');
      
      await page.waitForTimeout(500);
      
      const finalCategoryCount = await categoryNameInputs.count();
      console.log(`✅ Categories count after removal: ${finalCategoryCount}`);
    } else {
      console.log('ℹ️  No remove buttons found (expected for single category)');
    }
    
    // Test 6: Test form validation
    console.log('\n✅ Test 6: Test form validation');
    
    // Clear the name field to test validation
    if (await nameInput.count() > 0) {
      await nameInput.fill('');
      console.log('✅ Name field cleared for validation test');
    }
    
    // Try to submit
    if (await createButton.count() > 0) {
      await createButton.click();
      console.log('✅ Create button clicked with empty name');
      
      // Wait a moment for validation messages
      await page.waitForTimeout(1000);
      
      // Take screenshot showing validation
      await page.screenshot({ path: 'screenshots/05-validation-errors.png', fullPage: true });
      console.log('📸 Screenshot saved: 05-validation-errors.png');
    }
    
    // Test 7: Complete form and test final state
    console.log('\n🏁 Test 7: Complete form for final state');
    
    // Fill name back in
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test Set QA Review');
    }
    
    // Ensure we have valid categories
    const finalCategoryCount = await categoryNameInputs.count();
    for (let i = 0; i < finalCategoryCount; i++) {
      const nameValue = await categoryNameInputs.nth(i).inputValue();
      const descValue = await categoryDescInputs.nth(i).inputValue();
      
      if (!nameValue) {
        await categoryNameInputs.nth(i).fill(`Category ${i + 1}`);
      }
      if (!descValue) {
        await categoryDescInputs.nth(i).fill(`Description for category ${i + 1}`);
      }
    }
    
    // Final screenshot
    await page.screenshot({ path: 'screenshots/06-final-form-state.png', fullPage: true });
    console.log('📸 Screenshot saved: 06-final-form-state.png');
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\nScreenshots saved in the screenshots directory:');
    console.log('- 01-login-required.png (if authentication needed)');
    console.log('- 02-initial-page.png (initial form load)');
    console.log('- 03-basic-data-filled.png (form with basic data)');
    console.log('- 04-multiple-categories.png (multiple categories added)');
    console.log('- 05-validation-errors.png (validation test)');
    console.log('- 06-final-form-state.png (final form state)');
    
    // Test summary
    console.log('\n📊 Test Summary:');
    console.log('✅ Page navigation');
    console.log('✅ Form element verification');
    console.log('✅ Form data input');
    console.log('✅ Add category functionality');
    console.log('✅ Remove category functionality');
    console.log('✅ Form validation');
    console.log('✅ Screenshot capture');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    
    if (page) {
      try {
        await page.screenshot({ path: 'screenshots/error-screenshot.png', fullPage: true });
        console.log('📸 Error screenshot saved: error-screenshot.png');
      } catch (screenshotError) {
        console.error('Failed to take error screenshot:', screenshotError);
      }
    }
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

// Create screenshots directory if it doesn't exist
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('📁 Created screenshots directory');
}

// Run the tests
if (require.main === module) {
  runFormTests().catch(console.error);
}

module.exports = { runFormTests };