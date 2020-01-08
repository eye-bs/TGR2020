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
function createModel() {

    const model = tf.sequential();
    let hidden = tf.layers.dense({
        units: 16,
        activation: 'sigmoid',
        inputDim: [2]
    });
    let output = tf.layers.dense({
        units: 9,
        activation: 'softmax',
    });
    model.add(hidden);
    model.add(output);

    const lr = 0.2;
    const optimaizer = tf.train.sgd(lr);

    model.compile({
        optimaizer: optimaizer,
        loss: 'categoricalCrossentropy'
    });
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
