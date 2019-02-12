function Sorter() {
  this.snapshots = []
}

Sorter.prototype.snapshoot = function (a, i, j, type) {
  var snapshot = {}

  var array = a.map(function (d, index) {
    return {
      id: d.id,
      value: d.value,
      index: index
    }
  })

  snapshot.array = array
  snapshot.type = type

  this.snapshots.push(snapshot)
}

Sorter.prototype.clearSnapshots = function () {
  this.snapshots = []
}

Sorter.prototype.sort = function (a) {
  return a.sort(function (a, b) {
    return a.value - b.value
  })
}

Sorter.prototype.less = function (a, i, j) {
  return a[i].compareTo(a[j]) < 0
}

Sorter.prototype.exch = function (a, i, j) {
  var t = a[i]
  a[i] = a[j]
  a[j] = t
}

Sorter.prototype.isSorted = function (a) {
  for (let i = 1; i < a.length; i++) {
    if (this.less(a, i, i - 1)) {
      return false
    }
  }
  return true
}

Sorter.prototype.getInversion = function (a) {
  var inversions = []
  for (let i = 0; i < a.length; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (this.less(a, j, i)) {
        inversions.push({
          a: a[i],
          b: a[j]
        })
      }
    }
  }
  return inversions
}

var compareableValueId = 0

function CompareableValue (value) {
  this.id = compareableValueId++
  this.value = value
}

CompareableValue.prototype.compareTo = function (that) {
  if (this.value < that.value) return -1
  if (this.value > that.value) return 1
  return 0
}
