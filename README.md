# Azure Maps API's prototype for LuciadRIA 

## Description
The azuremapsapi package provides OGC API functionalities to LuciadRIA Application.

Implements
* __Azure Maps API for LuciadRIA__ 

The Main Components are:

* __AzureMapTilesModel__:  a ready to use LuciadRIA Raster model capable to retrieve tiles from Azure Map tiles
* __AzureMapSearchAddress__:  search for an address using Azure Maps location API
* __AzureMapGeocoding__:  perform a search for features at a lon, lat location using Azure Maps location API



## To build
This is the source code that produces a library delivered as a npm package. 
To build the source code use the npm scripts:
```
npm install
npm run build
```
Then you can publish the package to npm or other repository

## To test
Some test have been added that runs using nodejs using Jest. No browser test is available at the moment.
The test uses isomorphic-fetch to provide fetch in node testing with jest. It also emulates the canvas to retrieve the tiles using img.onload.
```
npm run test
```
Before running the test you need to define a .env file at the root folder of the project with the Azure Maps API Key and the LuciadRIA licwnse
```env
AZURE_KEY=YOUR_AZURE_MAPS_KEY
LICENSE='# YOUR LuciadRIA LICENSE 
           In MULTIPLE ROWS BETWEEN SINGLE QUOTES
#'
```

## To use in your project

Simply import the NPM package into your project

```
npm install azuremapsapi
``` 

For Maps and Tiles use OgcOpenApiMapsModel and OgcOpenApiTilesModel:
```typescript
import {AzureMapTilesModel} from "azuremapsapi/lib/AzureMapTilesModel";
```
AzureMapTilesModel extend from UrlTileSetModel, so you can use it in combination with RasterTileSetLayer. 
Look at the LuciadRIA documentation if you need further information on using RasterTileSetLayer. 


## Requirements
* LuciadRIA 2023.1 or higher (place LuciadRIA on a local npm repository for instance verdaccio )
* A ES6 or Typescript capable transpiler. 
