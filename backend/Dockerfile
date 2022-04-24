FROM python:3.10.2-alpine

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJ_DEBUG 0

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev libffi-dev

RUN pip install --upgrade pip
RUN pip install poetry
COPY pyproject.toml .
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

COPY . .
RUN chmod +x bin/*.sh

RUN python manage.py collectstatic --noinput

CMD daphne -b 0.0.0.0 -p 8000 devproject.asgi:application