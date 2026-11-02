# ============================================================
# SHAURYA MITTAL | DEVELOPER PROFILE API
# File: Dockerfile
# Purpose: Containerise the Flask application
# ============================================================

# Use an official lightweight Python image
FROM python:3.12-slim

# Set container working directory
WORKDIR /app

# Prevent Python from generating bytecode
ENV PYTHONDONTWRITEBYTECODE=1

# Ensure Python logs appear immediately
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definitions first
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY data.json .
COPY profile.json .
COPY social-links.json .
COPY interests.json .
COPY config.yaml .

# Expose Flask application port
EXPOSE 5000

# Run the Flask application
CMD ["python", "app.py"]

# ============================================================
# END OF DOCKERFILE
# ============================================================
