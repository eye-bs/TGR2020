consttf = require('@tensorflow/tfjs-node');
datasetObj = await createDataset();
model = createModel();
dataset = datasetObj.dataset.shuffle();
trainDataset = dataset.take();
validationDataset = dataset.skip();
await model.fitDataset();
result = model.predict();
await model.save();