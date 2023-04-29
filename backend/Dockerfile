FROM node:18


WORKDIR /home/kavya.b/Project-01/profConnect/backend


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000 4050 3500

#Define the command

ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]
