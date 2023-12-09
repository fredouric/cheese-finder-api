## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Cheese API Endpoints

[Liste des Fromages Français](https://public.opendatasoft.com/explore/dataset/fromagescsv-fromagescsv/table/?flg=fr-fr&disjunctive.fromage)

Cheeses with no locations were filtered out in our implementation.  
Since the "image" field in the original API is empty for most entries, we decided not to use it.  

### Get Cheeses
- **Endpoint**: `/cheeses`
- **Method**: `GET`
- **Query Parameters**:
  - `id` (Optional): Retrieve a specific cheese by UUID.
- **Description**: Get all cheeses or a specific cheese by UUID.

### Search Cheese
- **Endpoint**: `/cheeses/search`
- **Method**: `GET`
- **Query Parameters**:
  - `fromage` (Required): Search for cheeses by name.
- **Description**: Search for cheeses by name.

### Add Cheese
- **Endpoint**: `/cheeses`
- **Method**: `POST`
- **Request Body**: JSON object representing a new cheese (`Cheese` interface).
- **Description**: Add a new cheese to the collection.

### Toggle Favorite
- **Endpoint**: `/cheeses`
- **Method**: `PUT`
- **Request Body**: JSON object with the property `id` representing the UUID of the cheese to toggle.
- **Description**: Toggle the favorite status of a cheese.

## Cheese Finder App

[Cheese Finder App](https://github.com/fredouric/cheese-finder-app)

