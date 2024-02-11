$(document).ready(function () {
  const checkedAmenities = {};
  $(document).on('change', "input[data-type='amenity']", function () {
    handleCheckboxChange($(this), checkedAmenities, 'div.amenities h4');
  });

  const checkedStates = {};
  $(document).on('change', "input[data-type='state']", function () {
    handleCheckboxChange($(this), checkedStates, 'div.locations h4');
  });

  const checkedCities = {};
  $(document).on('change', "input[data-type='city']", function () {
    handleCheckboxChange($(this), checkedCities, 'div.locations h4');
  });

  function handleCheckboxChange (checkbox, checkedItems, resultSelector) {
    const itemId = checkbox.data('id');
    const itemName = checkbox.data('name');

    if (checkbox.prop('checked')) {
      checkedItems[itemId] = itemName;
    } else {
      delete checkedItems[itemId];
    }

    $(resultSelector).text(Object.values(checkedItems).join(', '));
  }

  // Rest of your code for API status check, initial data load, and search button click handling...

  // use localhost for testing if not working because of CORS otherwise use 0.0.0.0
  $.get('http://localhost:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  // use localhost for testing if not working because of CORS otherwise use 0.0.0.0
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: '{}',
    dataType: 'json',
    success: function (data) {
      for (const place of data) {
        AddPlaces(place);
      }
    }
  });

  // use localhost for testing if not working because of CORS otherwise use 0.0.0.0
  $('button').click(function () {
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(checkedAmenities), states: Object.keys(checkedStates), cities: Object.keys(checkedCities) }),
      dataType: 'json',
      success: function (data) {
        $('section.places').empty();
        for (const place of data) {
          AddPlaces(place);
        }
      }
    });
  });

  function AddPlaces (place) {
    $('section.places').append(
        `<article>
            <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
            </div>
            <div class="description">
                ${place.description}
            </div>
        </article>`);
  }
});
