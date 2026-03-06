/**
 * Browser Types
 * Supported browser types for test execution
 */
export enum BrowserType {
  CHROMIUM = 'chromium',
  FIREFOX = 'firefox',
  WEBKIT = 'webkit',
  CHROME = 'chrome',
  SAFARI = 'safari'
}

/**
 * Locator Strategy
 * How to find elements on the page
 */
export enum LocatorStrategy {
  ID = 'id',
  NAME = 'name',
  CSS = 'css',
  XPATH = 'xpath',
  TEXT = 'text',
  PLACEHOLDER = 'placeholder',
  LABEL = 'label'
}
