const tf = require('@tensorflow/tfjs');

async function readData() {
    data = []
    const csvDataset = tf.data.csv(
        'file://./BLEdata.csv', {
        columnConfigs: {
            medv: {
                isLabel: true
            }
        }
    });
    // const dataset = tf.data.csv('file://./BLEdata.csv', { hasHeader: true });
    // const v = await dataset.take(2).toArray();
    // v.forEach((line) => {
    //     data.push(line);
    // });
    const numOfFeatures = (await csvDataset.columnNames()).length - 1;
    const flattenedDataset =
        csvDataset
            .map(({ xs, ys }) => {
                // Convert xs(features) and ys(labels) from object form (keyed by column
                // name) to array form.
                return { xs: Object.values(xs), ys: Object.values(ys) };
            })
            .batch(10);

    return flattenedDataset , numOfFeatures;
}
function createModel(numOfFeatures) {

    const model = tf.sequential();
    model.add(tf.layers.dense({
        units: 100,
        inputShape: [numOfFeatures],
        activation: "softmax"
    }));
    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: tf.train.sgd(0.000001)
    })
    return model
}


async function trainModel(model, flattenedDataset, epochs) {
    const loss_arr = [];
    await model.fitDataset(flattenedDataset, {
        epochs: epochs,
        validationSplit: 0.1,
        callbacks: {
            onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
        }
    });

    return loss_arr;
}

function predictModel(model, flattenedDataset) {
    const tf_xv = tf.tensor1d(flattenedDataset);
    const yv = model.predict(tf_xv).dataSync();
    return yv;
}
