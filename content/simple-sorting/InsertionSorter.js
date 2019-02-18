function InsertionSorter () {
  Sorter.call( this )
}

InsertionSorter.prototype = Object.create(Sorter.prototype)
InsertionSorter.prototype.constructor = InsertionSorter
InsertionSorter.prototype.sort = function (a) {
  for (let i = 0; i < a.length; i++) {
    for (let j = i; j > 0 && this.less(a, j, j - 1); j--) {
      this.exch(a, j, j - 1)
    }
  }
  return a
}