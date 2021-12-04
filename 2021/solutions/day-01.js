import fs from 'fs'

fs.readFile('../inputs/day-01.txt',  (err, data) => {

  if (err) { throw err; }

  const input = data.toString();

  let prevDepth = null;
  const arr = input.split('\n').reduce((ret, str) => {
    const depth = parseInt(str, 10);
    const diff = depth - prevDepth;
    const increased = diff > 0 && prevDepth !== null;
    const decreased = diff < 0 && prevDepth !== null;
    ret.push({ depth, increased, decreased, diff });
    prevDepth = depth;
    return ret;
  }, []);

  const measureWindow = 3;

  let prevSumMeasurement = null;
  const groups = Array.from(Array(arr.length - (measureWindow - 1))).reduce((ret, depthObj, startIndex) => {
    const endIndex = startIndex + measureWindow;
    const sliced = arr.slice(startIndex, endIndex);
    const sumMeasurement = sliced.reduce((sum, {depth}) => sum + depth, 0);
    const diff = sumMeasurement - prevSumMeasurement;
    const increased = diff > 0 && prevSumMeasurement !== null;
    const decreased = diff < 0 && prevSumMeasurement !== null;
    ret.push({ ...sliced, ...{sumMeasurement, increased, decreased}});
    prevSumMeasurement = sumMeasurement;
    return ret;
  }, []);

  const answer1 = arr.filter(({increased}) => increased).length;
  const answer2 = groups.filter(({increased}) => increased).length;

  console.log({
    'How many measurements are larger than the previous measurement?': answer1,
    'How many sums are larger than the previous sum?': answer2,
  });

});