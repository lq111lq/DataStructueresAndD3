function MergeSorter () {
  this.aux = []
  Sorter.call( this )
}

MergeSorter.prototype = Object.create(Sorter.prototype)
MergeSorter.prototype.constructor = MergeSorter

MergeSorter.prototype.merge = function (a, lo, mid, hi) {
  var i = lo
  var j = mid + 1

  var aux = a.map(function (d) {
    return d
  })

  for (var k = lo; k<= hi; k++) {
    if      (i > mid)              a[k] = aux[j++]
    else if (j > hi )              a[k] = aux[i++]
    else if (this.less(aux, j, i)) a[k] = aux[j++]
    else                           a[k] = aux[i++]

    this.snapshoot(a, i, j, 'copy')
  }
}

MergeSorter.prototype.sort = function (a) {
  this.snapshoot(a)
  return this.sortInner(a, 0, a.length - 1)
}

MergeSorter.prototype.sortInner = function (a, lo, hi) {
  if (hi <= lo) return
  var mid = ~~(lo + (hi - lo)/2)
  this.sortInner(a, lo, mid)
  this.sortInner(a, mid + 1, hi)
  this.merge(a, lo, mid, hi)
}