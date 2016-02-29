# v1

Load *index.html* in the browser.

* This implementation has only two external javascript lib dependencies
  * **Google Maps** - Used to Load Map Canvas
  * **moment.js** - Used to convert UTC returned by OpenWeatherMaps to ``Local Time'' based on the latitude and longitude of the point of interest, 
  and not on the localtime of the Computer on which it is running, as is done by plain vanilla javascript *Date* function.

* On loading, the page will ask for your whether you would like to share your location.
  * If you say ``Allow'', it will load the weather details of your current location as a information window on the Google Maps Canvas
  * If you say ``Deny'', it will load the Google Maps centered around a default location. By clicking on your point of interest,
  you can view the current weather information at that location.
* On Small Screens (less than 1000px), the information window contains only the temperature data, whereas on bigger screens (greather than 1000px), the information window contains detailed weather information. Line height is also automatically adjusted based on the screen size.
* In addition to the Map, you will also notice two text-fields continously being updated when mouse is moved over the Map canvas. It should the latitude and longitude of the point under the mouse cursor.
* **Note**: In order for the page to ask your location, you should serve the file through an HTTP server. Opening the file locally ``file:///'' won't ask for your current geolocation.
