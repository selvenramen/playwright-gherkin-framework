import { test, expect, Page } from '@playwright/test';
import { LocatorStrategy } from './types/enums';
import { ElementLocator, ScreenshotOptions, TextVerificationOptions } from './types/interfaces';

/**
 * Simple Test Framework for Non-Technical Users
 * This class provides easy-to-use methods for browser automation
 */
export class SimpleTestFramework {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens a URL in the browser
   * @param url - The URL to navigate to
   */
  async openUrl(url: string): Promise<void> {
    console.log(`📂 Opening URL: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('load');
  }

  /**
   * Fills an input box with text
   * @param fieldName - The label, placeholder, or name of the input field
   * @param value - The text to type into the field
   */
  async fillInputBox(fieldName: string, value: string): Promise<void> {
    console.log(`✏️  Filling input box "${fieldName}" with: ${value}`);
    
    // Try multiple strategies to find the input
    const input = this.page.locator(`input[name="${fieldName}"]`)
      .or(this.page.locator(`input[placeholder*="${fieldName}" i]`))
      .or(this.page.locator(`input[id="${fieldName}"]`))
      .or(this.page.locator(`input[id*="${fieldName}" i]`))
      .or(this.page.locator(`input[class*="${fieldName}" i]`))
      .or(this.page.locator(`label:has-text("${fieldName}") ~ input`))
      .or(this.page.locator(`label:has-text("${fieldName}") + input`))
      .or(this.page.locator(`#${fieldName}`));

    await input.first().fill(value);
  }

  /**
   * Clicks a button
   * @param buttonText - The text on the button or button name
   */
  async clickButton(buttonText: string): Promise<void> {
    console.log(`🖱️  Clicking button: ${buttonText}`);
    
    // Try multiple strategies to find the button
    const button = this.page.locator(`button:has-text("${buttonText}")`)
      .or(this.page.locator(`input[type="submit"][value="${buttonText}"]`))
      .or(this.page.locator(`input[type="button"][value="${buttonText}"]`))
      .or(this.page.locator(`a:has-text("${buttonText}")`))
      .or(this.page.locator(`[role="button"]:has-text("${buttonText}")`));

    await button.first().click({ noWaitAfter: true });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  }

  /**
   * Clicks any element (link, div, span, etc.)
   * @param elementText - The text of the element to click
   */
  async clickElement(elementText: string): Promise<void> {
    console.log(`🖱️  Clicking element: ${elementText}`);
    const link = this.page.locator('a:visible, [role="link"]:visible', { hasText: elementText });
    if (await link.count()) {
      await link.first().click();
      return;
    }

    const button = this.page.locator(
      'button:visible, [role="button"]:visible, input[type="button"]:visible, input[type="submit"]:visible',
      { hasText: elementText }
    );
    if (await button.count()) {
      await button.first().click();
      return;
    }

    const exactText = this.page.getByText(elementText, { exact: true }).locator(':visible');
    if (await exactText.count()) {
      await exactText.first().click();
      return;
    }

    await this.page.getByText(elementText).locator(':visible').first().click();
  }

  /**
   * Clicks an element by CSS selector
   * @param selector - CSS selector
   */
  async clickBySelector(selector: string): Promise<void> {
    console.log(`🎯 Clicking element with selector: ${selector}`);
    await this.page.locator(selector).first().click();
  }

  /**
   * Verifies that specific text is present on the page
   * @param text - The text to verify
   * @param options - Optional verification configuration
   */
  async verifyTextPresent(text: string, options?: TextVerificationOptions) {
    console.log(`✅ Verifying text is present: ${text}`);
    const exact = options?.exact ?? false;
    const timeout = options?.timeout ?? 30000;
    const checkVisible = options?.visible ?? true;
    
    const locator = this.page.getByText(text, { exact });
    const count = await locator.count();
    
    if (count === 0) {
      throw new Error(`Text "${text}" not found on the page`);
    }
    
    // Check if at least one instance is visible
    if (checkVisible) {
      await expect(locator.first()).toBeVisible({ timeout });
    }
  }

  /**
   * Verifies that specific text is NOT present on the page
   * @param text - The text that should not be visible
   * @param options - Optional verification configuration
   */
  async verifyTextNotPresent(text: string, options?: TextVerificationOptions): Promise<void> {
    console.log(`❌ Verifying text is NOT present: ${text}`);
    const exact = options?.exact ?? false;
    const timeout = options?.timeout ?? 30000;
    
    await expect(this.page.getByText(text, { exact })).not.toBeVisible({ timeout });
  }

  /**
   * Waits for a specified number of seconds
   * @param seconds - Number of seconds to wait
   */
  async wait(seconds: number): Promise<void> {
    console.log(`⏳ Waiting for ${seconds} seconds...`);
    await this.page.waitForTimeout(seconds * 1000);
  }

  /**
   * Selects an option from a dropdown
   * @param dropdownName - The name or label of the dropdown
   * @param optionText - The option text to select
   */
  async selectFromDropdown(dropdownName: string, optionText: string): Promise<void> {
    console.log(`📋 Selecting "${optionText}" from dropdown: ${dropdownName}`);
    
    const dropdown = this.page.locator(`select[name="${dropdownName}"]`)
      .or(this.page.locator(`select[id="${dropdownName}"]`))
      .or(this.page.locator(`select[id*="${dropdownName}" i]`))
      .or(this.page.locator(`select[class*="${dropdownName}" i]`))
      .or(this.page.locator(`label:has-text("${dropdownName}") ~ select`));

    const select = dropdown.first();
    const isMultiple = await select.evaluate((element: any) => Boolean(element?.multiple));

    if (isMultiple) {
      const optionValue = await select.evaluate((element: any, label: string) => {
        const normalizedLabel = label.trim().toLowerCase();
        const options = Array.from(element?.options ?? []);
        const option = options.find((item: any) =>
          String(item?.label ?? '').trim().toLowerCase() === normalizedLabel
          || String(item?.text ?? '').trim().toLowerCase() === normalizedLabel
        ) as any;
        return option ? String(option.value ?? '') : null;
      }, optionText);

      if (optionValue) {
        const selectedValues = await select.evaluate((element: any) =>
          Array.from(element?.selectedOptions ?? []).map((item: any) => String(item?.value ?? ''))
        );

        const nextValues = Array.from(new Set([...selectedValues, optionValue]));
        await select.selectOption(nextValues);
        return;
      }
    }

    await select.selectOption({ label: optionText });
  }

  /**
   * Checks a checkbox
   * @param checkboxName - The name or label of the checkbox
   */
  async checkCheckbox(checkboxName: string): Promise<void> {
    console.log(`☑️  Checking checkbox: ${checkboxName}`);
    
    const checkbox = this.page.locator(`input[type="checkbox"][name="${checkboxName}"]`)
      .or(this.page.locator(`input[type="checkbox"][id="${checkboxName}"]`))
      .or(this.page.locator(`input[type="checkbox"][id="${checkboxName.toLowerCase()}"]`))
      .or(this.page.locator(`input[type="checkbox"][value="${checkboxName}"]`))
      .or(this.page.locator(`label:has-text("${checkboxName}") input[type="checkbox"]`));

    await checkbox.first().check();
  }

  /**
   * Unchecks a checkbox
   * @param checkboxName - The name or label of the checkbox
   */
  async uncheckCheckbox(checkboxName: string): Promise<void> {
    console.log(`☐ Unchecking checkbox: ${checkboxName}`);
    
    const checkbox = this.page.locator(`input[type="checkbox"][name="${checkboxName}"]`)
      .or(this.page.locator(`input[type="checkbox"][id="${checkboxName}"]`))
      .or(this.page.locator(`input[type="checkbox"][id="${checkboxName.toLowerCase()}"]`))
      .or(this.page.locator(`input[type="checkbox"][value="${checkboxName}"]`))
      .or(this.page.locator(`label:has-text("${checkboxName}") input[type="checkbox"]`));

    await checkbox.first().uncheck();
  }

  /**
   * Takes a screenshot
   * @param name - Name for the screenshot file
   * @param options - Optional screenshot configuration
   */
  async takeScreenshot(name: string, options?: ScreenshotOptions): Promise<void> {
    console.log(`📸 Taking screenshot: ${name}`);
    const screenshotOptions = {
      path: options?.path || `screenshots/${name}.png`,
      fullPage: options?.fullPage ?? true
    };
    await this.page.screenshot(screenshotOptions);
  }

  /**
   * Verifies the current page URL contains specific text
   * @param urlPart - The text that should be in the URL
   */
  async verifyUrlContains(urlPart: string): Promise<void> {
    console.log(`🔗 Verifying URL contains: ${urlPart}`);
    expect(this.page.url()).toContain(urlPart);
  }

  /**
   * Presses a keyboard key
   * @param key - The key to press (e.g., 'Enter', 'Escape', 'Tab')
   */
  async pressKey(key: string): Promise<void> {
    console.log(`⌨️  Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Hovers over an element
   * @param elementText - The text of the element to hover over
   */
  async hoverElement(elementText: string): Promise<void> {
    console.log(`👆 Hovering over: ${elementText}`);
    await this.page.getByText(elementText).first().hover();
  }

  /**
   * Selects a radio button
   * @param radioName - The name or label of the radio button
   * @param value - The value of the radio button to select (optional if there's only one with that name)
   */
  async selectRadioButton(radioName: string, value?: string): Promise<void> {
    console.log(`🔘 Selecting radio button: ${radioName}${value ? ` with value: ${value}` : ''}`);
    
    let radio;
    if (value) {
      radio = this.page.locator(`input[type="radio"][name="${radioName}"][value="${value}"]`)
        .or(this.page.locator(`label:has-text("${radioName}") input[type="radio"][value="${value}"]`));
    } else {
      radio = this.page.locator(`input[type="radio"][name="${radioName}"]`)
        .or(this.page.locator(`label:has-text("${radioName}") input[type="radio"]`));
    }
    
    await radio.first().check();
  }

  /**
   * Uploads a file to a file input
   * @param inputName - The name, ID, label text, or nearby button text of the file input
   * @param filePath - The absolute or relative path to the file to upload
   */
  async uploadFile(inputName: string, filePath: string): Promise<void> {
    console.log(`📤 Uploading file to "${inputName}": ${filePath}`);
    
    // Strategy 1: Try to find by ID or name attribute
    let fileInput = this.page.locator(`input[type="file"][id="${inputName}"]`)
      .or(this.page.locator(`input[type="file"][name="${inputName}"]`));
    
    // Strategy 2: Try to find by associated label text
    fileInput = fileInput.or(this.page.locator(`label:has-text("${inputName}") input[type="file"]`))
      .or(this.page.locator(`label:has-text("${inputName}") ~ input[type="file"]`));
    
    // Strategy 3: Try to find by nearby text (like "Choose File" button text)
    // Look for file inputs near elements containing the text
    fileInput = fileInput.or(
      this.page.locator(`//*[contains(text(), "${inputName}")]/following::input[@type="file"][1]`)
    ).or(
      this.page.locator(`//*[contains(text(), "${inputName}")]/preceding::input[@type="file"][1]`)
    );
    
    // Strategy 4: Just find any file input if the text is generic like "Choose File"
    if (inputName.toLowerCase().includes('choose') || inputName.toLowerCase().includes('select')) {
      fileInput = fileInput.or(this.page.locator(`input[type="file"]`));
    }
    
    // Set the file, even if the input is hidden
    await fileInput.first().setInputFiles(filePath);
    
    console.log(`✅ File uploaded successfully`);
  }

  /**
   * Uploads multiple files to a file input
   * @param inputName - The name or label of the file input
   * @param filePaths - Array of file paths to upload
   */
  async uploadMultipleFiles(inputName: string, filePaths: string[]): Promise<void> {
    console.log(`📤 Uploading ${filePaths.length} files to "${inputName}"`);
    
    const fileInput = this.page.locator(`input[type="file"][name="${inputName}"]`)
      .or(this.page.locator(`input[type="file"][id="${inputName}"]`)
      .or(this.page.locator(`label:has-text("${inputName}") ~ input[type="file"]`)));
    
    await fileInput.first().setInputFiles(filePaths);
  }

  /**
   * Switches to an iframe by name, id, or index
   * @param iframeIdentifier - Name, id, or index of the iframe
   * @returns Frame locator for interacting with iframe content
   */
  async switchToIframe(iframeIdentifier: string | number) {
    console.log(`🖼️  Switching to iframe: ${iframeIdentifier}`);
    
    if (typeof iframeIdentifier === 'number') {
      return this.page.frameLocator(`iframe >> nth=${iframeIdentifier}`);
    } else {
      return this.page.frameLocator(`iframe[name="${iframeIdentifier}"], iframe[id="${iframeIdentifier}"]`);
    }
  }

  /**
   * Gets text from a table cell
   * @param rowIndex - Row index (0-based)
   * @param columnIndex - Column index (0-based)
   * @param tableSelector - Optional CSS selector for the table
   * @returns The text content of the cell
   */
  async getTableCellText(rowIndex: number, columnIndex: number, tableSelector: string = 'table'): Promise<string> {
    console.log(`📊 Getting text from table cell [${rowIndex}, ${columnIndex}]`);
    const cell = this.page.locator(`${tableSelector} tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1}), ${tableSelector} tr:nth-child(${rowIndex + 1}) th:nth-child(${columnIndex + 1})`);
    return await cell.innerText();
  }

  /**
   * Gets all data from a table row
   * @param rowIndex - Row index (0-based)
   * @param tableSelector - Optional CSS selector for the table
   * @returns Array of cell texts
   */
  async getTableRowData(rowIndex: number, tableSelector: string = 'table'): Promise<string[]> {
    console.log(`📊 Getting data from table row ${rowIndex}`);
    const cells = this.page.locator(`${tableSelector} tr:nth-child(${rowIndex + 1}) td, ${tableSelector} tr:nth-child(${rowIndex + 1}) th`);
    const count = await cells.count();
    const rowData: string[] = [];
    
    for (let i = 0; i < count; i++) {
      rowData.push(await cells.nth(i).innerText());
    }
    
    return rowData;
  }

  /**
   * Gets the total number of rows in a table
   * @param tableSelector - Optional CSS selector for the table
   * @returns Number of rows
   */
  async getTableRowCount(tableSelector: string = 'table'): Promise<number> {
    console.log(`📊 Getting table row count`);
    return await this.page.locator(`${tableSelector} tr`).count();
  }

  /**
   * Accepts an alert/dialog
   */
  async acceptAlert(): Promise<void> {
    console.log(`✅ Accepting alert/dialog`);
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });
  }

  /**
   * Dismisses an alert/dialog
   */
  async dismissAlert(): Promise<void> {
    console.log(`❌ Dismissing alert/dialog`);
    this.page.once('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  /**
   * Gets the text from an alert/dialog
   * @returns The alert message
   */
  async getAlertText(): Promise<string> {
    console.log(`📝 Getting alert text`);
    return new Promise((resolve) => {
      this.page.once('dialog', async dialog => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }

  /**
   * Types text into an alert prompt and accepts it
   * @param text - Text to type into the prompt
   */
  async fillAlertPrompt(text: string): Promise<void> {
    console.log(`⌨️  Filling alert prompt with: ${text}`);
    this.page.once('dialog', async dialog => {
      await dialog.accept(text);
    });
  }

  /**
   * Drags an element and drops it on another element
   * @param sourceText - Text of the element to drag, or CSS selector if starts with # or .
   * @param targetText - Text of the element to drop on, or CSS selector if starts with # or .
   */
  async dragAndDrop(sourceText: string, targetText: string): Promise<void> {
    console.log(`🎯 Dragging "${sourceText}" to "${targetText}"`);
    
    // Check if it's a CSS selector (starts with # or . or [)
    const isSourceSelector = sourceText.startsWith('#') || sourceText.startsWith('.') || sourceText.startsWith('[');
    const isTargetSelector = targetText.startsWith('#') || targetText.startsWith('.') || targetText.startsWith('[');
    
    // For text, try to find the element that contains the text
    const source = isSourceSelector 
      ? this.page.locator(sourceText) 
      : this.page.locator(`//*[contains(text(), "${sourceText}")]`).or(this.page.getByText(sourceText, { exact: false })).first();
    
    const target = isTargetSelector 
      ? this.page.locator(targetText) 
      : this.page.locator(`//*[contains(text(), "${targetText}")]`).or(this.page.getByText(targetText, { exact: false })).first();
    
    // Visual feedback: highlight source element in yellow
    await source.evaluate('(el) => { el.style.border = "5px solid yellow"; el.style.backgroundColor = "yellow"; }');
    await this.page.waitForTimeout(800);
    
    // Visual feedback: highlight target element in green
    await target.evaluate('(el) => { el.style.border = "5px solid green"; el.style.backgroundColor = "lightgreen"; }');
    await this.page.waitForTimeout(800);
    
    // Perform the actual drag and drop using Playwright's built-in method
    await source.dragTo(target, { timeout: 5000 });
    
    // Wait to see the result
    await this.page.waitForTimeout(1000);
    
    // Remove highlights
    await source.evaluate('(el) => { el.style.border = ""; el.style.backgroundColor = ""; }').catch(() => {});
    await target.evaluate('(el) => { el.style.border = ""; el.style.backgroundColor = ""; }').catch(() => {});
  }

  /**
   * Drags an element by a specific offset
   * @param elementText - Text of the element to drag
   * @param x - Horizontal offset in pixels
   * @param y - Vertical offset in pixels
   */
  async dragByOffset(elementText: string, x: number, y: number): Promise<void> {
    console.log(`🎯 Dragging "${elementText}" by offset (${x}, ${y})`);
    const element = this.page.getByText(elementText).first();
    await element.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(x, y);
    await this.page.mouse.up();
  }

  /**
   * Double-clicks an element
   * @param elementText - The text of the element to double-click
   */
  async doubleClickElement(elementText: string): Promise<void> {
    console.log(`🖱️🖱️  Double-clicking element: ${elementText}`);
    await this.page.getByText(elementText).first().dblclick();
  }

  /**
   * Right-clicks an element (opens context menu)
   * @param elementText - The text of the element to right-click
   */
  async rightClickElement(elementText: string): Promise<void> {
    console.log(`🖱️➡️  Right-clicking element: ${elementText}`);
    await this.page.getByText(elementText).first().click({ button: 'right' });
  }

  /**
   * Gets the tooltip text of an element
   * @param elementText - The text of the element with tooltip
   * @param tooltipAttribute - The attribute containing tooltip (default: 'title')
   * @returns The tooltip text
   */
  async getTooltipText(elementText: string, tooltipAttribute: string = 'title'): Promise<string> {
    console.log(`💬 Getting tooltip for: ${elementText}`);
    const element = this.page.getByText(elementText).first();
    const tooltip = await element.getAttribute(tooltipAttribute);
    return tooltip || '';
  }

  /**
   * Hovers over an element to show its tooltip and waits for it
   * @param elementText - The text of the element with tooltip
   * @param waitTime - Optional wait time in milliseconds after hover (default: 500ms)
   */
  async hoverToShowTooltip(elementText: string, waitTime: number = 500): Promise<void> {
    console.log(`💬 Hovering to show tooltip for: ${elementText}`);
    await this.page.getByText(elementText).first().hover();
    await this.page.waitForTimeout(waitTime);
  }

  /**
   * Fills a date picker input
   * @param dateFieldName - The label or name of the date field
   * @param date - The date string (format: YYYY-MM-DD or any format the input accepts)
   */
  async fillDatePicker(dateFieldName: string, date: string): Promise<void> {
    console.log(`📅 Filling date picker "${dateFieldName}" with: ${date}`);
    
    const dateInput = this.page.locator(`input[type="date"][name="${dateFieldName}"]`)
      .or(this.page.locator(`input[type="date"][id="${dateFieldName}"]`))
      .or(this.page.locator(`label:has-text("${dateFieldName}") ~ input[type="date"]`))
      .or(this.page.locator(`input[name="${dateFieldName}"]`))
      .or(this.page.locator(`input[id="${dateFieldName}"]`));
    
    await dateInput.first().fill(date);
  }

  /**
   * Verifies that a modal/dialog is visible
   * @param modalText - Text that appears in the modal
   */
  async verifyModalVisible(modalText: string): Promise<void> {
    console.log(`🪟 Verifying modal is visible with text: ${modalText}`);
    const modal = this.page.locator('[role="dialog"]')
      .or(this.page.locator('.modal'))
      .or(this.page.locator('[class*="modal"]'));
    
    await expect(modal.filter({ hasText: modalText })).toBeVisible();
  }

  /**
   * Closes a modal by clicking its close button
   * @param closeButtonSelector - Optional selector for close button (default: looks for common patterns)
   */
  async closeModal(closeButtonSelector?: string): Promise<void> {
    console.log(`🪟 Closing modal`);
    
    if (closeButtonSelector) {
      await this.page.locator(closeButtonSelector).click();
    } else {
      // Try common close button patterns
      const closeButton = this.page.locator('[aria-label="Close"]')
        .or(this.page.locator('.modal-close'))
        .or(this.page.locator('[class*="close"]'))
        .or(this.page.locator('button:has-text("Close")'));
      
      await closeButton.first().click();
    }
  }

  /**
   * Switches to a new window/tab
   * @param windowIndex - Index of the window to switch to (default: latest window)
   * @returns The new page object
   */
  async switchToWindow(windowIndex?: number): Promise<Page> {
    console.log(`🪟 Switching to window ${windowIndex !== undefined ? windowIndex : 'latest'}`);
    const pages = this.page.context().pages();
    
    if (windowIndex !== undefined) {
      this.page = pages[windowIndex];
    } else {
      this.page = pages[pages.length - 1];
    }
    
    return this.page;
  }

  /**
   * Opens a new tab/window
   * @param url - Optional URL to open in the new tab
   * @returns The new page object
   */
  async openNewTab(url?: string): Promise<Page> {
    console.log(`🪟 Opening new tab${url ? ` with URL: ${url}` : ''}`);
    const newPage = await this.page.context().newPage();
    
    if (url) {
      await newPage.goto(url);
    }
    
    this.page = newPage;
    return newPage;
  }

  /**
   * Closes the current tab/window
   */
  async closeCurrentTab(): Promise<void> {
    console.log(`🪟 Closing current tab`);
    await this.page.close();
    
    // Switch to the first available page
    const pages = this.page.context().pages();
    if (pages.length > 0) {
      this.page = pages[0];
    }
  }

  /**
   * Gets the number of open windows/tabs
   * @returns Number of open windows
   */
  async getWindowCount(): Promise<number> {
    const count = this.page.context().pages().length;
    console.log(`🪟 Number of open windows: ${count}`);
    return count;
  }

  /**
   * Scrolls to an element to make it visible
   * @param elementText - The text of the element to scroll to
   */
  async scrollToElement(elementText: string): Promise<void> {
    console.log(`📜 Scrolling to element: ${elementText}`);
    const element = this.page.getByText(elementText).first();
    
    // Highlight the element before scrolling
    await element.evaluate('(el) => { el.style.border = "5px solid orange"; el.style.backgroundColor = "lightyellow"; }');
    
    // Scroll to the element
    await element.scrollIntoViewIfNeeded();
    
    // Wait to show the scroll happened
    await this.page.waitForTimeout(800);
    
    // Remove highlight
    await element.evaluate('(el) => { el.style.border = ""; el.style.backgroundColor = ""; }');
  }

  /**
   * Scrolls to a specific position on the page
   * @param x - Horizontal scroll position in pixels
   * @param y - Vertical scroll position in pixels
   */
  async scrollToPosition(x: number, y: number): Promise<void> {
    console.log(`📜 Scrolling to position (${x}, ${y})`);
    await this.page.evaluate('({ x, y }) => window.scrollTo(x, y)', { x, y });
  }

  /**
   * Scrolls to the top of the page
   */
  async scrollToTop(): Promise<void> {
    console.log(`📜 Scrolling to top of page`);
    await this.page.evaluate('() => window.scrollTo(0, 0)');
  }

  /**
   * Scrolls to the bottom of the page
   */
  async scrollToBottom(): Promise<void> {
    console.log(`📜 Scrolling to bottom of page`);
    await this.page.evaluate('() => window.scrollTo(0, document.body.scrollHeight)');
  }

  /**
   * Fills a textarea with text
   * @param textareaName - The name, label, or placeholder of the textarea
   * @param value - The text to fill
   */
  async fillTextArea(textareaName: string, value: string): Promise<void> {
    console.log(`📝 Filling textarea "${textareaName}" with: ${value}`);
    
    const textarea = this.page.locator(`textarea[name="${textareaName}"]`)
      .or(this.page.locator(`textarea[placeholder*="${textareaName}" i]`))
      .or(this.page.locator(`textarea[id="${textareaName}"]`))
      .or(this.page.locator(`label:has-text("${textareaName}") ~ textarea`));
    
    await textarea.first().fill(value);
  }

  /**
   * Verifies that an element is visible
   * @param elementText - The text of the element to verify
   * @param timeout - Optional timeout in milliseconds (default: 30000)
   */
  async verifyElementVisible(elementText: string, timeout: number = 30000): Promise<void> {
    console.log(`👁️  Verifying element is visible: ${elementText}`);
    await expect(this.page.getByText(elementText).first()).toBeVisible({ timeout });
  }

  /**
   * Verifies that an element is hidden/not visible
   * @param elementText - The text of the element to verify
   * @param timeout - Optional timeout in milliseconds (default: 30000)
   */
  async verifyElementHidden(elementText: string, timeout: number = 30000): Promise<void> {
    console.log(`🙈 Verifying element is hidden: ${elementText}`);
    await expect(this.page.getByText(elementText).first()).not.toBeVisible({ timeout });
  }

  /**
   * Verifies that an element is enabled
   * @param elementText - The text of the element to verify
   */
  async verifyElementEnabled(elementText: string): Promise<void> {
    console.log(`✅ Verifying element is enabled: ${elementText}`);
    await expect(this.page.getByText(elementText).first()).toBeEnabled();
  }

  /**
   * Verifies that an element is disabled
   * @param elementText - The text of the element to verify
   */
  async verifyElementDisabled(elementText: string): Promise<void> {
    console.log(`🚫 Verifying element is disabled: ${elementText}`);
    await expect(this.page.getByText(elementText).first()).toBeDisabled();
  }

  /**
   * Gets an attribute value from an element
   * @param elementText - The text of the element
   * @param attributeName - The name of the attribute
   * @returns The attribute value
   */
  async getElementAttribute(elementText: string, attributeName: string): Promise<string | null> {
    console.log(`📋 Getting attribute "${attributeName}" from element: ${elementText}`);
    return await this.page.getByText(elementText).first().getAttribute(attributeName);
  }

  /**
   * Verifies an element has a specific attribute value
   * @param elementText - The text of the element
   * @param attributeName - The name of the attribute
   * @param expectedValue - The expected value of the attribute
   */
  async verifyElementAttribute(elementText: string, attributeName: string, expectedValue: string): Promise<void> {
    console.log(`✅ Verifying element "${elementText}" has attribute "${attributeName}" = "${expectedValue}"`);
    await expect(this.page.getByText(elementText).first()).toHaveAttribute(attributeName, expectedValue);
  }

  /**
   * Finds an element using a specific locator strategy
   * @param locator - ElementLocator with strategy and value
   * @returns Playwright Locator
   */
  async findElementByLocator(locator: ElementLocator) {
    console.log(`🔍 Finding element with ${locator.strategy}: ${locator.value}`);
    
    switch (locator.strategy) {
      case LocatorStrategy.ID:
        return this.page.locator(`#${locator.value}`);
      case LocatorStrategy.CSS:
        return this.page.locator(locator.value);
      case LocatorStrategy.XPATH:
        return this.page.locator(locator.value);
      case LocatorStrategy.NAME:
        return this.page.locator(`[name="${locator.value}"]`);
      case LocatorStrategy.TEXT:
        return this.page.getByText(locator.value);
      case LocatorStrategy.PLACEHOLDER:
        return this.page.getByPlaceholder(locator.value);
      case LocatorStrategy.LABEL:
        return this.page.getByLabel(locator.value);
      default:
        return this.page.locator(locator.value);
    }
  }
}

/**
 * Helper function to create a new test with the framework
 * Use this in your test files
 */
export function createSimpleTest(testName: string, testSteps: (framework: SimpleTestFramework) => Promise<void>) {
  test(testName, async ({ page }) => {
    const framework = new SimpleTestFramework(page);
    await testSteps(framework);
  });
}

/**
 * Alias for createSimpleTest - use this for cleaner test creation
 */
export function createTest(testName: string, testSteps: (framework: SimpleTestFramework) => Promise<void>) {
  test(testName, async ({ page }) => {
    const framework = new SimpleTestFramework(page);
    await testSteps(framework);
  });
}
