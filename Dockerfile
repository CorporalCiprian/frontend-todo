FROM node:24.0 AS build

WORKDIR /app

ARG VITE_API_URL = https://ca-backend-todo-dev.whitesmoke-f94160ee.westeurope.azurecontainerapps.io

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]