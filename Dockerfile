FROM node

WORKDIR /DebtApp

COPY package*.json ./

COPY . /DebtApp

RUN npm install prettier -g

RUN npm install

RUN npm install cors -g

EXPOSE 3030

CMD [ "node", "app.js" ]

