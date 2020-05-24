# beuthbot-deconcentrator
BeuthBot deconcentrator written in JavaScript

## Functionality

The deconcentrator uses different NLU processors to compare their results
and tries to choose an best fitting answer. The NLU processors like RASA
must know their domain on their own. The deconcentrator simply compares
the confidence store of the intents given from the processors.

## Implemented and connected NLU processors

* RASA

## `Message` - Request Model
```json
{
  "text": "Wie wird das Wetter morgen?",
  "confidence_score": 0.8
}
```
#### More possible properties could be:
* "strategy" - for using different strategies
* "processors" - specifying a list of processor to use

## `Answer` - Response Model
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
      "entity": "time",
      "extractor": "DucklingHTTPExtractor"
    }
  ],
  "intent_ranking": [
    {
      "name": "wetter",
      "confidence": 0.9518181086
    },
    {
      "name": "mensa",
      "confidence": 0.0119743915
    }
  ],
  "text": "Wie wird das Wetter morgen?"
}
```

## More possible NLU processors
