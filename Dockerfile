# Stage 1: build
FROM node:14.16.1-buster-slim as build

WORKDIR /home/node

# Install all dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the API
COPY babel.config.js ./
COPY src/ src/
RUN yarn build

# Stage 2: run
FROM node:14.16.1-buster-slim

WORKDIR /home/node

# Install runtime dependencies
COPY --from=build /home/node/package.json /home/node/yarn.lock ./
ENV NODE_ENV production
RUN yarn install --frozen-lockfile

# Get the built app
COPY --from=build /home/node/dist/ dist/

# Configure startup
EXPOSE 3001
USER node
ENTRYPOINT [ "node" ]
CMD [ "dist/index.js" ]
