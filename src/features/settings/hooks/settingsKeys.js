/**
 * Query-key factory for settings resources. Centralizing avoids
 * invalidation typos.
 */
export const settingsKeys = {
  all:       () => ['settings'],
  resource:  (name) => ['settings', name],

  locations: {
    all:   () => ['settings', 'locations'],
    list:  () => ['settings', 'locations', 'list'],
    detail: (id) => ['settings', 'locations', 'detail', id],
  },
}