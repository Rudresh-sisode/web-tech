FROM node
# take node image into my custom image

WORKDIR /app
# set working directory

COPY package.json /app

RUN npm install
# install all dependencies

COPY . /app
# copy all files from current directory to working directory

EXPOSE 80
# expose port 80

CMD ["node", "server.js"]
# run server.js file

