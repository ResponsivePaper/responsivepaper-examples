//{ "line1": "", "line2": "", "line3": "", "line4": "" },

var addresses = [
  {
    line1: 'Charles Knoll',
    line2: '888 Fourth of July Rd',
    line3: 'Eagle, CO 81631',
    line4: '',
  },
  {
    line1: 'Charles Knoll',
    line2: '888 Fourth of July Rd',
    line3: 'Eagle, CO 81631',
    line4: '',
  },
  {
    line1: 'Charles Knoll',
    line2: '888 Fourth of July Rd',
    line3: 'Eagle, CO 81631',
    line4: '',
  },
  {
    line1: 'Charles Knoll',
    line2: '888 Fourth of July Rd',
    line3: 'Eagle, CO 81631',
    line4: '',
  },
]
// const blankAddress = {
//   line1: 'Charles Knoll',
//   line2: '888 Fourth of July Rd',
//   line3: 'Eagle, CO 81631',
//   line4: '',
// }
const blankAddress = {
  line1: '',
  line2: '',
  line3: '',
  line4: '',
}
window.onload = function () {
  const labelCount = 60
  const startIndex = 0
  const skipIndexes = [3, 56]
  const printAddresses = []
  let addressIndex = 0
  for (let i = 0; i < labelCount; i++) {
    if (
      i < startIndex ||
      skipIndexes.indexOf(i) != -1 ||
      addressIndex >= addresses.length
    ) {
      printAddresses.push(blankAddress)
      continue
    }
    printAddresses.push(addresses[addressIndex])
    addressIndex++
  }
  ko.applyBindings({ labels: printAddresses })
  window.RESPONSIVE_PAPER_READY_TO_RENDER = true
}
