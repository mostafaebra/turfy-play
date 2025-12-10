# API Request/Response Documentation

## Endpoint
**URL:** `http://turfywafaa.runasp.net/Turfy/FilterFieldsEndpoint/Filter`  
**Method:** `POST`  
**Content-Type:** `application/json`

## Request Body Structure

The backend (C#) expects all properties, even if they are `null`:

```json
{
  "lat": null,                    // double? (nullable)
  "lng": null,                    // double? (nullable)
  "sportType": null,              // byte? (nullable) - 0=Soccer, 1=Basketball, 2=Tennis, 3=Volleyball, 4=Padel, 5=Squash
  "priceStart": null,             // decimal? (nullable)
  "priceEnd": null,               // decimal? (nullable)
  "Rating": null,                 // int? (nullable) - minimum rating (e.g., 3, 4, 4.5)
  "sortBy": 0,                    // byte (required) - 0=Best Match, 1=Lowest Price, 2=Highest Price, 3=Highest Rated, 4=Nearest
  "lastCursorValue": null,        // string? (nullable) - for pagination
  "lastId": null,                 // int? (nullable) - for pagination
  "limit": 8                      // int (required) - number of items per page
}
```

## Example Request (All Filters Empty)

```json
{
  "lat": null,
  "lng": null,
  "sportType": null,
  "priceStart": null,
  "priceEnd": null,
  "Rating": null,
  "sortBy": 0,
  "lastCursorValue": null,
  "lastId": null,
  "limit": 8
}
```

## Example Request (With Filters)

```json
{
  "lat": 37.7749,
  "lng": -122.4194,
  "sportType": 0,
  "priceStart": 10.0,
  "priceEnd": 200.0,
  "Rating": 4,
  "sortBy": 2,
  "lastCursorValue": null,
  "lastId": null,
  "limit": 8
}
```

## Response Structure

The backend returns a `CursorPage<T>` object:

```json
{
  "items": [
    {
      "id": 1,
      "fieldId": 1,
      "name": "Field Name",
      "fieldName": "Field Name",
      "sportType": 0,
      "sport": "Soccer",
      "rating": 4.5,
      "averageRating": 4.5,
      "location": "Address",
      "address": "Full Address",
      "city": "City Name",
      "distance": 2.5,
      "price": 50.0,
      "pricePerHour": 50.0,
      "hourlyRate": 50.0,
      "image": "url",
      "imageUrl": "url",
      "photo": "url"
    }
  ],
  "nextCursorValue": "cursor_string",
  "nextCursorTieBreakerId": 123,
  "hasMore": true
}
```

## Field Mappings

### Sport Types (sportType)
- `0` = Soccer/Football
- `1` = Basketball
- `2` = Tennis
- `3` = Volleyball
- `4` = Padel
- `5` = Squash

### Sort Options (sortBy)
- `0` = Best Match
- `1` = Lowest Price
- `2` = Highest Price
- `3` = Highest Rated
- `4` = Nearest to Me

## How to Debug

1. **Check Browser Console** - Look for logs starting with `=== API REQUEST ===` and `=== API RESPONSE ===`
2. **Check Network Tab** - In DevTools, go to Network tab and find the POST request to `/Filter`
3. **Check Request Payload** - See what JSON is being sent
4. **Check Response** - See what the server is returning

## Common Issues

1. **CORS Error** - Backend needs to allow requests from your frontend origin
2. **400 Bad Request** - Check if all required fields are present
3. **500 Server Error** - Backend issue, check server logs
4. **Network Error** - Check if the URL is correct and server is running

