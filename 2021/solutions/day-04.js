import fs from 'fs'

fs.readFile('../inputs/day-04.txt',  (err, contents) => {
  if (err) { throw err; }
  const input = contents.toString();
  const data = input.split('\n').map(line => line.trim());

  const chunk = (collection, amount) => {
    return collection.reduce((arr, item, i) => {
      const index = Math.floor(i/amount);

      if (!arr[index]) {
        arr[index] = [];
      }
      arr[index].push(item);
      return arr
    }, []);
  }

  const intersection = (arr1, arr2) => arr1.filter(value => arr2.includes(value));
  const difference = (arr1, arr2) => arr1.filter(value => !arr2.includes(value));

  const makeCardGrids = (collection) => {
    return collection.map((arr) => {
      return Array.from(Array(5)).map((v, i, item) => {
        return arr[i].replace(/  +/g, ' ').split(' ');
      });
    });
  }

  const getCardColumns = (card) => {
    return Array.from(Array(5)).map((v, i, item) => {
      return card.reduce((ret, row) => {
        ret.push(row[i]);
        return ret;
      }, []);
    });
  }

  const bingoNumbers = data[0].trim().split(',');
  const cardGrids = makeCardGrids(chunk(data.slice(2), 6));

  const evalCard = ({card, bingoNumbers, index}) => {
    const calledNumbers = bingoNumbers.slice(0, index + 1);
    const diff = difference(card.flat(), calledNumbers);
    const columns = getCardColumns(card);
    const hasFullRow = card.some((row) => intersection(row, calledNumbers).length === 5);
    const hasFullColumn = columns.some((col) => intersection(col, calledNumbers).length === 5);
    const isWinner = hasFullRow || hasFullColumn;

    return {
      diff,
      isWinner,
    };
  }

  const getAnswer1 = () => {
    let diffSum;
    let lastCalledNumber;
    bingoNumbers.some((number, index) => {
      lastCalledNumber = parseInt(number, 10);
      return cardGrids.some((card, i) => {
        const {
          diff,
          isWinner,
        } = evalCard({card, bingoNumbers, index});

        if (isWinner) {
          diffSum = diff.reduce((sum, num) => sum + parseInt(num,10), 0);
        }

        return isWinner;
      });
    });

    return diffSum * lastCalledNumber;
  }

  const getAnswer2 = () => {
    let diffSum = 1;
    let lastCalledNumber;
    const remainingCardIndexes = cardGrids.map((card, i) => i);

    const winners = [];
    bingoNumbers.some((number, index) => {
      let isLastWinner = false;
      lastCalledNumber = parseInt(number, 10);

      cardGrids.forEach((card, cardIndex) => {
        const isRemaining = remainingCardIndexes.includes(cardIndex);
        if (!isRemaining) {
          return;
        }

        const {
          diff,
          isWinner,
        } = evalCard({card, bingoNumbers, index});

        if (isWinner) {
          winners.push('win')
          const removeIndex = remainingCardIndexes.indexOf(cardIndex);
          if (removeIndex > -1) {
            remainingCardIndexes.splice(removeIndex, 1);
          }
        }

        isLastWinner = remainingCardIndexes.length === 0;

        if (isLastWinner) {
          diffSum = diff.reduce((sum, num) => sum + parseInt(num,10), 0);
        }

        return isWinner;
      });

      return isLastWinner;
    });

    return diffSum * lastCalledNumber;
  }

  console.log({
    'Answer 1': getAnswer1(),
    'Answer 2': getAnswer2(),
  });

});