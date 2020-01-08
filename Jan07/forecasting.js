const tf = require('@tensorflow/tfjs-node');


async function createData(filename) {
    const dataset = tf.data.csv('file://./' + filename, {hasHeader: true});
    const v = await dataset.take(2).toArray();
    v.forEach((line) => {
        console.log(line);  
    });
    const xs = [];
    const ys = [];
    for (var i = 0; i <= num_pts; i++) {
        xs.push(i);
        ys.push(2 * i + Math.random());
    }

    return { xs,ys };

}

async function trainModel(filename,xs,ys) {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: num_nodes,
        activation: "sigmoid",
        inputShape: [1]
      })
    );
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));
    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });
    
    const loss_arr = [];
    const tf_xs = tf.tensor1d(xs);
    const tf_ys = tf.tensor1d(ys);

    await model.fit(tf_xs, tf_ys, {
        epochs: 500,
        callbacks: {
            onEpochEnd: (epochs, log) => loss_ass.push(log.loss)
        }
    });
    hist = tf.summary.histogram

    return model,hist;
}

function predict(model,xv) {
    const tf_xv = tf.tensor1d(xv)
    yv = model.predict(tf_xv).dataSync();
    return yv
}
