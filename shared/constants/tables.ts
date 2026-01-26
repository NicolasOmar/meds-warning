export enum MEDICINE_TABLE_LABELS {
  TITLE = 'Medicine List',
  HEADERS = 'ID,Name,Laboratory,Presentation,Expiration Date,Used For,Side Effects,Comments,Actions',
  EDIT_EXPIRATION_DATE_LABEL = 'Change Expiration Date',
  NEW_EXPIRATION_DATE_LABEL = 'New Expiration Date:',
  SEARCH_PLACEHOLDER = 'Search by its name',
  DELETE_QUESTION = 'Are you sure you want to delete this medicine? This action cannot be undone.',
  DELETE_SUCCESS = 'Medicine deleted successfully!'
}

export enum MEDICINE_TABLE_ERRORS {
  DELETE_ERROR = 'An error occurred while deleting the medicine. Please try again later.'
}

export enum MEDICINE_PRESENTATION_TABLE_LABELS {
  TITLE = 'Medicine Presentations',
  HEADERS = 'ID,Description,Actions',
  DELETE_SUCCESS = 'Medicine presentation deleted successfully!',
  DELETE_ERROR = 'An error occurred while deleting the medicine presentation. Please try again later.'
}
