const regressionModel = require("./regression.js");
const tf = require("@tensorflow/tfjs");

test("createData with 100 num_pts must got xs and ys with length 100", () => {
  expect(regressionModel.createData(100).xs.length).toBe(101);
  expect(regressionModel.createData(100).ys.length).toBe(101);
});

test("createModel with units 5 must get layer unit 5", () => {
  expect(regressionModel.createModel(5).layers[0].units).toBe(5);
});

test("trainModel with 10 epochs be retuen array size 10", () => {
  const genData = regressionModel.createData(100);
  regressionModel
    .trainModel(regressionModel.createModel(5), genData.xs, genData.ys, 10)
    .then(loss_arr => {
      expect(loss_arr.length).toBe(10);
      done();
    }); 
});

test("predictModel with num_pts greater than 30 be mse lass than 0.1", () => {
  const getData = regressionModel.createData(20);
  const model = regressionModel.createModel(5);
  regressionModel.trainModel(model, getData.xs, getData.ys).then(loss_arr => {
    const yv = [...regressionModel.predictModel(model, getData.xs)];
    const size = yv.length
    var count = 0
    var sum = 0
    while (count < size){
      sum += (getData.ys[count] - yv[count]) * (getData.ys[count] - yv[count])
      count++;
    }
    sum /= yv
    expect(sum).toBeLessThan(0.2);
    done();

  });
});

test("predictModel with num_pts less than 5 mse be greater than 0.2" , () =>{
  const getData = regressionModel.createData(4);
  const model = regressionModel.createModel(5);
  regressionModel.trainModel(model, getData.xs, getData.ys).then(loss_arr => {
    const yv = [...regressionModel.predictModel(model, getData.xs)];
    const size = yv.length
    var count = 0
    var sum = 0
    while (count < size){
      sum += (getData.ys[count] - yv[count]) * (getData.ys[count] - yv[count])
      count++;
    }
    sum /= yv
    expect(sum).toBeGreaterThan(0.2);
    done();

  });
})