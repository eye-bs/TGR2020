const tf = require('@tensorflow/tfjs');

async function createData(filename) {
    const dataset = tf.data.csv(filename, {
        hasHeader: true
    });
    const v = await dataset.take(2).toArray();
    
}

function trainModel(filename) {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: num_nodes,
        activation: "relu", 
        inputShape: [1]
      })
    );
    model.add(tf.layers.dense({ units: 1, activation: "linear" }));
    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });
    console.dir(model)

    const tf_xs = tf.tensor1d(xs);
    const tf_ys = tf.tensor1d(ys);
  
    await model.fit(tf_xs, tf_ys, {
      epochs: epochs,
      callbacks: {
        onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
      }
    });
    return model,loss_arr;
}

function predictModel(model, xv) {
    const tf_xv = tf.tensor1d(xv);
    const yv = model.predict(tf_xv).dataSync();
    return yv;
}
createData('https://storage.googleapis.com/tf-datasets/titanic/train.csv')
module.exports = {
  createData,
  trainModel,
  predictModel
}