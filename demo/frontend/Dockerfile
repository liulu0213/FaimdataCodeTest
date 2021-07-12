FROM node:12 as builder

RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    libnss3

# Add package.json first to cache dependencies use Docker build layer
COPY ./portal/package.json /app/
RUN cd app && npm i
ENV NODE_ENV :dev
ENV port 8000
#ENV REACT_APP_API_BASE_URL https://container-api-dev.faimdata.com
ENV REACT_APP_API_DATASOURCE_URL https://monitor-demo.faimdata.com
ENV REACT_APP_GMap_API_KEY AIzaSyC-yagI4Qdko85TVXXsAn9KGIiZug9ymU8

COPY ./portal /app
RUN cd app &&\
    npm i &&\
    npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY ./portal/ui-containers.conf /etc/nginx/conf.d/ui-containers.conf

COPY --from=builder /app/build /usr/share/nginx/html/

