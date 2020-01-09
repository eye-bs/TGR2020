const tf = require('@tensorflow/tfjs');

async function readData() {

    // const dataset = tf.data.csv('file://./BLEdata.csv', { hasHeader: true });
    // for (let record of dataset) {
    //     let data_rssi = [record.device, record.board12, record.board15, record.board30, record.board33];
    //     rssi.push(data_rssi);
    //     labelR.push(record.near)
    // }

    const trainingData = tf.tensor2d(iris.map(item => [
        item.board12, item.board15, item.board30, item.board33,
    ]))
    const outputData = tf.tensor2d(iris.map(item => [
        item.near === "12" ? 1 : 0,
        item.near === "15" ? 1 : 0,
        item.near === "30" ? 1 : 0,
        item.near === "33" ? 1 : 0,
    ]))
    const testingData = tf.tensor2d(irisTesting.map(item => [
        item.board12, item.board15, item.board30, item.board33,
    ]))
    return { xs, ys };
}

function createModel() {

    const model = tf.sequential()

    model.add(tf.layers.dense({
        inputShape: [4],
        activation: "sigmoid",
        units: 5,
    }))
    model.add(tf.layers.dense({
        inputShape: [5],
        activation: "sigmoid",
        units: 3,
    }))
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: 3,
    }))
    model.compile({
        loss: "meanSquaredError",
        optimizer: tf.train.adam(1),
    })
    return model
}

async function trainModel(model, xs, ys) {

    model.fit(trainingData, outputData, { epochs: 100 })
    .then((history) => {
        // console.log(history)
        model.predict(testingData).print()
        trainingData2 = ['board12' = -1,'board15' = -2,'board15' = -3,'board15' = -4 ]
        model.predict(trainingData2).print()
    })
    return loss_arr;
}

// function predictModel(model, xs) {
//     const tf_xv = tf.tensor2d(xs); //ไม่แน่ใจ 
//     const yv = model.predict(tf_xv);
//     let index = yv.argMax(1).dataSync()[0];
//     console.log(index)
//     let label = class_names[index]
//     console.log(label);
//     return yv, label;
// }

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
    // predictModel
}

run()
    .then(() => {
        console.log("RUN SUCCESSFUL");
    })
    .catch(err => console.log(err));