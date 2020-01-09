var defultLocation = {
    lat: 19.166391,
    lng: 99.901908
  };

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: defultLocation,
      zoom: 16,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: "roadmap"
    });
  
    infowindow = new google.maps.InfoWindow({
      content: contentString
    });
  }
  