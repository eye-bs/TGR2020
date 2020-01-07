const fs = require('fs');

const rawdata = fs.readFileSync('./me.json');
let jsondata = JSON.parse(rawdata);

fs.readFile('./me.json', (err,data) => {
    console.log('can read: ' + data)
})

let jsondata = JSON.parse(rawdata)

console.log(typeof(jsondata), jsondata.Name);
jsondata.salary.forEach(element => {
    console.log(element);
});