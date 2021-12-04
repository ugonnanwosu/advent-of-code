import fs from 'fs';

fs.readFile('./inputs/day-08.txt',  (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  const lines = input.split('\n');
  const swappedIndexPool = [];

  let index = 0;
  let indexPool = [0];
  let accumulator = 0;
  let hasSwapped = false;

  const reset = () => {
    index = 0;
    hasSwapped = false;
    indexPool = [0];
    accumulator = 0;
  }

  const targetIndex = lines.length - 1;

  const lookup = {
    acc: (val) => {
      accumulator += val;
      index++;
    },
    jmp: (val) => {
      index += val;
    },
    nop: () => {
      index++;
    }
  }

  const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);

  const increment = (options={part: 1}) => {
    const { part } = options;
    if (index >= targetIndex) {
      console.log(`Solution 2: Value of accumulator is ${accumulator}`);
      return;
    }

    const txt = lines[index];
    const arr = txt.split(' ');
    let action = arr[0];

    const swapActionsArr = ['jmp', 'nop'];
    const swapActionIndex = swapActionsArr.indexOf(action);
    const nextActionIndex = (swapActionIndex + 1) % swapActionsArr.length;
    const swappedAction = swapActionsArr[nextActionIndex];
    const isSwapInPool = swappedIndexPool.indexOf(index) > -1;
    const shouldSwap = swapActionIndex > -1 && !isSwapInPool && !hasSwapped && part === 2;

    if (shouldSwap) {
      swappedIndexPool.push(index);
      action = swappedAction;
      hasSwapped = true;
    }

    const val = parseInt(arr[1], 10);
    lookup[action].apply(this, [val]);
    indexPool.push(index);
    const dupes = findDuplicates(indexPool);
    if (dupes.length === 0) {
      increment({part});
    } else {
      if (part === 1) {
        console.log(`Solution 1: Value of accumulator is ${accumulator}`);
      } else if (part === 2) {
        reset();
        setTimeout(() => {
          increment({part});
        }, 1);
      }
    }
  }

  increment({part: 1});
  reset();
  increment({part: 2});
});