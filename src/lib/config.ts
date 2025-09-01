/**
 * Global configuration for the application
 */

interface AppConfig {
  /** Flag to disable edit functionality across all components */
  disableEdit: boolean
  /** Flag to disable delete functionality across all components */
  disableDelete: boolean
}

/**
 * Global application configuration
 * Set disableEdit to true to HIDE edit functionality
 * Set disableDelete to true to HIDE delete functionality
 * across all components (Auction, Expenses, Membership)
 */
export const appConfig: AppConfig = {
  disableEdit: true,   // Set to true to HIDE edit buttons
  disableDelete: false // Set to true to HIDE delete buttons
}

/**
 * Helper function to check if edit operations should be shown
 * Returns true when edit buttons should be VISIBLE
 * Returns false when edit buttons should be HIDDEN
 */
export const isEditEnabled = (): boolean => {
  return !appConfig.disableEdit
}

/**
 * Helper function to check if delete operations should be shown
 * Returns true when delete buttons should be VISIBLE
 * Returns false when delete buttons should be HIDDEN
 */
export const isDeleteEnabled = (): boolean => {
  return !appConfig.disableDelete
}

/**
 * Helper function to update the edit visibility
 * @param enabled - true to SHOW edit buttons, false to HIDE edit buttons
 */
export const setEditEnabled = (enabled: boolean): void => {
  appConfig.disableEdit = !enabled
}

/**
 * Helper function to update the delete visibility
 * @param enabled - true to SHOW delete buttons, false to HIDE delete buttons
 */
export const setDeleteEnabled = (enabled: boolean): void => {
  appConfig.disableDelete = !enabled
}

/**
 * Legacy helper function for backward compatibility
 * @deprecated Use isEditEnabled() and isDeleteEnabled() instead
 */
export const isEditDeleteEnabled = (): boolean => {
  return isEditEnabled() && isDeleteEnabled()
}

/**
 * Legacy helper function for backward compatibility
 * @deprecated Use setEditEnabled() and setDeleteEnabled() instead
 */
export const setEditDeleteEnabled = (enabled: boolean): void => {
  setEditEnabled(enabled)
  setDeleteEnabled(enabled)
}
