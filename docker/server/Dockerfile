# Use Python slim image
FROM python:3.12.4-slim-bookworm

# Set the working directory inside the Docker image
WORKDIR /server

# Copy only the requirements first to leverage caching
COPY ../../server/requirements.txt .

# Create and activate the virtual environment, then install dependencies
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt --no-cache-dir

# Copy the rest of the server code into the Docker image
COPY ../../server .

# Ensure entrypoint script has execute permissions
RUN chmod +x /server/entrypoint.sh

# Expose the application port
EXPOSE 8000

# Run the entrypoint script
CMD [ "/server/entrypoint.sh" ]
