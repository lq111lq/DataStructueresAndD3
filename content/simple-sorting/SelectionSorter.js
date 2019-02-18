function SelectionSorter () {
  Sorter.call( this )
}

SelectionSorter.prototype = Object.create(Sorter.prototype)
SelectionSorter.prototype.constructor = SelectionSorter
SelectionSorter.prototype.sort = function (a) {
  this.snapshoot(a)
  for (let i = 0; i < a.length; i++) {
    var min = i
    for (let j = i + 1; j < a.length; j++) {
      if (this.less(a, j, min)) {
        min = j
      }
    }
    i !== min && this.exch(a, i, min)
  }
  return a
}