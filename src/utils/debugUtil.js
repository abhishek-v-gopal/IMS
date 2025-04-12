/**
 * Utility functions for debugging
 */

// Enable or disable all debug logs
const DEBUG_ENABLED = true;

/**
 * Log a debug message to the console
 * @param {string} component - Component name
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
export function debugLog(component, message, data = null) {
  if (!DEBUG_ENABLED) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${component}]`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

/**
 * Log database operations
 * @param {string} operation - Database operation
 * @param {string} collection - Collection name
 * @param {any} data - Optional data
 */
export function logDB(operation, collection, data = null) {
  debugLog('Firestore', `${operation} in ${collection}`, data);
}

/**
 * Log app errors
 * @param {string} component - Component name 
 * @param {Error} error - Error object
 * @param {string} context - Additional context
 */
export function logError(component, error, context = '') {
  const message = context ? `Error in ${context}: ${error.message}` : error.message;
  console.error(`[ERROR] [${component}] ${message}`, error);
}

/**
 * Creates a simple profiler to measure function execution time
 * @param {string} label - Name of the operation being profiled
 * @returns {Function} - Function to call when operation is complete
 */
export function startProfile(label) {
  if (!DEBUG_ENABLED) return () => {};
  
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    console.log(`[Profile] ${label} took ${duration.toFixed(2)}ms`);
  };
}