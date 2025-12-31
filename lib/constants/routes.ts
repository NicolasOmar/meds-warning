export enum ROUTES {
  HOME = '/',
  CREATE_USER = '/concept/user',
  FIND_USER = '/concept/find',
  MEDICINE = '/medicine'
}

export const ROUTES_OBJS = [
  { name: 'Home', path: ROUTES.HOME },
  { name: 'Concept | Create User', path: ROUTES.CREATE_USER },
  { name: 'Concept | Find and Update User', path: ROUTES.FIND_USER },
  { name: 'Medicine', path: ROUTES.MEDICINE }
]
