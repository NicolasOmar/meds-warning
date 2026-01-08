export enum ROUTES {
  HOME = '/',
  MEDICINE_MAIN = '/medicine',
  MEDICINE_CREATE = '/medicine/create',
  MEDICINE_LIST = '/medicine/list'
}

export const MAIN_ROUTES_OBJS = [
  { name: 'Home', path: ROUTES.HOME },
  { name: 'Medicine', path: ROUTES.MEDICINE_MAIN }
]

export const MEDICINE_MAIN_ROUTES_OBJS = [
  { name: 'Add a new medicine', path: ROUTES.MEDICINE_CREATE },
  { name: 'See all created ones', path: ROUTES.MEDICINE_LIST }
]
