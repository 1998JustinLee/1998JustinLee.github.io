var hotels = [];
var filtered = [];
var distances = [];
var markers = [];

var map = null;

// Init map
function initMap() {
  var adl = {lat: -34.9284989, lng: 138.6007456};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: adl,
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    }

  });

  //---------- Place autocomplete testing ----------//
  var input = document.getElementById('mainSearch');
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }


    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }


    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
  });

  // Clear map
  clearMarkers();

  // Populate map
  addMarkers();
}

function clearMarkers() {
   for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

filtered = [
  {
  'pos_lat': -34.9224989,
  'pos_lng': 138.6067456,
  'price': 160,
  'rating': 2,
  'main_image': 1,
  'name': "Hilton Adelaide"
  },
  {
  'pos_lat': -34.9384989,
  'pos_lng': 138.6007456,
  'price': 1200,
  'rating': 3,
  'main_image': 2,
  'name': "Mantra Hindmarsh Square"
  },
  {
  'pos_lat': -34.9184989,
  'pos_lng': 138.6007456,
  'price': 420,
  'rating': 2,
  'main_image': 3,
  'name': "Ibis Adelaide"
  },
  {
  'pos_lat': -34.9284989,
  'pos_lng': 138.6007456,
  'price': 20,
  'rating': 4,
  'main_image': 4,
  'name': "Paradise Interchange Hotel"
  },
  {
  'pos_lat': -34.9244989,
  'pos_lng': 138.6007456,
  'price': 9,
  'rating': 1,
  'main_image': 5,
  'name': "Letoh Hotel"
  },
  {
  'pos_lat': -34.9284989,
  'pos_lng': 138.5907456,
  'price': 1000,
  'rating': 6,
  'main_image': 55,
  'name': "Manager Exclusive Hotel"
  },
  {
  'pos_lat': -34.9284989,
  'pos_lng': 138.6089456,
  'price': 10,
  'rating': 1,
  'main_image': 54,
  'name': "Interesting Hotel"
  }
]

// Populate map with markers from hotels array info
function addMarkers() {
  // Loop over hotels array
  var icons;
  for (let i = 0; i < filtered.length; i++) {

    icons = {
      url: "images/marker.png", // url
  	  scaledSize: new google.maps.Size(54, 30), // scaled size
  	  origin: new google.maps.Point(0,0), // origin
  	  anchor: new google.maps.Point(0, 0), // anchor
      labelOrigin: new google.maps.Point(26,13) //label position
  	};

    // Create new marker

    var marker = new google.maps.Marker({
      position: {lat: filtered[i].pos_lat, lng: filtered[i].pos_lng},
      icon: icons,
      label: {
        text: "$"+filtered[i].price.toString(),
        color: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      },
      zIndex: i,
      map: map
    });

    //Infowindow made here

    infowindow = new google.maps.InfoWindow({
      minWidth: 200
    });

    google.maps.event.addListener(marker, 'click', function() {
      //Rating System
      var stars = "";
      if(filtered[i].rating==6){
        stars = "No ratings";
      }else{
        for(var j=0;j<filtered[i].rating;j++){
          stars += "&#10029;";
        }
        for(var k=filtered[i].rating;k<5;k++){
          stars += "&#10025;";
        }
      }

      infowindow.setContent(
        '<div style="min-width:200px;min-height:100px;margin-top:5px">'+
        '<div style="float:left">'+
        '<img src="'+
        'images/'+filtered[i].main_image+
        '" alt="hotel" title="Your Hotel" style="height:100px;width:100px;object-fit: cover;margin:auto;display:block"></div>'+

        '<div style="float:left;margin-left:10px;max-width:140px">'+
        '<div style="word-break:keep-all;display:block;font-size:15px"><b>'+filtered[i].name+'</b></div>'+

        '<div style="margin:0px;margin-top:10px;padding:0px;">'+
        'From $'+filtered[i].price+' per night.'+
        '</div>'+

        '<div style="margin:0px;margin-top:10px;padding:0px;">'+
        stars+
        '</div>'+

        '</div>'+
        '</div>'+

        '<div width="100px" style="display:block;padding:0px;margin-top:10px;text-align:center;">'+
        '<button id="mapview_detailsbutton_'+i+'" style="margin:auto;">Details</button>'+
        '</div>'
      );

      infowindow.open(map, this);

      let buttonDetails = '#mapview_detailsbutton_' + i;
      $(buttonDetails).click(function() {
        hoteldetailsMarker(filtered[i]);
      });

    });

    // Add to markers array
    markers.push(marker);
  }
}

function includeHTML() {
  "use strict";
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("data-w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("data-w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}

// ====================== MAIN FUNCTIONS ===================== //

$(document).ready(function() {
  'use strict';
  requestHotels(function() {
    hotelCards();
    date_initial();
    check_inputs();
    initMap();
    $('#map').hide();
  });
});

// ====================== SLIDER UPDATING ===================== //
function occupantsslide(index){
  $('#occupants').change(function() {
    $('#numOccupants').val(index);
  });
}

function occupantschange(index){
  $('#numOccupants').change(function() {
    $('#occupants').val(index);
  });
}

function priceslide(index){
  $('#price').change(function() {
    $('#maxPrice').val(index);
  });
}

function pricechange(index){
  $('#maxPrice').change(function() {
    $('#price').val(index);
  });
}

function distanceslide(index){
  $('#dist').change(function() {
    $('#maxDist').val(index);
  });
}

function distancechange(index){
  $('#maxDist').change(function() {
    $('#dist').val(index);
  });
}

function starsslide(index){
  $('#stars').change(function() {
    $('#minStars').val(index);
  });
}

function starschange(index){
  $('#minStars').change(function() {
    $('#stars').val(index);
  });
}

function requestHotels(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      hotels = JSON.parse(xhttp.responseText);
      callback();
    }
  };

  xhttp.open("GET", "getHotels.json", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

}

// ============ DYNAMIC DATA GENERATION: HOTEL CARDS ========= //

function link_moredetails(index) {
  "use strict";
  return function() {
    hoteldetails.call(this, index);
  };
}

function toRadians(valu) {
  return valu * Math.PI / 180;
}

/**
 * Show hotel cards taking into account filters
 */
function hotelCards() {
  showHotels();
  $('#hotelcards').empty();
  mdl_upgrade();
  $('#hoteldetails_overlay').fadeOut();

  filtered = [];
  distances = [];

  var lat = -34.9284989;
  var lng = 138.6007456;

  for (let i = 0; i < hotels.length; i++) {
    var Radii = 6371000; // metres
    var lat2 = hotels[i].pos_lat;
    var lng2 = hotels[i].pos_lng;
    var φ1 = toRadians(lat);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians((lat2 - lat));
    var Δλ = toRadians((lng2 - lng));

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = Radii * c;
    d = d / 1000;
    distances.push(d);
  }

  for (let i = 0; i < hotels.length; i++) {
    if (hotels[i].price == null) continue;
    if (hotels[i].rating == null) hotels[i].rating = 1;
    if (hotels[i].price <= $('#price').val()) {
      if (hotels[i].rating >= $('#stars').val()) {
        //if (distances[i] <= $('#dist').val()) {
           if (hotels[i].min_occupants >= $('#occupants').val()) {
            filtered.push(hotels[i]);
           }
        }
    //  }
    }
  }

  if(filtered.length == 0){
    let div = $('<div/>').appendTo("#hotelcards");
    $('<h2/>').text("We couldn't find anything that suits your needs :(").css("margin-top","0px").appendTo(div);
    $('<p/>').html("Unfortunately, we haven't been able to find any hotels that match your requirements.<br> Try refining your with the sliders on the left to find some available hotels!").appendTo(div);
  }

  for (let i = 0; i < filtered.length; i++) {
    var div_main = $('<div/>').addClass("hotel-card mdl-card mdl-shadow--2dp").appendTo("#hotelcards");
    // Change the background picture here
    var insertBg = `url('images/${filtered[i].main_image}') center / cover`;
    var div_title = $('<div/>').addClass("mdl-card__title").appendTo(div_main).css("background", insertBg);
    // Change the hotel name here
    $('<h2/>').addClass("mdl-card__title-text").html(filtered[i].name).appendTo(div_title);
    // Change the hotel details here
    $('<p/>').addClass("mdl-card__supporting-text").html("From " + "$" + filtered[i].price.toString() + " per night.").appendTo(div_main);
    $('<div/>').addClass("mdl-card__supporting-text").html(filtered[i].description).appendTo(div_main);
    var div_buttons = $('<div/>').addClass("mdl-card__actions mdl-card--border").appendTo(div_main);
    $('<a/>')
      .click(link_moredetails.call(this, filtered[i]))
      .addClass('mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent').html('More details').appendTo(div_buttons);
  }
}

/**
 * This function controls the hotel details overlay that appears
 * when the user clicks the 'more details' button for a hotel
 * @param {num} index The selected hotel's ID
 */
function hoteldetails(hotelInput) {
  // Request rooms from server
  let allrooms = [];
  let rooms = [];
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      allrooms = JSON.parse(xhttp.responseText);

      for (let i = 0; i < allrooms.length; i++) {
        if (allrooms[i].price <= $('#price').val()) {
          if (allrooms[i].stars >= $('#stars').val()) {
            if (allrooms[i].occupants >= $('#occupants').val()) {
              rooms.push(allrooms[i]);
            }
          }
        }
      }
      $('#hotel_info_room').empty();
      for (let i = 0; i < rooms.length; i++) {
        let stars = getStars(rooms[i].stars);
        let roomForBooking = $('#hotel_info_room').append('<h3>' + rooms[i].name + '</h3><p class="roomPrice">Room for ' + rooms[i].occupants + ', $' + rooms[i].price + ' per night / ' + stars + '</p><p>' + rooms[i].description + '</p>');
        $('<button/>')
          .addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent')
          .html('Book Now')
          .appendTo(roomForBooking)
          .click(function() {
            bookingpage(hotelInput, rooms[i], 1);
          });
        $('<button/>')
          .addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent reviewAccordion')
          .html('Reviews')
          .css('text-transform', 'none')
          .appendTo(roomForBooking);
        $('<div/>').attr('id', rooms[i].room_id).addClass('reviewPanel').appendTo(roomForBooking);
        reviewFilling(rooms[i], roomForBooking, hotelInput);
        $('<hr>').appendTo(roomForBooking);
      }

      let acc = document.getElementsByClassName('reviewAccordion');
      for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', function() {
          this.classList.toggle('active');
          let panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        });
      }
    }
  };
  xhttp.open('POST', 'getRooms.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(hotelInput));

  $('#confirmation_overlay').fadeOut();
  $('#hd_hotelname').html(hotelInput.name);
  $('#hotel_info_p').html(hotelInput.description);
  $('#hoteldetails_overlay').fadeIn();
  // DYNAMIC DATA: Get the image
  var getimage = $(this).parents("div").siblings(".mdl-card__title").css("backgroundImage") + " center / cover";
  $('.imagescroller').css("background", getimage);
  $('#hd_backbutton').click(function() {
    $('#hoteldetails_overlay').fadeOut();
  });

  mdl_upgrade();
}

function reviewFilling(id, booking, hotel) {
  let reviews = [];
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      reviews = JSON.parse(xhttp.responseText);
      if (reviews.length === 0) {
        $('<h5/>')
          .html("There are no reviews for this room.<br><br>Be the first to review this room!")
          .appendTo('#' + id.room_id);
        return;
      }

      for (let i = 0; i < reviews.length; i++) {
          var stars = getStars(reviews[i].stars);

          $('<h5/>')
            .html(reviews[i].name_first+" "+reviews[i].name_last)
            .appendTo('#' + id.room_id);
          $('<p/>')
            .html(stars + '<br>' + reviews[i].review)
            .appendTo('#' + id.room_id);
      }
    }
  };

  xhttp.open('POST', 'getReviews.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(id));
}

function getStars(length) {
  if (length == 6) {
    return "No ratings";
  }
  var stars = "";
  for (var j = 0; j < length; j++) {
    stars += "&#10029;";
  }
  for (var k = length; k < 5; k++) {
    stars += "&#10025;";
  }
  return stars;
}

/**
 * This function executes when the user presses the Book Now button
 * @param {hotelObject} hotelInput The selected hotel
 * @param {roomObject} roomInput The room object corresponding
 *   to the selected room for the selected hotel
 */
function bookingpage(hotelInput, roomInput, variable) {

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (JSON.parse(xhttp.responseText).login !== 0) {
        $('.userHidden').remove();

        loginInputRed();
      }
    }
  };
  xhttp.open('GET', '/usersession.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();

  $('#map').hide();
  $('.mdl-layout__content').animate({
    scrollTop: 0
  });
  $('#bookingpage_overlay').show();
  $('#hoteldetails_overlay').fadeOut();
  $('#hotelcards').fadeOut();

  $('.bookingContent').fadeIn(function() {
  //  sizes();
  });
  bookingData(hotelInput, roomInput);
  $('#hotelname_underbox').css('margin-bottom', 0).html(hotelInput.name);

  // Show main image
  $('.boximage').html(`<img alt='Hotel' title='Your Hotel' class='boximage' src='images/${hotelInput.main_image}' />`);

  // Cancel and go back, variable determines whether you're on the map or the hotel cards
  $('#bk_backbutton').click(function() {

    if (variable == 1) {
      $('#hotelcards').fadeIn();
      $('#hoteldetails_overlay').fadeIn();
    } else {
      $('#map').show();
      $('#hotelcards').css('display', 'none');
      $('#hotelcards').hide();
      $('#hoteldetails_overlay').fadeIn();
    }
    $('.bookingContent').fadeOut(function() {
      $('#bookingpage_overlay').hide();
    });
  });

  // Confirm and book
  $('button[name="CompleteBooking"]').click(function() {
    submitted(hotelInput, roomInput, variable);
  });
}

// ====================== MISC FUNCTIONS  =================== //
// Get Date
Date.prototype.today = (function(tomorrow) {
  "use strict";
  var local = new Date(this);
  if (tomorrow) {
    local.setDate(local.getDate() + 1);
  }
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

function date_initial() {
  "use strict";
  var a = moment();
  var b = moment().add(1, 'days');
  $('#check-in').val(a.format('YYYY-MM-DD'));
  $('#check-out').val(b.format('YYYY-MM-DD'));

  // Update on blur
  $('#check-in, #check-out, #room-num, #adult-num, #child-num').blur(function() {
    bookingData();
  });
}

function check_inputs() {
  "use strict";
  var nodeList = document.querySelectorAll('.mdl-textfield');
  Array.prototype.forEach.call(nodeList, function(elem) {
    elem.MaterialTextfield.checkDirty();
  });
}

// ====================== Map FUNCTIONS  =================== //
function mapGeneral() {
  $('#hotelcards').toggle(function() {
    currentView = 1;
  });
  $('#map').toggle(function() {
    currentView = 0;
  });
}

// ====================== Overlay functions =================== //
function hilton() {
  $('div#hilton_overlay').fadeIn();
}
function hiltonhide() {
  $('div#hilton_overlay').fadeOut();
}
function mantra() {
  $('div#mantra_overlay').fadeIn();
}
function mantracl() {
  $('div#mantra_overlay').fadeOut();
}
function ibis() {
  $('div#ibis_overlay').fadeIn();
}
function ibiscl() {
  $('div#ibis_overlay').fadeOut();
}
function paradise() {
  $('div#paradise_overlay').fadeIn();
}
function paradisecl() {
  $('div#paradise_overlay').fadeOut();
}
function letoh() {
  $('div#letoh_overlay').fadeIn();
}
function letohcl() {
  $('div#letoh_overlay').fadeOut();
}
function manager() {
  $('div#manager_overlay').fadeIn();
}
function managercl() {
  $('div#manager_overlay').fadeOut();
}
function interesting() {
  $('div#interesting_overlay').fadeIn();
}
function interestingcl() {
  $('div#interesting_overlay').fadeOut();
}
