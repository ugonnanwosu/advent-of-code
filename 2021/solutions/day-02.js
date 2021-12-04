import fs from 'fs'

fs.readFile('../inputs/day-02.txt',  (err, contents) => {
  if (err) { throw err; }

  const input = contents.toString();
  const data = input.split('\n').map((line) => {
    const lineArr = line.split(' ');
    const command = lineArr[0];
    const amount = parseInt(lineArr[1], 10);
    return { command, amount };
  });

  const totals = data.reduce((res, obj) => {
    const {command, amount} = obj
    const value = res[command];

    let { aim, depth } = res;
    switch (command) {
      case 'down':
        aim += amount;
        break;
      case 'up':
        aim -= amount;
        break;
      case 'forward':
        depth += (amount * aim);
        break;
    }
    return Object.assign(res, {
      [command]: value + amount, depth, aim,
    });
  }, { forward: 0, down: 0, up: 0, aim: 0, depth: 0 });

  const answer1 = totals.forward * (totals.down - totals.up);
  const answer2 = totals.forward * totals.depth;

  console.log({
    'Answer 1': answer1,
    'Answer 2': answer2,
  });
});