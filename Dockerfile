#--->Latest version of alpine node
FROM mhart/alpine-node:latest


#---> Copy package.json into temp folder
#---> Install dependencies
ADD package.json /tmp/package.json  	
RUN cd /tmp && npm install

#---> Copy our project source code into /opt/app dir in image
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

#---> Change working dir
#---> Copy code from local host into app dir
WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3000

CMD ["npm", "start"]


#Its good to remember that each line creates a new image layer that'll be cached
#