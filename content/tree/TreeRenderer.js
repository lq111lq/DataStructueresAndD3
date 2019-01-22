function TreeRenderer (container, tree) {
  this.tree = tree
  this.selectedNode = null

  var padding = this.padding = {
    left: 25,
    right: 25,
    top: 25,
    bottom: 50
  }

  this.container = d3.select(container)
  this.svg = this.container.append('svg')
    .style('display', 'block')
    .style('height', '100%')
    .style('width', '100%')
    .style('user-select', 'none')

  this.width = this.svg.node().clientWidth
  this.height = this.svg.node().clientHeight

  this.svg
    .attr('width', this.width)
    .attr('height', this.height)

  this.g1 = this.svg
    .append('g')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')

  this.g2 = this.svg
    .append('g')
    .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')

  window.addEventListener('resize', this.render.bind(this))
  this.render()
}

TreeRenderer.prototype.setSelectedNode = function (node) {
  this.selectedNode = node
  this.render()

  if (typeof this.onSelectedNodeChanged === 'function') {
    this.onSelectedNodeChanged(node)
  }
}

TreeRenderer.prototype.render = function (duration) {
  var self = this
  this.width = this.svg.node().clientWidth
  this.height = this.svg.node().clientHeight

  this.svg
    .attr('width', this.width)
    .attr('height', this.height)

  var g1 = this.g1
  var g2 = this.g2

  var tree = d3.tree()
    .size([
      this.width - this.padding.left - this.padding.right,
      this.height - this.padding.top - this.padding.bottom
    ])
  
  var root = this.tree && this.tree.root

  if (!root) {
    g1.selectAll('*').remove()
    g2.selectAll('*').remove()
    return
  }

  root = d3.hierarchy(root, function (d) {
    if (d.left && d.right) {
      return [d.left, d.right]
    } else if (d.right) {
      return [{value: '_'}, d.right]
    } else if (d.left) {
      return [d.left, {value: '_'}]
    }
    return []
  })

  tree(root)

  var descendants = root.descendants().filter(function (d) {
    return d.data.value !== '_'
  })

  var links = root.links().filter(function (d) {
    return d.source.data.value !== '_' && d.target.data.value !== '_'
  })

  if (descendants.length > 100) {
    g2.style('display', 'none')
  } else {
    g2.style('display', '')
  }

  var lineUpdate = g1.selectAll('line')
    .data(links, function (d) {
      if (d.target.depth > d.source.depth) {
        return d.target.value
      } else {
        return d.source.value
      }
    })
  var lineEnter= lineUpdate.enter()
  lineUpdate.exit().remove()

  lineEnter.append('line')
    .attr('stroke', function(d) {
      if (
        self.tree.findPath.indexOf(d.source.data) > -1 &&
        self.tree.findPath.indexOf(d.target.data) > -1
      ) {
        return 'red'
      }
      return 'gray'
    })
    .attr('x1', function (d) {
      return d.target.depth > d.source.depth ? d.target.x : d.source.x
    })
    .attr('y1', function (d) {
      return d.target.depth > d.source.depth ? d.target.y : d.source.y
    })
    .attr('x2', function (d) {
      return d.target.depth > d.source.depth ? d.target.x : d.source.x
    })
    .attr('y2', function (d) {
      return d.target.depth > d.source.depth ? d.target.y : d.source.y
    })
    .transition().duration(duration || 250)
    .attr('x2', function (d) {
      return d.target.depth <= d.source.depth ? d.target.x : d.source.x
    })
    .attr('y2', function (d) {
      return d.target.depth <= d.source.depth ? d.target.y : d.source.y
    })

  lineUpdate.transition().duration(duration || 250)
    .attr('stroke', function(d) {
      if (
        self.tree.findPath.indexOf(d.source.data) > -1 &&
        self.tree.findPath.indexOf(d.target.data) > -1
      ) {
        return 'red'
      }
      return 'gray'
    })
    .attr('x1', function (d) {
      return d.target.depth > d.source.depth ? d.target.x : d.source.x
    })
    .attr('y1', function (d) {
      return d.target.depth > d.source.depth ? d.target.y : d.source.y
    })
    .attr('x2', function (d) {
      return d.target.depth <= d.source.depth ? d.target.x : d.source.x
    })
    .attr('y2', function (d) {
      return d.target.depth <= d.source.depth ? d.target.y : d.source.y
    })

  var nodeUpdate = g2
    .selectAll('g.node')
    .data(descendants, function (d) {
      return d.data.value
    })

  var nodeEnter = nodeUpdate.enter()        
  nodeUpdate.exit().each(function (d) {
    if (self.selectedNode && self.selectedNode.value === d.value) {
      self.selectedNode = null
    }
  }).remove()
  
  var node = nodeEnter.append('g')
    .classed('node', true)
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
    .style('cursor', 'pointer')
    .on('click',function (d) {
      self.setSelectedNode(d)
    })

  node
    .append('circle')
    .attr('r',15)
    .style('stroke', function (d) {
      if (self.tree.findPath.indexOf(d.data) > -1) {
        return 'red'
      } else {
        return 'gray'
      }
    })
    .attr('fill', 'white')
    
  node
    .append('text')
    .classed('value',true)
    .attr('text-anchor','middle')
    .attr('dy',5)
    .style('fill', 'black')
    .text(function (d) {
      return d.data.value
    })
  
  node
    .append('text')
    .classed('balanceFactor',true)
    .attr('text-anchor','middle')
    .attr('dy',35)
    .style('fill', function (d) {
      if (d.data.balanceFactor > 1) {
        return 'red'
      }
      return 'blue'
    })
    .text(function (d) {
      var text = ''
      if (d.data.balanceFactor !== undefined) {
        text += 'F:' + d.data.balanceFactor + ' '
      }
      if (d.data.height !== undefined) {
        text += 'H:' + d.data.height
      }
      return text
    })

  nodeUpdate
  .transition().duration(duration || 250)
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
  nodeUpdate.selectAll('circle')
  .style('fill',function (d) {
    return self.selectedNode && self.selectedNode.value === d.value ? 'orange' : 'white'
  })
  .style('stroke', function (d) {
    if (self.tree.findPath.indexOf(d.data) > -1) {
      return 'red'
    } else {
      return 'gray'
    }
  })

  nodeUpdate.selectAll('text.value').text(function (d) { return d.data.value })
  nodeUpdate.selectAll('text.balanceFactor').style('fill', function (d) {
    if (d.data.balanceFactor > 1) {
      return 'red'
    }
    return 'blue'
  }).text(function (d) {
    var text = ''
    if (d.data.balanceFactor !== undefined) {
      text += 'F:' + d.data.balanceFactor + ' '
    }
    if (d.data.height !== undefined) {
      text += 'H:' + d.data.height
    }
    return text
  })
}