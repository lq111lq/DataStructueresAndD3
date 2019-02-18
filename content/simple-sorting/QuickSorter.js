function QuickSorter() {
  Sorter.call(this)
}

QuickSorter.prototype = Object.create(Sorter.prototype)
QuickSorter.prototype.constructor = QuickSorter
QuickSorter.prototype.sort = function (a) {
  this.snapshoot(a)
  this.sortInner(a, 0, a.length - 1)
}

QuickSorter.prototype.sortInner = function (a, lo, hi) {
  if (hi <= lo) {
    return
  }
  var j = this.partition(a, lo, hi)

  this.sortInner(a, lo, j - 1)
  this.sortInner(a, j + 1, hi)
}

QuickSorter.prototype.partition = function (a, lo, hi) {
  var i = lo
  var j = hi + 1
  var v = a[lo]
  while (true) {

    while (this.less(a, ++i, lo)) {
      if (i == hi) break
    }

    while (this.less(a, lo, --j)) {
      if (j == lo) break
    }

    if (i >= j) break
    this.exch(a, i, j)
  }

  this.exch(a, lo, j)
  return j
}