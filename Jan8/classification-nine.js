const tf = require('@tensorflow/tfjs-node');

async function readData() {

    // const outputData = tf.tensor2d(iris.map(item => [
    //     item.near === "12" ? 1 : 0,
    //     item.near === "15" ? 1 : 0,
    //     item.near === "30" ? 1 : 0,
    //     item.near === "33" ? 1 : 0,
    // ]))
    // return { xs, ys };
    data = []
    const rssi = [];
    const labelR = [];

    const dataset = tf.data.csv('file://./label.csv', { hasHeader: true });
    const v = await dataset.toArray();
    v.forEach((line) => {
        let data_rssi = [line.gate12, line.gate15, line.gate30, line.gate33];
        let data_near = line.near
        near_arr = data_near.split(",")
        for (let i = 0; i < near_arr.length; i++) {
            near_arr[i] = parseInt(near_arr[i])
        }
        rssi.push(data_rssi);
        labelR.push(near_arr)
    });
    const xs = tf.tensor2d(rssi);//ไม่แน่ใจ
    // const ys = tf.oneHot(tf.tensor2d(labelR,'int32'))//ไม่แน่ใจ
    const ys = tf.tensor2d(labelR);
    return { xs, ys, rssi };
}

function createModel() {

    const model = tf.sequential()

    model.add(tf.layers.dense({
        inputShape: [4],
        activation: "sigmoid",
        units: 16,
    }))
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: 4,
    }))
    model.summary();
    model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam(),
        lr: 0.1
    })
    return model
}

// async function createModel(xTrain, yTrain, xTest, yTest) {
//     ui.status('Training model... Please wait.');

//     const params = ui.loadTrainParametersFromUI();

//     // Define the topology of the model: two dense layers.
//     const model = tf.sequential();
//     model.add(tf.layers.dense(
//         {units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
//     model.add(tf.layers.dense({units: 3, activation: 'softmax'}));
//     model.summary();

//     const optimizer = tf.train.adam(params.learningRate);
//     model.compile({
//       optimizer: optimizer,
//       loss: 'categoricalCrossentropy',
//       metrics: ['accuracy'],
//     });
// }

async function trainModel(model, xs, ys) {

 
        let res = await model.fit(xs, ys, {epochs: 500});
      
        
    //         }
    //     }
    // }
    // await model.fit(xs, ys, options).then(results => {
    //     console.log(results.history.loss);
    // })
    // const loss_arr = [];
    // await model.fit(xs, ys, {
    //     epochs: 30,
    //     shuffle: true,
    //     callbacks: {
    //         onTrainBegin: () => console.log('train start'),
    //         onTrainEnd: () => console.log('train complete'),
    //         onBatchEnd: tf.nextFrame,
    //         onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
    //     }
    // });
    // return loss_arr;
}

function predictModel(model, xs) {
    const testing = tf.tensor2d([[-100,-89,-64,-100]]);
    return model.predict(testing)
}

async function run() {
    const data = await readData();
    const model = createModel();
    const loss_arr = await trainModel(model, data.xs, data.ys);
    model.save('file://model-v1')
    var yv   = predictModel(model, data.rssi)

    console.log(yv.arraySync())
}

module.exports = {
    readData,
    createModel,
    trainModel,
    // predictModel
}

run()
    .then(() => {
        console.log("RUN SUCCESSFUL");
    })
    .catch(err => console.log(err));