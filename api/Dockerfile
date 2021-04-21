FROM node:15-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . ./
CMD ["npm","start"]

# FROM nginx
# COPY --from=build-stage /app/build /usr/share/nginx/html
# COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf