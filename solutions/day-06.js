import _ from 'lodash';
import fs from 'fs';

fs.readFile('./inputs/day-06.txt',  (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();
  const groups = input.split('\n\n');

  const totalSomeYes = _.reduce(groups, (result, group) => {
    const answers = _.uniq(group.split('\n').join(''));
    return result + answers.length;
  }, 0);

  const totalAllYes = _.reduce(groups, (sum, group) => {
    const groupAnswers = _.map(group.split('\n'), (strAnswers) => {
      return strAnswers.split('');
    }, []);

    return sum + _.intersection(...groupAnswers).length;
  }, 0);

  console.log(`For each group, count the number of questions to which anyone answered "yes". The sum is ${totalSomeYes}`);
  console.log(`For each group, count the number of questions to which everyone answered "yes". The sum is ${totalAllYes}`);
});