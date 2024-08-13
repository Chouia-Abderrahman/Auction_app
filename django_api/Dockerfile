# django_api/Dockerfile

# Use the official Python image as the base image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8000 (or the port your Django app runs on)
EXPOSE 8000

# Run migrations and start the Django server
CMD ["sh", "-c", "python manage.py makemigrations backend && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
