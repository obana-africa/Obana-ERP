import apiClient from '@/lib/apiClient'; // your axios/fetch instance

export const profileApi = {
  getProfile: () => apiClient.get('/admin/profile'),
  updateProfile: (data) => apiClient.put('/admin/profile', data),
  changePassword: (data) => apiClient.post('/admin/security/change-password', data),
  getNotificationPrefs: () => apiClient.get('/admin/notifications/prefs'),
  updateNotificationPrefs: (prefs) => apiClient.put('/admin/notifications/prefs', prefs),
  logoutAllDevices: () => apiClient.post('/admin/sessions/logout-all'),
  uploadAvatar: (formData) => apiClient.post('/admin/profile/avatar', formData),
  getDevices: () => apiClient.get('/admin/sessions'),
  logoutDevice: (deviceId) => apiClient.post(`/admin/sessions/${deviceId}/logout`),
  logoutAllDevices: () => apiClient.post('/admin/sessions/logout-all'),
  updateStore: (storeData) => apiClient.put('/admin/store', storeData),
  uploadAvatar: (formData) => apiClient.post('/admin/profile/avatar', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  }),
};