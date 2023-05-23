#!/bin/bash

# Set the Terraform version to install
TERRAFORM_VERSION="1.2.9"

# Determine the operating system and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Download the Terraform binary
curl -LO "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_${OS}_${ARCH}.zip"

# Unzip the Terraform binary
unzip "terraform_${TERRAFORM_VERSION}_${OS}_${ARCH}.zip"

# Move the Terraform binary to a directory in the system PATH
sudo mv terraform /usr/local/bin/

# Verify the Terraform installation
terraform --version
