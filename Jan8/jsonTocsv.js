const request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const tf = require('@tensorflow/tfjs-node');


async function getJsonBLE() {
    request({
        url: 'https://jan08-782c3.firebaseio.com/morning.json',
        json: true
    }, function (err, res, json) {
        if (err) {
            throw err;
        }

        var keys = Object.keys(json);
        var jsonArr = [];

        for (let i = 0; i < keys.length; i++) {
            var topic = json[keys[i]].topic;
            var split = topic.split("/");
            json[keys[i]].topic = split[4]
            jsonArr.push(json[keys[i]]);
        }

        var headerLabel = [{
            id: 'mac_addr',
            title: 'mac'
        },
        {
            id: 'rssi',
            title: 'rssi'
        },
        {
            id: 'timestamp',
            title: 'timestamp'
        },
        {
            id: 'topic',
            title: 'team'
        }
    ]

        toFile(jsonArr , "BLEdata.csv" , headerLabel)
    });
}

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
        "80:E1:26:07:C4:0A": "gate15",
        "80:E1:26:07:D2:6F": "gate30",
        "80:E1:26:07:E3:79": "gate12",
        "80:E1:26:07:E0:F2": "gate33"
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
            if (ob.user != undefined) {
                arr.push(ob);
            }
            ob.gate12 = ob.gate12 == undefined ? -404 : ob.gate12
            ob.gate15 = ob.gate15 == undefined ? -404 : ob.gate15
            ob.gate30 = ob.gate30 == undefined ? -404 : ob.gate30
            ob.gate33 = ob.gate33 == undefined ? -404 : ob.gate33

            var compare = [ob.gate12 , ob.gate15 , ob.gate30 , ob.gate33];
            var newCP = [1,0,0,0];
            var keys = [1,2,3,4]
            var near = keys[0];
            var stack = 0
            for(let j = 1; j <= compare.length; j++){
                if(compare[stack] < compare[j]){
                    newCP[j] = 1
                    newCP[stack] = 0
                    stack = j
                    near = keys[j]
                }
            }
            ob.near = newCP;
            stackTime = time;
            ob = {};
            ob["user"] = team
            ob["time"] = stackTime
            ob[macOf] = rssi
        }

    }
    return arr
}

async function run() {

  // await getJsonBLE()

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
            id: 'gate12',
            title: 'gate12'
        },
        {
            id: 'gate15',
            title: 'gate15'
        },
        {
            id: 'gate30',
            title: 'gate30'
        },
        {
            id: 'gate33',
            title: 'gate33'
        },
        {
            id: 'near',
            title: 'near'
        }
    ]
    toFile(labelJson, "label.csv", headerLabel)

}

run()
    .then(() => {
        console.log("RUN SUCCESSFUL");
    })
    .catch(err => console.log(err));