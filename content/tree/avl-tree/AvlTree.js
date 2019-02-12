function AvlTree () {
  AdtTree.call( this )
}

AvlTree.prototype = Object.create(AdtTree.prototype)
AvlTree.prototype.constructor = AvlTree
AvlTree.prototype.NodeConstructor = AvlTreeNolde

function AvlTreeNode (value) {
  this.value = value
  this.left = null
  this.right = null
  this.height = 0
  this.balanceFactor = 0
}

AvlTreeNode.prototype = Object.create(AdtTreeNode.prototype)
AvlTreeNode.prototype.constructor = AvlTreeNode

AvlTreeNode.prototype.insert = function (value) {
  AdtTreeNode.prototype.insert.call(this, value)

  return this.balance()
}

AvlTreeNode.prototype.remove = function (value) {
  var node = AdtTreeNode.prototype.remove.call(this, value)
  return node && node.balance()
}

AvlTreeNode.prototype.balance = function () {
  let newTop = this
  function height(d) {
    return d  ? d.height : -1
  }

  if ( height( this.left ) - height( this.right ) > 1 ) {
    if ( height( this.left.left ) >= height( this.left.right ) ) {
      newTop = this.rotateWithLeftChild()
    } else {
      newTop = this.doubleWithLeftChild()
    }
  }

  if ( height( this.right ) - height( this.left ) > 1 ) {
    if ( height( this.right.right ) >= height( this.right.left ) ) {
      newTop = this.rotateWithRightChild()
    } else {
      newTop = this.doubleWithRightChild()
    }
  }

  this.height = Math.max( height( this.left ), height( this.right ) ) + 1
  this.balanceFactor = Math.abs(height( this.left ) - height( this.right ))

  return newTop
}

AvlTreeNode.prototype.rotateWithLeftChild = function () {
  if (!this.left) {
    return this
  }

  var left = this.left
  this.left = left.right
  left.right = this
  function height(d) {
    return d  ? d.height : -1
  }

  this.height = Math.max( height( this.left ), height( this.right ) ) + 1
  this.balanceFactor = Math.abs(height( this.left ) - height( this.right ))

  left.height = Math.max( height( left.left ), height( left.right ) ) + 1
  left.balanceFactor = Math.abs(height( left.left ) - height( left.right ))

  return left
}

AvlTreeNode.prototype.rotateWithRightChild = function () {
  if (!this.right) {
    return this
  }

  var right = this.right
  this.right = right.left
  right.left = this

  function height(d) {
    return d  ? d.height : -1
  }

  this.height = Math.max( height( this.left ), height( this.right ) ) + 1
  this.balanceFactor = Math.abs(height( this.left ) - height( this.right ))

  right.height = Math.max( height( right.left ), height( right.right ) ) + 1
  right.balanceFactor = Math.abs(height( right.left ) - height( right.right ))

  return right
}

AvlTreeNode.prototype.doubleWithLeftChild = function ()
{
    this.left = this.left.rotateWithRightChild()
    return this.rotateWithLeftChild()
}

AvlTreeNode.prototype.doubleWithRightChild = function ()
{
    this.right = this.right.rotateWithLeftChild()
    return this.rotateWithRightChild()
}