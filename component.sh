#!/bin/bash

# Script to create a shadcn component in a dedicated folder
# Usage: ./create-component.sh (interactive prompt for component name)

# Ask user for component name
read -p "Please, enter the component name: " COMPONENT_NAME

if [ -z "$COMPONENT_NAME" ]; then
  echo "Sorry, the provided component name is empty. Please try again."
  exit 1
fi

# Define the component folder path
COMPONENT_DIR="./components/base/$COMPONENT_NAME"

# Check if component already exists
if [ -d "$COMPONENT_DIR" ]; then
  echo "Have in mind. Folder \"$COMPONENT_NAME\" already exists at $COMPONENT_DIR"
fi

# Run the shadcn add command
if npx shadcn@latest add "$COMPONENT_NAME"; then
  # Rename the component file to index.tsx
  echo "The component [$COMPONENT_NAME] has been successfully created in '$COMPONENT_DIR'"
else
  echo "Error trying to create component $COMPONENT_NAME"
  exit 1
fi
