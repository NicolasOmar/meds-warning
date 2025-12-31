export enum ROUTES {
  HOME = '/',
  USER_MAIN = '/concept',
  USER_CREATE = '/concept/user',
  USER_FIND = '/concept/find',
  MEDICINE_MAIN = '/medicine'
}

export const MAIN_ROUTES_OBJS = [
  { name: 'Home', path: ROUTES.HOME },
  { name: 'Concept', path: ROUTES.USER_MAIN },
  { name: 'Medicine', path: ROUTES.MEDICINE_MAIN }
]

export const CONCEPT_MAIN_ROUTES_OBJS = [
  { name: 'Create User', path: ROUTES.USER_CREATE },
  { name: 'Find and Update User', path: ROUTES.USER_FIND }
]
