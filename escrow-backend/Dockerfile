
# base image  
FROM python:3.10-slim 
# setup environment variable  
ENV DockerHOME=/home/app/escrow-backend  
ENV CELERY_BROKER_URL=redis://redis:6379
ENV CELERY_RESULT_BACKEND=redis://redis:6379

# set work directory  
RUN mkdir -p $DockerHOME
# Add the contents of the escrow-backend directory to the escrow-backend directory

COPY . /$DockerHOME

# Set the working directory for the container. I.e. all commands will be based out of this directory
WORKDIR $DockerHOME

# set environment variables  
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1  

# install dependencies  
RUN pip install --upgrade pip  

# run this command to install all dependencies  
RUN pip install -r requirements.txt  
# port where the Django app runs  
EXPOSE 8000
# start server and celery 
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "escrowbot.wsgi"]

CMD ["./start.sh"]