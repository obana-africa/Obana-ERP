import { useLocation } from 'react-router-dom'
import LocationsList from './LocationsList'
import LocationForm from './LocationForm'

/**
 * LocationsPanel switches between the list view and the add/edit form
 * based on the current URL:
 *
 *   /settings/locations            → list
 *   /settings/locations/new        → add form
 *   /settings/locations/:id/edit   → edit form
 *
 * All three routes point at this component (see routes.jsx).
 */
export default function LocationsPanel() {
  const { pathname } = useLocation()

  if (pathname.endsWith('/new')) {
    return <LocationForm mode="create" />
  }
  if (pathname.endsWith('/edit')) {
    return <LocationForm mode="edit" />
  }
  return <LocationsList />
}