// 2  2am
// 4  4am
// 12 noon
// 16 4pm
// 18 8pm
// 20 10pm
// 24 midnight


// from conservatory
var conservatory_paths =  [ {"newLocation":"A Forest Path", "text":"> Exit through the front door and walk down the narrow path into the forest..."},
                            {"newLocation":"The Aviary", "text":"> Walk behind the conservatory to the aviary..."} ];
//
// // from forest
var forest_paths =        [ {"newLocation":"The Conservatory", "text":"> Walk into the clearing ahead with the wrought iron and glass building..."},
                            {"newLocation":"The Meadow", "text":"> Take a path towards the meadow..."} ];

// from meadow
var meadow_paths =        [ {"newLocation":"A Forest Path", "text":"> Take the path into the forest..."},
                            {"newLocation":"The Aviary", "text":"> Walk up the hill towards the chirping noises..."} ];

// from aviary
var aviary_paths =        [ {"newLocation":"The Meadow", "text":"> Take the path down the hill to the meadow..."},
                            {"newLocation":"The Conservatory", "text":"> Walk around to the front of the conservatory..."} ];





function run() {
  clear_narrative();

  // figure out what time of day we are in
  var date_object = new Date();
  var current = date_object.getHours();
  console.log("current time:", current);

  var location = document.getElementById('location').innerHTML;
  if (location=="The Conservatory") {
    story = conservatory[0];
    paths = conservatory_paths;
  } else if (location=="A Forest Path") {
    story = forest_path[0];
    paths = forest_paths;
  } else if (location=="The Meadow") {
    story = meadow[0];
    paths = meadow_paths;
  } else if (location=="The Aviary") {
    story = aviary[0];
    paths = aviary_paths;
  } else {

  }

  // console.log(story)
  for (var setting in story) {
    if (story.hasOwnProperty(setting)) {
      var thisSetting = story[setting];
      for (const [key, value] of Object.entries(thisSetting)) {
        // console.log(key, value);
        // if current hour is between start and end
        if (value.start <= current && value.end >= current) {
          addEvent(value.text)
        // if midnight occurs between start and end
        } else if (value.end <= value.start) {
          if (value.end >= current) {
            addEvent(value.text)
          } else if (current >= value.start) {
            addEvent(value.text)
          }
        }
      }
    }
  }

  var paths_div = document.getElementById('paths');
  for (var i = 0; i < paths.length ; i++) {
    console.log(paths[i])
    path = paths[i];
    console.log(path.newLocation);
    console.log(path.text);
    var div = document.createElement('p');
    div.innerHTML = path.text;
    div.setAttribute("onclick","change_location('"+path.newLocation+"')");
    paths_div.appendChild(div);
  }
}

function clear_narrative() {
  var narrative = document.getElementById('narrative');
  while (narrative.firstChild) {
    narrative.removeChild(narrative.firstChild);
  }
  var paths_div = document.getElementById('paths');
  while (paths_div.firstChild) {
    paths_div.removeChild(paths_div.firstChild);
  }
}

function addEvent(event) {
  var narrative = document.getElementById('narrative');
  var div = document.createElement('div');
  div.innerHTML = event;
  narrative.appendChild(div);
}

function change_location(newLocation) {
  var location = document.getElementById('location');
  location.innerHTML = newLocation;
  run();
}
