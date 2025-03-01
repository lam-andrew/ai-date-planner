# Step 1: Build Frontend (React)
FROM node:18 AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./

# Inject ENV variables into React
ARG REACT_APP_GOOGLE_PLACES_API_KEY
ENV REACT_APP_GOOGLE_PLACES_API_KEY=$REACT_APP_GOOGLE_PLACES_API_KEY
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Step 2: Build Backend (FastAPI)
FROM python:3.11 AS backend

WORKDIR /app

# Copy built frontend into backend static directory
COPY --from=frontend-builder /app/frontend/build ./frontend/build

COPY backend .
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables for FastAPI
ARG GOOGLE_PLACES_API_KEY
ARG OPENAI_API_KEY
ENV GOOGLE_PLACES_API_KEY=$GOOGLE_PLACES_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

# Step 3: Run FastAPI Backend and Serve Frontend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
