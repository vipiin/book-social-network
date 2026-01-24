#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Run Spring Boot with prod profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
