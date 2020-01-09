
var url44 = "http://202.139.192.121/api/pm25/44";
var url45 = "http://202.139.192.121/api/pm25/45";
var url46 = "http://202.139.192.121/api/pm25/46";
var url47 = "http://202.139.192.121/api/pm25/47";

var urlArr = [url44,url45,url46,url47];

var u = "https://rocky-gorge-34614.herokuapp.com/lands/5dfcabe6666c642250d2ec59"

function connectToServer(url, body, typ) {
    return Promise.resolve(
      $.ajax({
        url: url,
        type: typ,
        dataType: "json",
        data: body,
        contentType: "application/json"
      })
    );
  }

function getPM(position){
    setTimeout(function(){
    var sensor = connectToServer(urlArr[position],"","GET");
    var icon = {
        url: "images/antenna.png", // url
        scaledSize: new google.maps.Size(80, 80), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    var circel = {
        url: "images/Good.png", // url
        scaledSize: new google.maps.Size(150, 150), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };
    sensor.then(data =>{
        var radius = new google.maps.Marker({
            position: pmArr[position],
            title: data.pm + "",
            icon: circel,
            map: map
          });
        var marker = new google.maps.Marker({
            position: pmArr[position],
            title: data.pm + "",
            icon: icon,
            map: map
          });
          google.maps.event.addListener(
            marker,
            "click",
            (function(marker) {
              return function() {
                  console.log(data.pm , "click")
                  console.log(data.sensor_id)
                var context =
                  '<div><h3>'+data.pm+'</h3></div>';
                infowindow.setContent(context);
                infowindow.open(map, marker);
              };
            })(marker)
          );
          getPM(position)
    },function(err){
        console.log(err.message);
    })
    },10000);
}

function run(){
    getPM(0);
    getPM(1);
    getPM(2);
    getPM(3);
}



