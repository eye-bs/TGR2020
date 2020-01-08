const request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


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

        toFile(jsonArr)
    });




function toFile(json) {
    const csvWriter = createCsvWriter({
        path: 'BLEdata.csv',
        header: [{
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
            },
        ]
    });
    csvWriter
        .writeRecords(json)
        .then(() => console.log('The CSV file was written successfully'));

}

