const request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const tf = require('@tensorflow/tfjs-node');



// request({
//     url: 'https://jan08-782c3.firebaseio.com/morning.json',
//     json: true
// }, function (err, res, json) {
//     if (err) {
//         throw err;
//     }

//     var keys = Object.keys(json);
//     var jsonArr = [];

//     for (let i = 0; i < keys.length; i++) {
//         var topic = json[keys[i]].topic;
//         var split = topic.split("/");
//         json[keys[i]].topic = split[4]
//         jsonArr.push(json[keys[i]]);
//     }

//     toFile(jsonArr)
// });




function toFile(json, filename, header) {
    const csvWriter = createCsvWriter({
        path: filename,
        header: header
    });
    csvWriter
        .writeRecords(json)
        .then(() => console.log('The CSV file was written successfully'));

}

async function getData() {

    const dataset = tf.data.csv('file://BLEdata.csv', {
        hasHeader: true
    });
    // console.log(dataset);
    let v = await dataset.toArray();
    var xs = [];
    var ys = [];
    var mapAddress = {
        "80:E1:26:07:C4:0A": "board15",
        "80:E1:26:07:D2:6F": "board30",
        "80:E1:26:07:E3:79": "board12",
        "80:E1:26:07:E0:F2": "board33"
    }
    var stackTime = ""
    var arr = [];
    var ob = {};
    for (let i = 0; i < v.length; i++) {
        var timeStamp = v[i].timestamp;
        var team = v[i].team;
        var dateTime = timeStamp.split(" ");
        var time = dateTime[1].substring(0, 5)
        var rssi = v[i].rssi;
        var macOf = mapAddress[v[i].mac]

        if (time == stackTime) {
            ob[macOf] = rssi
        } else {
            if(ob.user != undefined){
                arr.push(ob);
            }
            ob.board12 = ob.board12 == undefined ? -404 : ob.board12
            ob.board15 = ob.board15 == undefined ? -404 : ob.board15
            ob.board30 = ob.board30 == undefined ? -404 : ob.board30
            ob.board33 = ob.board33 == undefined ? -404 : ob.board33

            stackTime = time;
            ob = {};
            ob["user"] = team
            ob["time"] = stackTime
            ob[macOf] = rssi
        }

    }
    // console.log(arr)
    return arr
}

async function run() {

    var labelJson = await getData()
    var headerLabel = [{
            id: 'user',
            title: 'device'
        },
        {
            id: 'time',
            title: 'timestamp'
        },
        {
            id: 'board12',
            title: 'board12'
        },
        {
            id: 'board15',
            title: 'board15'
        },
        {
            id: 'board30',
            title: 'board30'
        },
        {
            id: 'board33',
            title: 'board33'
        }
    ]
     toFile(labelJson, "label.csv", headerLabel)

}

run()
    .then(() => {
        console.log("RUN SUCCESSFUL");
    })
    .catch(err => console.log(err));