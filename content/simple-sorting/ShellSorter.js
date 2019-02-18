function ShellSorter () {
  Sorter.call( this )
}

ShellSorter.prototype = Object.create(Sorter.prototype)
ShellSorter.prototype.constructor = ShellSorter
ShellSorter.prototype.sort = function (a) {
  this.snapshoot(a)
  var h = 1
  var N = a.length

  while (h < ~~(N/3)) {
    h = h * 3 + 1
  }

  while (h>=1) {
    for (let i = h; i < N; i++) {
      for (let j = i; j >= h && this.less(a, j, j - h); j-=h) {
        this.exch(a, j, j - h)
      }
    }
    h = ~~(h/3)
  }

  return a
}