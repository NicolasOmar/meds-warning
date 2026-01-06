export enum COMMON_FORM_LABELS {}

export enum COMMON_FORM_ERRORS {
  FORM_INPUTS_ERROR = 'Sended information has an error. Please read and correct the commented fields.'
}

export enum ROOT_PAGE_LABELS {
  WELCOME_MESSAGE = 'Welcome to this Meds Warning. Please navigate to the [Medicine] page to add new medicines or to the [Concept] page to check its base implementation'
}

export enum CONCEPT_PAGE_LABELS {
  WELCOME_MESSAGE = 'Welcome to the Concept Page. Please select any of the options above to explore more.'
}

export enum MEDICINE_PAGE_LABELS {
  WELCOME_MESSAGE = 'Welcome to the Medicine Page. Please select any of the options above to explore more.'
}

export enum USER_FORM_LABELS {
  CREATE_TITLE = 'Create an user',
  UPDATE_TITLE = 'Update your profile',
  NAME = 'Name',
  NAME_PLACEHOLDER = 'John',
  LAST_NAME = 'Last Name',
  LAST_NAME_PLACEHOLDER = 'Doe',
  EMAIL = 'Email',
  EMAIL_PLACEHOLDER = 'john.doe@example.com',
  LIKED_MOVIE = 'Liked Movie',
  LIKED_MOVIE_PLACEHOLDER = 'Avatar',
  CREATE_BUTTON = 'Create User',
  UPDATE_BUTTON = 'Update User'
}

export enum MEDICINE_FORM_LABELS {
  TITLE = 'Medicine Information',
  NAME = 'Name:',
  NAME_PLACEHOLDER = 'Paracetamol',
  LABORATORY = 'Laboratory:',
  LABORATORY_PLACEHOLDER = 'Pfizer',
  PRESENTATION = 'Presentation:',
  PRESENTATION_PLACEHOLDER = 'Pills, Syrup, or other',
  EXPIRATION_DATE = 'Expiration Date:',
  EXPIRATION_DATE_PLACEHOLDER = '11/2/2025',
  USED_FOR = 'Used For:',
  USED_FOR_PLACEHOLDER = 'Muscle pain relief',
  SIDE_EFFECTS = 'Side Effects:',
  SIDE_EFFECTS_PLACEHOLDER = 'Nausea, dizziness',
  COMMENTS = 'Additional Comments:',
  COMMENTS_PLACEHOLDER = 'Take with food',
  SUBMIT_BUTTON = 'Add Medicine',
  SUCCESS = 'Medicine added successfully!'
}

export enum MEDICINE_FORM_ERRORS {
  NAME_REQUIRED = 'Name is required',
  NAME_MIN = 'Name must be at least 1 character',
  NAME_MAX = 'Name must be at most 50 characters',
  LABORATORY_MAX = 'Laboratory must be at most 50 characters',
  PRESENTATION_REQUIRED = 'Medicine presentation is required',
  USED_FOR_MAX = 'Used For must be at most 75 characters',
  SIDE_EFFECTS_MAX = 'Side Effects must be at most 100 characters',
  COMMENTS_MAX = 'Comments must be at most 200 characters'
}
