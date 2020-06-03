# deconcentrator-js

![Icon](.documentation/DeconcentratorJSLogo100.png "Icon")

> BeuthBot deconcentrator written in JavaScript

## Functionality

The deconcentrator uses different NLU processors to compare their results
and tries to choose an best fitting answer. The NLU processors like RASA
must know their domain on their own. The deconcentrator simply compares
the confidence store of the intents given from the processors and returns
the found intent.

## Getting Started

There are two different ways to start the deconcentrator which will be described as following.

### npm
Using npm you simply type in the following command.
```shell script
# install dependencies
$ npm install

# start running the deconcentrator at localhost:8338
$ npm start run
```
This will run the deconcentrator on it's default port `8338` and with the default RASA service url `http://localhost:5005/model/parse`.

### docker-compose.yml

Using docker-compose is prossibly the easiest way of running the deconcentrator. Simply type
```shell script
$ docker-compose up
```
to run a container with the deconcentrator. The docker-compose file also uses port `8338` as a default one. The endpoint of RASA is taken from the `.env`. Make sure to edit it to your needs. Have a look at the sample file `.env.sample` and the section [.env](#.env).

## API

The API of the deconcentrator has two endpoints whereas the 

```
GET   http://localhost:8338
```

```
POST  http://localhost:8338/messages
```

## Request Schema - `Message`

```json
{
  "text": "Wie wird das Wetter morgen?",
  "min_confidence_score": 0.8,
  "processors": ["rasa"]
}
```

Whereas the specification of the `min_confidence_score` and the
`processors` is optional. If not minimum confidence score is given
a default one is used (by now this is `0.8`). For now there is only
the usage of RASA implemented so there is no effect of specifying
the `processors` property.

#### Class Diagramm

![alternative text](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/beuthbot/deconcentrator-js/master/.documentation/uml/message.txt)

## Response Schema - `Answer`
The response for a successfully processed request to the deconcentrator contains the following information.
```json
{
  "intent": {
    "name": "wetter",
    "confidence": 0.9518181086
  },
  "entities": [
    {
      "start": 20,
      "end": 26,
      "text": "morgen",
      "value": "2020-01-20T00:00:00.000+01:00",
      "confidence": 1.0,
      "additional_info": {
          "values": [
              {
                  "value": "2020-01-20T00:00:00.000+01:00",
                  "grain": "day",
                  "type": "value"
              }
          ],
          "value": "2020-01-20T00:00:00.000+01:00",
          "grain": "day",
          "type": "value"
      },
      "entity": "time"
    }
  ],
  "text": "Wie wird das Wetter morgen?"
}
```

The response for a unsuccessfully processed request to the deconcentrator or when an error occures contains the following information.
```json
{
  "error": "The given message can't be interpretated.",
  "text": "Wie wird das Wetter morgen?"
}
```

#### Class Diagramm

![alternative text](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/beuthbot/deconcentrator-js/master/.documentation/uml/answer.txt)

## Domain

### processor.js

// tbd

##### Implemented Processors
* [rasa-processor.js](model/rasa-processor.js)

### processor-queue.js

// tbd

## Add new NLU processor

// tbd

## .env

With the `.env` file the deconcentrator can be configured. The following
demonstrates a sample file. The same content can be found in the
`.env.sample` file of the project.

```
RASA_ENDPOINT=http://0.0.0.0:5005/model/parse
```

## Technologies

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [axios](https://github.com/axios/axios)

## Implemented and connected NLU processors

* RASA ([RASA Link](https://rasa.com/docs/rasa/)) ([BeuthBot RASA Link](https://rasa.com/docs/rasa/))

### More possible NLU processors

- [Microsoft LUIS](https://azure.microsoft.com/de-de/services/cognitive-services/language-understanding-intelligent-service/)
- [Google Cloud NLU](https://cloud.google.com/natural-language/)
- [IBM Watson NLU](https://www.ibm.com/watson/services/natural-language-understanding/)

## Requirements Analysis

* [ ] 
* [ ] 

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/beuthbot/deconcentrator-js/releases)

## Authors

* Lukas Danckwerth - Initial work - [GitHub](https://github.com/lukasdanckwerth)

See also this list of [contributors](https://github.com/beuthbot/mensa_microservice/graphs/contributors)