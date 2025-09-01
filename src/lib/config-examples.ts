/**
 * Example usage of the global edit/delete configuration
 * 
 * This file demonstrates how to use the global flag to control
 * edit and delete functionality across all components.
 */

import { appConfig, isEditDeleteEnabled, setEditDeleteEnabled } from '@/lib/config'

// Example 1: Check current state
console.log('Edit/Delete enabled:', isEditDeleteEnabled())

// Example 2: Disable edit/delete functionality globally
setEditDeleteEnabled(false)
console.log('After disabling - Edit/Delete enabled:', isEditDeleteEnabled())

// Example 3: Enable edit/delete functionality globally
setEditDeleteEnabled(true)
console.log('After enabling - Edit/Delete enabled:', isEditDeleteEnabled())

// Example 4: Direct access to config (not recommended for updates)
// console.log('Direct config access:', appConfig.disableEditDelete)

/**
 * Use Cases:
 * 
 * 1. Development/Testing: Disable edit/delete during testing
 * 2. Production Safety: Temporarily disable destructive operations
 * 3. Role-based Access: Disable for certain user roles
 * 4. Maintenance Mode: Disable during system maintenance
 * 
 * Implementation Examples:
 */

// Example: Role-based control
export const configureByUserRole = (userRole: string) => {
  const readOnlyRoles = ['viewer', 'guest']
  const isReadOnly = readOnlyRoles.includes(userRole)
  setEditDeleteEnabled(!isReadOnly)
}

// Example: Time-based control
export const configureByTime = () => {
  const maintenanceHours = [2, 3, 4] // 2 AM - 4 AM
  const currentHour = new Date().getHours()
  const isMaintenanceTime = maintenanceHours.includes(currentHour)
  setEditDeleteEnabled(!isMaintenanceTime)
}

// Example: Feature flag integration
export const configureByFeatureFlag = (featureFlags: Record<string, boolean>) => {
  const editDeleteEnabled = featureFlags.allowEditDelete ?? true
  setEditDeleteEnabled(editDeleteEnabled)
}
