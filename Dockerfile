#########################
### build environment ###
#########################

# base image
FROM node:26.2.0-alpine3.22 AS builder

# set working directory
ARG WORK_DIR=/usr/app
WORKDIR ${WORK_DIR}

# add `/usr/app/node_modules/.bin` to $PATH
ENV PATH=${WORK_DIR}/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ${WORK_DIR}/

RUN npm install

# add app
COPY . ${WORK_DIR}/

# generate build
RUN npm run build

##################
### production ###
##################

# base image
FROM nginxinc/nginx-unprivileged:1.31.1-alpine3.23

# copy nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# copy artifact build from the 'build environment'
COPY --from=builder /usr/app/dist /usr/share/nginx/html

# expose port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# run nginx
CMD ["nginx", "-g", "daemon off;"]
