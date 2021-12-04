import fs from 'fs'

fs.readFile('../inputs/day-03.txt',  (err, contents) => {
  if (err) { throw err; }
  const input = contents.toString();
  const data = input.split('\n').map(line => line.trim());

  const bitLength = data[0].length;

  const groupBy = (collection, prop) => {
    return collection.reduce((ret, obj) => {
      const name = typeof prop !== 'undefined' ? obj[prop] : obj;
      (ret[name] = ret[name] || []).push(obj);
      return ret;
    }, {});
  };

  const table = Array.from(Array(bitLength)).reduce((ret, v, i) => {
    ret[i] = data.map(line => line.charAt(i));
    return ret;
  }, []);

  const getBinaryRating = (option={}) => {
    const { key } = option;
    const isOxygen = key === 'oxygen';
    const isCo2 = key === 'co2';
    let filterData = data.slice();
    let binary = '';
    let count = 0;
    while (filterData.length > 1 && count < bitLength) {
      const filterTable = Array.from(Array(bitLength)).reduce((ret, v, i) => {
        ret[i] = filterData.map(line => line.charAt(i));
        return ret;
      }, []);

      const filterTableInfo = filterTable.map((col) => {
        const group = Object.values(groupBy(col));
        const maxArr = group.sort((a, b) => b.length - a.length)[0];
        const minArr = group.sort((a, b) => a.length - b.length)[0];
        const maxBit = maxArr[0];
        const minBit = minArr[0];
        const isEqual = maxArr.length === minArr.length;
        return { maxBit, minBit, isEqual }
      });
      const { maxBit, minBit, isEqual } = filterTableInfo[count];

      const ruleMap = [
        {
          condition: (isEqual && isOxygen),
          bit: '1',
        },
        {
          condition: (isEqual && isCo2),
          bit: '0',
        },
        {
          condition: isOxygen,
          bit: maxBit,
        },
        {
          condition: isCo2,
          bit: minBit,
        },
        {
          condition: true,
          bit: '',
        }
      ];

      const bit = ruleMap.find(({condition}) => condition).bit;
      filterData = filterData.filter((str) => {
        return str.charAt(count) === bit;
      });
      binary = filterData.length === 1 ? filterData : binary + bit;
      count++;
    }
    return binary;
  }

  const oxygenBinary = getBinaryRating({key: 'oxygen'} );
  const co2Binary = getBinaryRating({key: 'co2'} );
  const oxygenDecimal = parseInt(oxygenBinary, 2);
  const co2Decimal = parseInt(co2Binary, 2);

  const binaries = table.reduce((ret, arr, i) => {
    let { gamma, epsilon } = ret;
    const group = Object.values(groupBy(arr));
    const max = group.sort((a, b) => b.length - a.length)[0][0];
    const min = group.sort((a, b) => a.length - b.length)[0][0];
    gamma += max;
    epsilon += min;
    return { gamma, epsilon }
  }, { gamma: '', epsilon: '' });

  const gammaDecimal = parseInt(binaries.gamma, 2);
  const epsilonDecimal = parseInt(binaries.epsilon, 2);

  const powerConsumption = gammaDecimal * epsilonDecimal;
  const lifeSupportRating = oxygenDecimal * co2Decimal;

  console.log({
    'Answer 1': powerConsumption,
    'Answer 2': lifeSupportRating,
  });

});