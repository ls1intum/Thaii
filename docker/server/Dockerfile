FROM python:3.12.4-slim-bookworm

WORKDIR /server

COPY ./server .

RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt --no-cache-dir && \
    chmod +x /server/entrypoint.sh

EXPOSE 8000

CMD [ "/server/entrypoint.sh" ]