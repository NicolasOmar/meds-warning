#!/bin/bash

# Script to create a shadcn component in a dedicated folder
# Usage: ./create-component.sh (interactive prompt for component name)

# Ask user for component name
read -p "📝 Please, enter the component name: " COMPONENT_NAME

if [ -z "$COMPONENT_NAME" ]; then
  echo "Sorry, the provided component name is empty. Please try again."
  exit 1
fi

# Define the component folder path
COMPONENT_DIR="./components/$COMPONENT_NAME"

# Check if component already exists
if [ -d "$COMPONENT_DIR" ]; then
  echo "Have in mind. Folder \"$COMPONENT_NAME\" already exists at $COMPONENT_DIR"
fi

# Run the shadcn add command
if npx shadcn@latest add "$COMPONENT_NAME" -p "$COMPONENT_DIR"; then
  # Rename the component file to index.tsx
  COMPONENT_FILE="$COMPONENT_DIR/$COMPONENT_NAME.tsx"
  if [ -f "$COMPONENT_FILE" ]; then
    mv "$COMPONENT_FILE" "$COMPONENT_DIR/index.tsx"
    echo "The component [$COMPONENT_NAME] has been successfully created in '$COMPONENT_DIR' and renamed to [index.tsx]"
  else
    echo "The component [$COMPONENT_NAME] has been successfully created in '$COMPONENT_DIR'"
  fi
else
  echo "Error trying to create component $COMPONENT_NAME"
  exit 1
fi
