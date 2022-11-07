FROM node:18-buster-slim as base

WORKDIR /opt/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential python3 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./.env /opt/app/
COPY ./package.json /opt/app/
COPY ./yarn.lock /opt/app/
COPY ./.yarnrc.yml /opt/app/
COPY ./.swcrc /opt/app/
COPY ./tsconfig.eslint.json /opt/app/
COPY ./tsconfig.json /opt/app/
COPY --chown=node:node .yarn/ .yarn/
COPY --chown=node:node scripts/ scripts/

RUN sed -i 's/"prepare": "husky install\( .github\/husky\)\?"/"prepare": ""/' ./package.json

ENTRYPOINT ["dumb-init", "--"]

FROM base as build

RUN yarn

COPY . /opt/app/

RUN yarn build

FROM base as production

ENV NODE_ENV="production"

COPY --from=build /opt/app/dist /opt/app/dist
COPY --from=build /opt/app/node_modules /opt/app/node_modules
COPY --from=build /opt/app/package.json /opt/app/package.json

RUN chown node:node /opt/app/

USER node

CMD [ "yarn", "start"]


