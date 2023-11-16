FROM python:3.8

RUN apt-get update

RUN mkdir -p /dialog_api
COPY requirements4docker.txt /dialog_api
WORKDIR /dialog_api

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN python -m pip install -r requirements4docker.txt