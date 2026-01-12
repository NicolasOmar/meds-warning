export enum ROUTES {
  HOME = '/',
  MEDICINE_MAIN = '/medicine',
  MEDICINE_CREATE = '/medicine/create',
  MEDICINE_LIST = '/medicine/list',
  PRESENTATION_MAIN = '/presentation',
  PRESENTATION_CREATE = '/presentation/create',
  PRESENTATION_LIST = '/presentation/list'
}

export const MAIN_ROUTES_OBJS = [
  { name: 'Home', path: ROUTES.HOME },
  { name: 'Medicine', path: ROUTES.MEDICINE_MAIN },
  { name: 'Presentation', path: ROUTES.PRESENTATION_MAIN }
]

export const MEDICINE_MAIN_ROUTES_OBJS = [
  { name: 'Add a new medicine', path: ROUTES.MEDICINE_CREATE },
  { name: 'See all created ones', path: ROUTES.MEDICINE_LIST }
]

export const PRESENTATION_MAIN_ROUTES_OBJS = [
  { name: 'Add a new presentation', path: ROUTES.PRESENTATION_CREATE }
  // { name: 'See all created ones', path: ROUTES.PRESENTATION_LIST }
]
