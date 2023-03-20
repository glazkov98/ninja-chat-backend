FROM node:14 as builder

ENV NODE_ENV build
ENV NODE_OPTIONS '--max-old-space-size=8192'

#USER node
WORKDIR /app

COPY . /app

RUN npm install \
    && npm run build

# ---

FROM node:14

ENV NODE_ENV build
#ENV NODE_ENV production

#USER node
WORKDIR /app

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/dist/ /app
RUN rm -rf /app/migrations
COPY --from=builder /app/migrations/ /app/migrations
#COPY --from=builder /app/migration_common/ /app/migration_common
COPY docker-entrypoint.sh /app
RUN chmod +x /app/docker-entrypoint.sh

#RUN chmod 777 /usr/local/bin/docker-entrypoint.sh && \
#    ln -s usr/local/bin/docker-entrypoint.sh /
RUN npm install

CMD ["./docker-entrypoint.sh"]
