# beuthbot-deconcentrator
BeuthBot deconcentrator written in JavaScript

## Functionality

The deconcentrator uses different NLU processors to compare their results
and tries to choose an best fitting answer. The NLU processors like RASA
must know their domain on their own. The deconcentrator simply compares
the confidence store of the intents given from the processors and returns
the found intent.

## Implemented and connected NLU processors

* RASA ([RASA Link](https://rasa.com/docs/rasa/)) ([BeuthBot RASA Link](https://rasa.com/docs/rasa/))

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

## Response Schema - `Answer`
If return following response.
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

## More possible NLU processors

- [Microsoft LUIS](https://azure.microsoft.com/de-de/services/cognitive-services/language-understanding-intelligent-service/)
- [Google Cloud NLU](https://cloud.google.com/natural-language/)
- [IBM Watson NLU](https://www.ibm.com/watson/services/natural-language-understanding/)
