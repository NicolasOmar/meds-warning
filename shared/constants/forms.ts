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

export enum PRESENTATION_FORM_LABELS {
  TITLE = 'Presentation Information',
  DESCRIPTION = 'Description:',
  DESCRIPTION_PLACEHOLDER = 'Brief description of the presentation',
  SUBMIT_BUTTON = 'Create Presentation',
  CREATE_SUCCESS = 'Presentation created successfully!',
  UPDATE_SUCCESS = 'Presentation updated successfully!'
}

export enum PRESENTATION_FORM_ERRORS {
  DESCRIPTION_REQUIRED = 'Description is required',
  DESCRIPTION_MIN = 'Description must be at least 1 character',
  DESCRIPTION_MAX = 'Description must be at most 100 characters',
  ALREADY_CREATED = 'A presentation with this description already exists'
}

export enum SETTINGS_FORM_LABELS {
  TITLE = 'Other Settings',
  DAYS_TO_NOTIFY = 'Days to Notify:',
  DAYS_TO_NOTIFY_PLACEHOLDER = 'Enter number of days',
  SUBMIT_BUTTON = 'Save Settings',
  UPDATE_SUCCESS = 'Settings updated successfully!'
}

export enum SETTINGS_FORM_ERRORS {
  DAYS_TO_NOTIFY_REQUIRED = 'Days to Notify is required and must be a number',
  DAYS_TO_NOTIFY_MIN = 'Days to Notify must be at least 1',
  DAYS_TO_NOTIFY_MAX = 'Days to Notify must be at most 365'
}

export enum USER_FORM_LABELS {
  TITLE = 'User Information',
  NAME = 'Name:',
  NAME_PLACEHOLDER = 'John',
  LAST_NAME = 'Last Name:',
  LAST_NAME_PLACEHOLDER = 'Doe',
  PASSWORD = 'Password:',
  REPEAT_PASSWORD = 'Repeat Password:',
  PASSWORD_PLACEHOLDER = 'Enter your password',
  REPEAT_PASSWORD_PLACEHOLDER = 'Repeat your password',
  EMAIL = 'Email:',
  EMAIL_PLACEHOLDER = 'john.doe@example.com',
  DAYS_TO_NOTIFY = 'Days to Notify:',
  DAYS_TO_NOTIFY_PLACEHOLDER = '30',
  SUBMIT_BUTTON = 'Create User',
  CREATE_SUCCESS = 'User created successfully!',
  UPDATE_SUCCESS = 'User updated successfully!'
}

export enum USER_FORM_ERRORS {
  NAME_REQUIRED = 'Name is required',
  NAME_MIN = 'Name must be at least 1 character',
  NAME_MAX = 'Name must be at most 100 characters',
  LAST_NAME_MAX = 'Last name must be at most 100 characters',
  PASSWORD_REQUIRED = 'Password is required',
  PASSWORD_MIN = 'Password must be at least 8 characters',
  PASSWORD_MAX = 'Password must be at most 100 characters',
  PASSWORDS_NOT_MATCH = 'Passwords do not match',
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_INVALID = 'Email must be a valid email address',
  EMAIL_MAX = 'Email must be at most 100 characters',
  DAYS_TO_NOTIFY_REQUIRED = 'Days to Notify is required and must be a number',
  DAYS_TO_NOTIFY_MIN = 'Days to Notify must be at least 1',
  DAYS_TO_NOTIFY_MAX = 'Days to Notify must be at most 365'
}

export enum LOGIN_FORM_LABELS {
  TITLE = 'Login',
  EMAIL = 'Email:',
  EMAIL_PLACEHOLDER = 'your.email@example.com',
  PASSWORD = 'Password:',
  PASSWORD_PLACEHOLDER = 'Enter your password',
  SUBMIT_BUTTON = 'Log in',
  CREATE_ACCOUNT = 'Create account',
  SUCCESS = 'Login successful!',
  SUBTITLE = 'Sign in to manage your medications'
}

export enum LOGIN_FORM_ERRORS {
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_INVALID = 'Email must be a valid email address',
  PASSWORD_REQUIRED = 'Password is required',
  PASSWORD_MIN = 'Password must be at least 8 characters',
  INVALID_CREDENTIALS = 'Invalid email or password'
}
