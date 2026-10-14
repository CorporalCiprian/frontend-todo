FROM node:24.0 AS build

WORKDIR /app

ENV VITE_API_URL='https://ca-backend-todo-dev.delightfulwave-91558e9c.westeurope.azurecontainerapps.io'

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS deploy

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]