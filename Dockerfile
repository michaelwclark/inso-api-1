# Use an official Node runtime at a specific sha256
FROM node:lts-alpine@sha256:2c405ed42fc0fd6aacbe5730042640450e5ec030bada7617beac88f742b6997b as base

# Set the working directory to /src
WORKDIR /src

# Copy package.json to the working directory
COPY package.json .

# Install any needed packages specified in package.json
RUN npm i

# Copying the rest of the code to the working directory
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Build the application
RUN npm run build



# ------------------------------
# Production Stage
#
# Uses base step and copies
# compiled js from source
# ------------------------------

FROM base as prod

# hadolint ignore=DL3018
RUN apk --no-cache add build-base py3-pip python3-dev dumb-init

COPY --chown=node:node --from=base /src/dist /src/dist

# Just make sure that we're not running as root
USER node

CMD ["npm", "run", "start:prod"]