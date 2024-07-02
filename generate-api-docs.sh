#!/bin/bash

# URL of the JSON data
url="http://localhost:3000/api-docs-json"

# Output file for JSON data
output_file="./src/api-docs.json"

# Use curl to retrieve JSON data from URL and save it to the output file
curl -s "$url" -o "$output_file"

# Check if curl command was successful
if [ $? -eq 0 ]; then
  echo "JSON content copied from $url to $output_file"
else
  echo "Error: Failed to retrieve JSON content from $url"
fi
