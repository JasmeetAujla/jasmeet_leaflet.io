var queryUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var queryUrl2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// GET request to query the URL
d3.json(queryUrl , function(data1) {
    d3.json(queryUrl2, function(data2) {

        createFeatures(data1.features, data2.features);
        console.log(data1.features)
        console.log(data2.features)
    })
});

geojsonObject = {
    geometry: {
        coordinates: (3) [-116.2546667, 33.3766667, -0.04],
        type: "Point"
    },
    properties: {
        mag: 0.94, 
        type: "earthquake"
    }
}


function createFeatures(earthquakes, faultlines) {

    //define function to se circle color
    function circleColor(magnitude) {
        if (magnitude <1) {
            return "#ccff33"
        }
        else if (magnitude <2) {
            return "#ffff33"
        }
        else if (magnitude <3) {
            return "#ffcc33"
        }
        else if (magnitude <4) {
            return "#ff9933"
        }
        else if (magnitude <5) {
            return "#ff6633"
        }
        else {
            return "#ff3333"
        }
    }


    var radius = 1.5
    var earthRadius = earthquakes.map(d => d.properties.mag * radius)
    var earthColur = earthquakes.map(d => circleColor(d.properties.mag))

    // get the circles in an array
    var circles = earthquakes.map(function(x, index) {

        return L.circleMarker([x.geometry.coordinates[1] , x.geometry.coordinates[0]],
            // option for circleMarker
            {radius: earthRadius[index],
            fillColor: earthColur[index],
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8}
            ).bindPopup(
                // name of place, maginutde, magtype, time
                `<h3>${x.properties.title}</h3>` +
                `<h4>${x.properties.mag}</h4>` +
                `<h5>${x.properties.magType}</h5>` +
                `<h6>${x.properties.time}</h6>`
            );
        });

    //var faults = faultlines.map()


    var faults = L.geoJSON(faultlines, {
        style: function(feature) {
            return {color: "#FFA500",
                    weight: 4};
        }
    });

    console.log(circles);
    console.log(faults);
    // apply to create map function
    createMap(circles, faults)
}

function createMap(circles, faults) {

    //define outdoorap, satellite map and layers

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id : "mapbox.outdoors",
    accessToken : API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id : "mapbox.satellite",
    accessToken : API_KEY
    });

    var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id : "mapbox.light",
    accessToken : API_KEY
    });

    


    //define a basemaps object
    var baseMaps = {
        "Outdoor Map" : outdoorsmap,
        "Greyscale Map" : grayscalemap,
        "Satellite Map" : satellitemap
    };

    var circleLayerGroup = L.layerGroup(circles);
    var faultLayerGroup = L.layerGroup(faults);


    //create overlay object to hold our overlay layer

    var overlayMaps = {
        Earthqyakes : circleLayerGroup,
        Faultlines  : faultLayerGroup
    };

    //create our map
    var myMap = L.map("map" , {
    center : [
        37.09 , -95.71
    ] ,
    zoom : 4,
    layers : [outdoorsmap , circleLayerGroup , faultLayerGroup]
    });

    //create a layer control , add layers to the map
    L.control.layers(baseMaps, overlayMaps , {
        collapsed : false
    }).addTo(myMap);
}
















// var queryUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// // GET request to query the URL
// d3.json(queryUrl , function(data) {
//     createFeatures(data.features);
//         console.log(data.features)
// });

// function createFeatures(earthquakeData) {

//     //Define the function we will run for each feature
//     function onEachFeature(feature , layer) {
//         layer.bindPopup("<h3>" + feature.properties.place +
//         "</h3><hr><p>" + new Date (feature.properties.time) + "</p>");
//     }

//     //define function to create circle radius
//     function radiusSize(magnitude) {
//         return magnitude * 20000;
//     }

//     //define function to se circle color
//     function circleColor(magnitude) {
//         if (magnitude <1) {
//             return "#ccff33"
//         }
//         else if (magnitude <2) {
//             return "#ffff33"
//         }
//         else if (magnitude <3) {
//             return "#ffcc33"
//         }
//         else if (magnitude <4) {
//             return "#ff9933"
//         }
//         else if (magnitude <5) {
//             return "#ff6633"
//         }
//         else {
//             return "#ff3333"
//         }
//     }

//     //create a GeoJSOM layer
//     var earthquakes = L.geoJSON(earthquakeData , {
//         pointToLayer: function(earthquakeData , latlng) {
//             return L.circle (latlng , {
//                 radius : radiusSize(earthquakeData.properties.mag),
//                 color : circleColor(earthquakeData.properties.mag),
//                 fillOpacity : 1
//             });
//         },
//         onEachFeature : onEachFeature
//     });

//     //send earthquakes layer to createMap function
//     createMap(earthquakes);
// }

// function createMap(earthquakes) {

//     //define outdoorap, satellite map and layers

//     var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id : "mapbox.outdoors",
//     accessToken : API_KEY
//     });

//     var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id : "mapbox.satellite",
//     accessToken : API_KEY
//     });

//     var grayscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id : "mapbox.light",
//     accessToken : API_KEY
//     });

//     //create the faultline layer 
//     var faultline = new L.LayerGroup();

//     //define a basemaps object
//     var baseMaps = {
//         "Outdoor Map" : outdoorsmap,
//         "Greyscale Map" : grayscalemap,
//         "Satellite Map" : satellitemap
//     };

//     //create overlay object to hold our overlay layer

//     var overlayMaps = {
//         Earthqyakes : earthquakes,
//         Faultlines  : faultline
//     };

//     //create our map
//     var myMap = L.map("map" , {
//     center : [
//         37.09 , -95.71
//     ] ,
//     zoom : 4,
//     layers : [outdoorsmap , earthquakes , faultLine]
//     });

//     //create a layer control , add layers to the map
//     L.control.layers(baseMaps, overlayMaps , {
//         collapsed : false
//     }).addTo(myMap);

// //query to retrive the faultline data
// var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// //create the faultlines and add them 
// d3.json(faultlinequery , function(data) {
//     L.geoJSON(data , {
//         style : function() {
//             return {color : "orange" , fillOpacity :0}
//         }
//     }).addTo(faultline)
// })

// //color function to be used when creating the legend 
// function getColor(d) {
//     return d > 5 ? '#ff3333' :
//            d > 4 ? '#ff6633' :
//            d > 3 ? '#ff9933' :
//            d > 2 ? '#ffcc33' :
//            d > 1 ? '#ffff33' :
//                     '#ccff33' ;
// }

// //add legend to the map
// var legend = L.control({position :'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div' , 'info legend'),
//     mags = [0,1,2,3,4,5],
//     labels = [];

//     //loop through density intervals
//     for (var i = 0 ; i< mags.length; i++) {
//         div.innerHTML +=
//         '<i style = "background:' + getColor(mags[i] + 1) + '"></i>' +
//         mags[i] + (mags[i + 1] ? '&ndash;' + mgs[i + 1] + '<br>' : '+');
//     }
//     return div;
// };

// legend.addTo(myMap);

// }

