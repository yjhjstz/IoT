# Pull base image.
FROM ubuntu:14.04


# Install MongoDB.
RUN \
  apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
  echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
  apt-get update && \
  apt-get install -y mongodb-org && \
  rm -rf /var/lib/apt/lists/*

RUN apt-get update
RUN apt-get install -y python-software-properties curl git wget build-essential
# Define mountable directories.
VOLUME ["/data/db"]

# Define working directory.
WORKDIR /data

# Define default command.
CMD ["mongod"]

# Expose ports.
EXPOSE 27017:27017
EXPOSE 8081
EXPOSE 1883:1883


# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
RUN apt-get install -y nodejs
# Define working directory.

RUN cd /home
RUN git clone https://github.com/yjhjstz/IoT.git /home/IoT

WORKDIR /home/IoT
RUN npm install 
RUN npm install -g pm2
RUN pm2 start app


# Define default command.
CMD ["bash"]
