var position44 = {
    lat: 19.166391,
    lng: 99.901908
};
var position45 = {
    lat: 19.177149,
    lng: 99.812571
}
var position46 = {
    lat: 19.176477,
    lng: 99.88926
}
var position47 = {
    lat: 19.021294,
    lng: 99.897926
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: position44,
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