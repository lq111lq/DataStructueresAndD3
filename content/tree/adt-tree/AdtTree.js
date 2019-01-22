function AdtTree () {
  // 根节点
  this.root = null
  // 查找路径
  this.findPath = []
}

AdtTree.prototype.NodeConstructor = AdtTreeNode

AdtTree.prototype.insert = function (value) {
  this.findPath = []
  if (Array.isArray(value)) {
    for (var i in value) {
      this.insert(value[i])
    }
    return
  }

  if (this.root) {
    this.root = this.root.insert(value)
  } else {
    this.root = new this.NodeConstructor(value)
  }
}

AdtTree.prototype.remove = function (value) {
  this.findPath = []
  if (this.root) {
    this.root = this.root.remove(value, this.findPath)
  }
}

AdtTree.prototype.contains = function (value) {
  this.findPath = []
  if (this.root) {
    return this.root.contains(value, this.findPath)
  }

  return false
}


function AdtTreeNode (value) {
  this.value = value
  this.left = null
  this.right = null
}

AdtTreeNode.prototype.compareTo = function(value) {
  return this.value - value
}

AdtTreeNode.prototype.insert = function (value) {
  var compareResult = this.compareTo(value)
  if (compareResult > 0) {
    if (this.left) {
      this.left = this.left.insert(value)
    } else {
      this.left = new this.constructor(value)
    }
  } else if (compareResult < 0) {
    if (this.right) {
      this.right = this.right.insert(value)
    } else {
      this.right = new this.constructor(value)
    }
  }
  return this
}

AdtTreeNode.prototype.contains = function (value, findPath) {
  findPath && findPath.push(this)
  var compareResult = this.compareTo(value)
  if (compareResult=== 0) {
    return true
  }
  if (compareResult > 0 && this.left) {
    return this.left.contains(value, findPath)
  }

  if (compareResult < 0 && this.right) {
    return this.right.contains(value, findPath)
  }
  return false
}

AdtTreeNode.prototype.remove = function (value) {
  var compareResult = this.compareTo(value)

  if (compareResult > 0) {
    this.left = this.left && this.left.remove(value)
  } else if (compareResult < 0) {
    this.right = this.right && this.right.remove(value)
  } else if(this.left && this.right) {
    var replacer = this.right.findMin()
    replacer.right = this.right.remove(replacer.value)
    replacer.left = this.left
    return replacer
  } else {
    return this.left || this.right
  }

  return this
}

AdtTreeNode.prototype.findMin = function () {
  return this.left ? this.left.findMin() : this
}