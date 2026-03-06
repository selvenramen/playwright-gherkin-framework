import { LocatorStrategy } from './enums';

/**
 * Element Locator
 * Information to locate an element on the page
 */
export interface ElementLocator {
  strategy: LocatorStrategy;
  value: string;
}

/**
 * Screenshot Options
 * Configuration for taking screenshots
 */
export interface ScreenshotOptions {
  name: string;
  fullPage?: boolean;
  path?: string;
}

/**
 * Text Verification Options
 * Configuration for text verification methods
 */
export interface TextVerificationOptions {
  exact?: boolean;        // Whether to match text exactly (default: false)
  timeout?: number;       // Timeout in milliseconds (default: 30000)
  visible?: boolean;      // Whether text must be visible (default: true)
}
