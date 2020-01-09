const tf = require('@tensorflow/tfjs-node');

let t12, t15, t30, t33
async function readData() {
    data = []
    const rssi = [];
    const labelR = [];
    const numLine = 0
    class_names = ['12', '15', '30', '33']
    // const csvDataset = tf.data.csv(
    //     'file://./BLEdata.csv', {
    //     columnConfigs: {
    //         medv: {
    //             isLabel: true
    //         }
    //     }
    // });
    const dataset = tf.data.csv('file://./label.csv', { hasHeader: true });
    const v = await dataset.toArray();
    v.forEach((line) => {
        let data_rssi = [ line.gate12, line.gate15 ,line.gate30, line.gate33];
        let data_near = line.near
        near_arr = data_near.split(",")
        for (let i = 0; i <near_arr.length; i++){
            near_arr[i] = parseInt(near_arr[i])
        }
        rssi.push(data_rssi);
        labelR.push(near_arr)
    });      
    // const v = await dataset.take(2).toArray();
    // v.forEach((line) => {
    //     numLine++
    //     rssi.push(line);
    //     labelR.push() //จะเอาlabel ผลสุดท้าย
    // });
    console.log(labelR)
    const xs = tf.tensor2d(rssi);//ไม่แน่ใจ
    const ys = tf.oneHot(tf.tensor2d(labelR,'int32'))//ไม่แน่ใจ
    return { xs, ys ,rssi};
}

function createModel() {

    const model = tf.sequential();
    let hidden = tf.layers.dense({
        units: 16,
        activation: 'sigmoid',
        inputShape: 4
    });
    let output = tf.layers.dense({
        units: 4,
        activation: 'softmax',
    });
    model.add(hidden);
    model.add(output);

    const lr = 0.2;
    const optimaizer = tf.train.sgd({lr:0.2});

    model.compile({
        optimizer: optimaizer,
        loss: 'categoricalCrossentropy'
    });
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
    // const options = {
    //     epochs: 30,
    //     validationData: 0.1,
    //     shuffle: true,
    //     callbacks: {
    //         onTrainBegin: () => console.log('train start'),
    //         onTrainEnd: () => console.log('train complete'),
    //         onBatchEnd: tf.nextFrame,
    //         onEpochEnd: (num, logs) => {
    //             console.log('Epoch: ' + num);

    //         }
    //     }
    // }
    // await model.fit(xs, ys, options).then(results => {
    //     console.log(results.history.loss);
    // })
    const loss_arr = [];
    await model.fit(xs, ys, {
        epochs: 30,
        shuffle: true,
        callbacks: {
            onTrainBegin: () => console.log('train start'),
            onTrainEnd: () => console.log('train complete'),
            onBatchEnd: tf.nextFrame,
            onEpochEnd: (epoch, log) => loss_arr.push(log.loss)
        }
    });
    return loss_arr;
}

function predictModel(model,xs) {
    const tf_xv = tf.tensor2d(xs); //ไม่แน่ใจ 
    const yv = model.predict(tf_xv);
    let index = yv.argMax(1).dataSync()[0];
    console.log(index)
    let label = class_names[index]
    console.log(label);
    return yv, label;
}

async function run() {
  const data = await readData();
  const model = createModel();
  const loss_arr = await trainModel(model, data.xs, data.ys);
  const yv = [...predictModel(model, data.rssi)];
  console.log(yv)
}

module.exports = {
    readData,
  createModel,
  trainModel,
  predictModel
}

run()
  .then(() => {
    console.log("RUN SUCCESSFUL");
  })
  .catch(err => console.log(err));