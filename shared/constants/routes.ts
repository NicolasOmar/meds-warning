export enum ROUTE_URLS {
  HOME = '/',
  LOGIN = '/login',
  LOGOUT = '/logout',
  MEDICINE_ROOT = '/medicine',
  MEDICINE_CREATE = '/medicine/create',
  MEDICINE_LIST = '/medicine/list',
  PRESENTATION_ROOT = '/presentation',
  PRESENTATION_CREATE = '/presentation/create',
  PRESENTATION_LIST = '/presentation/list',
  SETTINGS_ROOT = '/settings',
  USER_ROOT = '/user',
  USER_CREATE = '/user/create',
  USER_LIST = '/user/list'
}

enum ROUTE_NAMES {
  HOME = 'Home',
  MEDICINE = 'Medicine',
  MEDICINE_CREATE = 'Add Medicine',
  MEDICINE_LIST = 'Medicine List',
  PRESENTATION = 'Presentation',
  PRESENTATION_CREATE = 'Add Presentation',
  PRESENTATION_LIST = 'Presentation List',
  SETTINGS = 'Settings',
  USER = 'User',
  USER_CREATE = 'Add User',
  USER_LIST = 'User List'
}

export const MAIN_ROUTES_OBJS = [
  { name: ROUTE_NAMES.HOME, path: ROUTE_URLS.HOME },
  { name: ROUTE_NAMES.MEDICINE, path: ROUTE_URLS.MEDICINE_ROOT },
  { name: ROUTE_NAMES.PRESENTATION, path: ROUTE_URLS.PRESENTATION_ROOT },
  { name: ROUTE_NAMES.SETTINGS, path: ROUTE_URLS.SETTINGS_ROOT }
]

export const MEDICINE_MAIN_ROUTES_OBJS = [
  { name: ROUTE_NAMES.MEDICINE_CREATE, path: ROUTE_URLS.MEDICINE_CREATE },
  { name: ROUTE_NAMES.MEDICINE_LIST, path: ROUTE_URLS.MEDICINE_LIST }
]

export const PRESENTATION_MAIN_ROUTES_OBJS = [
  { name: ROUTE_NAMES.PRESENTATION_CREATE, path: ROUTE_URLS.PRESENTATION_CREATE },
  { name: ROUTE_NAMES.PRESENTATION_LIST, path: ROUTE_URLS.PRESENTATION_LIST }
]

export const USER_MAIN_ROUTES_OBJS = [
  { name: ROUTE_NAMES.USER_CREATE, path: ROUTE_URLS.USER_CREATE }
]
