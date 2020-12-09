import fs from 'fs';

fs.readFile('./inputs/day-09.txt',  (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  const lines = input.split('\n').map(num => parseInt(num, 10));

  const PREAMBLE_AMOUNT = 25;

  const contiguousSums = lines.reduce((arr, num, i) => {
    const copy = lines.slice(i + 1);
    const sums = copy.map((a, j) => {
      const nested = copy.slice(0, copy.length - j);
      const total = nested.reduce((sum, b) => sum + b, num);
      return { total, start: i, size: nested.length + 1 };
    });
    return arr.concat(sums);
  }, []);

  const solution1 = lines.find((val, i) => {
    const startIndex = i - PREAMBLE_AMOUNT;

    if (startIndex < 0) {
      return;
    }

    const subset = lines.slice(startIndex, startIndex + PREAMBLE_AMOUNT);

    const allSums = subset.reduce((arr, num, j) => {
      const copy = subset.slice();
      copy.splice(j, 1);
      const sums = copy.map(v => v + num);
      return [...arr, ...sums];
    }, []);

    return allSums.indexOf(val) === -1;
  });

  const solution2Range = contiguousSums.find(({total}) => total === solution1) || {};
  const { start, size } = solution2Range;
  const solution2Arr = lines.slice(start, start + size);
  const solution2Min = Math.min(...solution2Arr);
  const solution2Max = Math.max(...solution2Arr);
  const solution2 = solution2Min + solution2Max;

  console.log(`Solution 1: ${solution1}`);
  console.log(`Solution 2: Encryption weakness is ${solution2}`);
});