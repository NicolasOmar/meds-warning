// COMMON LABELS
export enum COMMON_LABELS {
  DELETE = 'Delete',
  EDIT = 'Edit',
  SAVE = 'Save',
  CANCEL = 'Cancel',
  CONFIRM_DELETE = 'Confirm Deletion'
}

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

export enum PRESENTATION_PAGE_LABELS {
  WELCOME_MESSAGE = 'Welcome to the Presentation Page. Please select any of the options above to explore more.'
}

// TABLE LEVEL LABELS
export enum MEDICINE_TABLE_LABELS {
  TITLE = 'Medicine List',
  HEADERS = 'ID,Name,Laboratory,Presentation,Expiration Date,Used For,Side Effects,Comments,Actions',
  DELETE_SUCCESS = 'Medicine deleted successfully!',
  DELETE_ERROR = 'An error occurred while deleting the medicine. Please try again later.'
}
