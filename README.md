# gatsby-source-nasa

This source plugin for Gatsby will make NASA image URLs available in GraphQL queries.

## Installation

```sh
# Install the plugin
yarn add gatsby-source-nasa
```

In `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-nasa',
      options: {
        key: "YOUR_NASA_API_KEY",
        images: [
          {
            type: 'apod',
            date:
          },
          {
            type: 'epic',
            date:
          }
        ]
      },
    }
  ]
};
```

**NOTE:** To get a NASA API key, [register here](https://api.nasa.gov/index.html#apply-for-an-api-key).

## Configuration Options

The configuration options for this plugin are currently very small. You can set 'apod' and/or 'epic' types and provide an optional date in YYYY-MM-DD format.

### Example Configuration

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-nasa',
      options: {
        key: process.env.NASA_API_KEY,
        images: [
          {
            type: 'apod',
            date: '2019-01-01'
          },
          {
            type: 'epic',
            date: '2019-01-01'
          }
        ]
      }
    }
  ]
};
```

## Querying NASA image information

Once the plugin is configured, one new query is available in GraphQL: `allNasaData`.

Here are example queries to load APOD and EPIC images:

```gql
query ApodQuery {
  allNasaData(filter: {type: {eq: "apod"}}) {
    edges {
      node {
        type
        date
        url
      }
    }
  }
}
```

```gql
query EpicQuery {
  allNasaData(filter: {type: {eq: "epic"}}) {
    edges {
      node {
        type
        date
        url
      }
    }
  }
}
```

See the GraphiQL UI for info on all returned fields.
