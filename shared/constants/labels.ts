// COMMON LABELS
export enum COMMON_FORM_LABELS {}

export enum COMMON_FORM_ERRORS {
  FORM_INPUTS_ERROR = 'Sended information has an error. Please read and correct the commented fields.',
  SUBMISSION_ERROR = 'An error occurred while submitting the form. Please try again later.'
}

export enum COMMON_TABLE_ERRORS {
  NO_DATA = 'No data available'
}

// PAGE LEVEL LABELS
export enum ROOT_PAGE_LABELS {
  WELCOME_MESSAGE = 'Welcome to this Meds Warning. Please navigate to the [Medicine] page to add new medicines or to the [Concept] page to check its base implementation'
}

export enum ROOT_LAYOUT_LABELS {
  METADATA_TITLE = 'Meds Warning',
  METADATA_DESCRIPTION = 'A web system to help users manage and track their medication expiration dates and remind them to renew them'
}

export enum MEDICINE_PAGE_LABELS {
  WELCOME_MESSAGE = 'Welcome to the Medicine Page. Please select any of the options above to explore more.'
}

// FORM LEVEL LABELS
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
  CREATE_SUCCESS = 'Medicine added successfully!',
  UPDATE_SUCCESS = 'Medicine updated successfully!'
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

// TABLE LEVEL LABELS
export enum MEDICINE_TABLE_LABELS {
  TITLE = 'Medicine List',
  HEADERS = 'ID,Name,Laboratory,Presentation,Expiration Date,Used For,Side Effects,Comments,Actions'
}
