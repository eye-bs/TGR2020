const tf = require('@tensorflow/tfjs-node');

async function readData() {
    data = []
    const rssi = [];
    const labelR = [];
    const arr_1 = [];
    const arr_2 = [];
    const arr_3 = [];
    const arr_4 = [];
    const target_1 = [];
    const target_2 = [];
    const target_3 = [];
    const target_4 = [];
    const trainXs = [];
    const trainYs = [];
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
        if(data_near == 1){
            arr_1.push(data_rssi);
            target_1.push(1)
        }else if(data_near == 2){
            arr_2.push(data_rssi);
            target_2.push(2)
        }else if(data_near == 3){
            arr_3.push(data_rssi);
            target_3.push(3)
        }else if(data_near == 4){
            arr_4.push(data_rssi);
            target_4.push(4)
        }
        // rssi.push(data_rssi);
        // labelR.push(near_arr)
    });      
    rssi.push(arr_1)
    rssi.push(arr_2)
    rssi.push(arr_3)
    rssi.push(arr_4)
    labelR.push(target_1)
    labelR.push(target_2)
    labelR.push(target_3)
    labelR.push(target_4)
    // const v = await dataset.take(2).toArray();
    // v.forEach((line) => {
    //     numLine++
    //     rssi.push(line);
    //     labelR.push() //จะเอาlabel ผลสุดท้าย
    // });
    //const xs = tf.tensor2d(rssi);//ไม่แน่ใจ
    for(let i = 0; i <rssi.length;i++){
        var trainX = tf.tensor2d(rssi[i], [rssi[i].length, 4]);
        var trainY = tf.oneHot(tf.tensor1d(labelR[i]).toInt(), 4);
        trainXs.push(trainX);
        trainYs.push(trainY);
    }
    const xs = trainXs
    const ys = trainYs//ไม่แน่ใจ

    const concatAxis = 0;
    return [
      tf.concat(xs, concatAxis), tf.concat(xs, concatAxis),
      tf.concat(xs, concatAxis), tf.concat(xs, concatAxis)
    ];

    // return { xs, ys ,rssi};
}

// function createModel() {

//     const model = tf.sequential();
//     let hidden = tf.layers.dense({
//         units: 16,
//         activation: 'sigmoid',
//         inputShape: 4
//     });
//     let output = tf.layers.dense({
//         units: 4,
//         activation: 'softmax',
//     });
//     model.add(hidden);
//     model.add(output);

//     const lr = 0.2;
//     const optimaizer = tf.train.sgd({lr:0.2});

//     model.compile({
//         optimizer: optimaizer,
//         loss: 'categoricalCrossentropy'
//     });
//     return model
// }

async function createModel(xTrain) {
    // Define the topology of the model: two dense layers.
    const model = tf.sequential();
    model.add(tf.layers.dense(
        {units: 5, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
    model.add(tf.layers.dense({units: 4, activation: 'softmax'}));
    model.summary();
  
    const optimizer = tf.train.adam(0.0000001);
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
    return model;
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
    const input = tf.tensor2d([-404,-50,-60,-404], [1, 4]);
    const yv = model.predict(input);
    let index = yv.argMax(1).dataSync()[0];
    let label = class_names[index]

    // const tf_xv = tf.tensor2d(xs); //ไม่แน่ใจ 
    // const yv = model.predict(tf_xv);
    // let index = yv.argMax(1).dataSync()[0];
    // let label = class_names[index]
    return yv,label;
}

async function run() {
  //const data = await readData();
  const [xTrain, yTrain, xTest, yTest] = await readData();
  const model = await createModel(xTrain);
  const loss_arr = await trainModel(model, xTrain, yTrain);
  const yv = predictModel(model, xTest);
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