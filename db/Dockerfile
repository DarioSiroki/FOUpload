FROM mysql:latest

ENV MYSQL_DATABASE hacklica
ENV MYSQL_ROOT_PASSWORD 1234

ADD setup.sql /docker-entrypoint-initdb.d
