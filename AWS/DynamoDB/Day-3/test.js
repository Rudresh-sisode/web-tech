let s = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "CompareData",
    "type": "array",
    "items": {
        "properties": {
            "age": { "type": "integer" },
            "height": { "type": "integer" },
            "income": { "type": "integer" }
        },
        "required": ["age", "height", "income"]
    }

}