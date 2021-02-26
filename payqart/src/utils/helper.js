const moneyFormater = (value) => {
  const numString = '' + value
  return numString.split('')
}

const formating = (val) => {
  let pos
  if (val.length % 3 === 0) {
    pos = 2
  }

  if (val.length % 3 === 1) {
    pos = 0
  }

  if (val.length % 3 === 2) {
    pos = 1
  }

  let newArr = []

  val.forEach((e, i, a) => {
    if (a.length - 1 === i) {
      newArr.push(e)
      return
    }
    if (pos === i) {
      newArr.push(e)
      newArr.push(',')
      pos += 3
    } else {
      newArr.push(e)
    }
  })

  return newArr
}

const monString = (val) => {
  return val.join('')
}

export const formatMoney = (money) => {
  return monString(formating(moneyFormater(money)))
}

/**
 *
 * // function to return all total cart price
 * @param {arr} array of objects
 * @return {number}
 */
export const getTotal = (arr) => {
  const total = arr.reduce((acc, val) => acc + val.price * val.qty, 0)

  return total
}
