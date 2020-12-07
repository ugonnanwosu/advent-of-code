import _ from 'lodash';
import fs from 'fs';

const SEARCH_BAG_TYPE = 'shiny gold';

fs.readFile('./inputs/day-07.txt',  (err, data) => {
  if (err) {
    throw err;
  }

  const input = data.toString();

  const lines = input.split('\n');

  const bagProperties = _.map(lines, (line) => {
    const type = _.trim(line.split('bags contain')[0]);
    const contentsStr = _.trim(line.split('bags contain')[1]).split(',');
    const contents = _.map(contentsStr, (txt) => {
      const total = _.defaultTo(_.parseInt(txt.replace(/(^\d+)(.+$)/i,'$1')), 0);
      const childBagType = _.trim(txt.replace(/[0-9]/g, '').split('bag')[0]);
      return {
        total,
        type: childBagType,
      };
    });

    return {
      type,
      contents,
    };
  });


  const getBagHolders = (bagType) => {
    return _.filter(bagProperties, ({contents}) => _.some(contents, {type: bagType}));
  };

  const getAncestors = (bags) => {
    const ancestors = _.reduce(bags, (results, bag) => {
      const arr = [];
      const parentBags = getBagHolders(bag.type);
      arr.push(...parentBags);

      if (!_.isEmpty(parentBags)) {
        arr.push(...getAncestors(parentBags));
      }

      return _.concat(results, arr);
    }, []);

    return ancestors;
  };

  const getInternalBagsNumber = (bagType) => {
    const foundBag = _.find(bagProperties, {type: bagType}) ||{};
    const {
      contents
    } = foundBag;

    const num = _.reduce(contents, (sum, {total, type}) => {

      let addition = total;

      if (type) {
        addition += getInternalBagsNumber(type) * total;
      }

      return sum + addition;
    }, 0);

    return num;
  };

  const shinyGoldBagHolders = getBagHolders(SEARCH_BAG_TYPE);
  const ancestorBags = getAncestors(shinyGoldBagHolders);
  const totalBags = _.concat(shinyGoldBagHolders, ancestorBags);
  const solutionBags = _.uniqBy(totalBags, 'type');
  const totalNestedBags = getInternalBagsNumber(SEARCH_BAG_TYPE);

  console.log(`${solutionBags.length} bag colours can eventually contain at least one shiny gold bag.`);
  console.log(`${totalNestedBags} individual bags are required inside your single shiny gold bag.`);
});

