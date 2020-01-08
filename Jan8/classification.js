// const tf = require('@tensorflow/tfjs-node');

// async function readData() {
//     data = []
//     const csvDataset = tf.data.csv(
//         'file://./BLEdata.csv', {
//         columnConfigs: {
//             medv: {
//                 isLabel: true
//             }
//         }
//     });
//     // const dataset = tf.data.csv('file://./BLEdata.csv', { hasHeader: true });
//     // const v = await dataset.take(2).toArray();
//     // v.forEach((line) => {
//     //     data.push(line);
//     // });
//     const numOfFeatures = (await csvDataset.columnNames()).length - 1;
//     const flattenedDataset =
//         csvDataset
//             .map(({ xs, ys }) => {
//                 // Convert xs(features) and ys(labels) from object form (keyed by column
//                 // name) to array form.
//                 return { xs: Object.values(xs), ys: Object.values(ys) };
//             })
//             .batch(10);

//     return flattenedDataset , numOfFeatures;
// }
// function createModel(numOfFeatures) {
//     const model = tf.sequential();
//     model.add(tf.layers.dense({
//         units: 100,
//         inputShape: [numOfFeatures],
//         activation: "softmax"
//     }));
//     model.compile({
//         loss: 'categoricalCrossentropy',
//         optimizer: tf.train.sgd(0.000001)
//     })
//     return model
// }


// async function trainModel(model, flattenedDataset, epochs) {
//     const loss_arr = [];
//     await model.fitDataset(flattenedDataset, {
//         epochs: epochs,
//         validationSplit: 0.1,
//         callbacks: {
//             onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
//         }
//     });

//     return loss_arr;
// }

// function predictModel(model, flattenedDataset) {
//     const tf_xv = tf.tensor1d(flattenedDataset);
//     const yv = model.predict(tf_xv).dataSync();
//     return yv;
// }



// async function run() {
//     const read = readData() 
//     // const data = createData(read.numOfFeatures);
//     const model = createModel(read.numOfFeatures);
//     const loss_arr = await trainModel(model, read.flattenedDataset, data.ys);
//     const yv = [...predictModel(model, read.flattenedDataset)];
//     console.log(yv)
//   }

const tf = require("@tensorflow/tfjs-node");

async function createData(filename) {
    const dataset = tf.data.csv('file://' + filename, {hasHeader: true});
    // console.log(dataset);
    let v = await dataset.toArray();
    var xs = [];
    var ys = [];
    for (let i = 0; i < v.length; i++) {

        xs.push(v[i].rssi);
        ys.push(v[i].team);

    }
    return xs , ys
}

function createModel(num_nodes) {
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
  return model;
}

async function trainModel(model, xs, ys, epochs) {
  const loss_arr = [];

  const tf_xs = tf.tensor1d(xs);
  const tf_ys = tf.tensor1d(ys);

  await model.fit(tf_xs, tf_ys, {
    epochs: epochs,
    callbacks: {
      onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
    }
  });
  return loss_arr;
}

function predictModel(model, xv) {
  const tf_xv = tf.tensor1d(xv);
  const yv = model.predict(tf_xv).dataSync();
  return yv;
}

async function run() {
  const data = await createData('BLEdata.csv');
  const model = createModel(200);
  const loss_arr = await trainModel(model, data.xs, data.ys, 5000);
  const yv = [...predictModel(model, data.xs)];
  console.log(yv)
}

module.exports = {
  createData,
  createModel,
  trainModel,
  predictModel
}

run()
  .then(() => {
    console.log("RUN SUCCESSFUL");
  })
  .catch(err => console.log(err));