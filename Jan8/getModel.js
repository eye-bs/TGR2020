const tf = require('@tensorflow/tfjs-node');

try{
    const model = tf.loadLayersModel('file://./model-v1/model.json')
console.log("get",model)
}catch(err){
    console.err(err)
}
