const tf = require('@tensorflow/tfjs');

function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.dense({
        units:100, 
        inputShape: [1],
        activation: 'sigmoid' }));
    model.compile({
        loss: 'meanSquaredError',
        optimizer: "sgd"
    })
    return model
}

function trainModel(countData) {
        const h = await model.fit(tf.ones([8, 10]), tf.ones([8, 1]), {
            batchSize: 4,
            epochs: countData
        });
        console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
}