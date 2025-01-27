FROM python:3.9-alpine

WORKDIR /app

COPY ./rosterAPI/requirements.txt ./

RUN pip install --no-cache-dir -r ./rosterAPI/requirements.txt

COPY ./rosterAPI .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

EXPOSE 5000

CMD ["flask", "run"]