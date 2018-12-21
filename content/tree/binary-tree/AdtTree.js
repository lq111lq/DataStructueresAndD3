function AdtTree () {
  this.root = null
};

AdtTree.prototype.insert = function (value) {
  if (Array.isArray(value)) {
    for (var i in value) {
      this.insert(value[i])
    }
    return
  }

  if (this.root) {
    this.root.insert(value)
  } else {
    this.root = new AdtTreeNode(value)
  }
}

function AdtTreeNode (value) {
  this.value = value
  this.left = null
  this.right = null
}

AdtTreeNode.prototype.insert = function (value) {
  var compareResult = value - this.value
  if (compareResult < 0) {
    if (this.left) {
      this.left.insert(value)
    } else {
      this.left = new AdtTreeNode(value)
    }
  } else if (compareResult > 0) {
    if (this.right) {
      this.right.insert(value)
    } else {
      this.right = new AdtTreeNode(value)
    }
  }
}