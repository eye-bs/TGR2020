const plotly = require('plotly')("kriratik", "PISQIH0NkYCMQ3QUo4ln");
// https://chart-studio.plot.ly/

var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "test"};

plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});
