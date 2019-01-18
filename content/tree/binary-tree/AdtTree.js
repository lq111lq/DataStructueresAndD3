function AdtTree () {
  // 根节点
  this.root = null
  // 查找路径
  this.findPath = []
};

AdtTree.prototype.insert = function (value) {
  this.findPath = []
  if (Array.isArray(value)) {
    for (var i in value) {
      this.insert(value[i])
    }
    return
  }

  if (this.root) {
    this.root.insert(value, this.findPath)
  } else {
    this.root = new AdtTreeNode(value)
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

AdtTreeNode.prototype.insert = function (value, findPath) {
  findPath.push(this)
  var compareResult = this.compareTo(value)
  if (compareResult > 0) {
    if (this.left) {
      this.left.insert(value, findPath)
    } else {
      this.left = new AdtTreeNode(value)
      findPath.push(this.left)
    }
  } else if (compareResult < 0) {
    if (this.right) {
      this.right.insert(value, findPath)
    } else {
      this.right = new AdtTreeNode(value)
      findPath.push(this.right)
    }
  }
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