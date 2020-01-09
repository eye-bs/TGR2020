const tf = require('@tensorflow/tfjs');

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
    const dataset = tf.data.csv('file://./BLEdata.csv', { hasHeader: true });

    // const v = await dataset.take(2).toArray();
    // v.forEach((line) => {
    //     numLine++
    //     rssi.push(line);
    //     labelR.push() //จะเอาlabel ผลสุดท้าย
    // });
    for (let record of dataset) {
        let data_rssi = [record.device , record.board12, record.board15 ,record.board30, record.board33];
        rssi.push(data_rssi);
        labelR.push(record.near)
    }

    const xs = tf.tensor2d(rssi);//ไม่แน่ใจ
    const ys = tf.tensor1d(labelR, 'int32 ')//ไม่แน่ใจ
    return { xs, ys };
}

function createModel() {

    const model = tf.sequential();
    let hidden = tf.layers.dense({
        units: 16,
        activation: 'sigmoid',
        inputShape: 6
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
        validationData: 0.1,
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