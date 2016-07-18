/**
 * Created by Mikie and Nicky on 7/18/2016.
 */

// get the data
d3.json('../js/sampleGraphData.json', function(error, edge) {

  // let nodes = {};
  let items = edge.items;

  // Compute the distinct nodes from the edge.
  edge.relationships.forEach(function(node) {
    node.source = getItemWithId(items, node.fromItem);
    node.target = getItemWithId(items, node.toItem);
    node.value = +node.type;
  });

  let width = 960;
  let height = 600;

  let force = d3.layout.force()
    .nodes(d3.values(items))
    .links(edge.relationships)
    .size([width, height])
    .linkDistance(60)
    .charge(-500)
    .on('tick', tick)
    .start();

  let svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

  // ============ build the arrow ================
  svg.append('svg:defs').selectAll('marker')
    .data(['end'])      // Different link/path types can be defined here
    .enter().append('svg:marker')    // This section adds in the arrows
    .attr('id', String)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)
    .attr('refY', -1.5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('class', 'arrow');

  // ============ edge combined with the arrows ===========
  let path = svg.append('svg:g').selectAll('path')
    .data(force.links())
    .enter().append('svg:path')
    .attr('class', function(d) { return 'link ' + d.type; })
    .attr('class', 'link')
    .attr('marker-end', 'url(#end)');

  // define the nodes
  let node = svg.selectAll('.node')
    .data(force.nodes())
    .enter().append('g')
    .attr('class', 'node')
    .call(force.drag)
  // Uncomment this to enable collapsing
  // .on("click", nodeClick);

  // add the nodes
  node.append('circle')
    .attr('r', 5);

  // add the text
  node.append('text')
    .attr('x', 12)
    .attr('dy', '.35em')
    .attr('class', 'nodeText')
    .text(function(d) { return d.name; });

  // ------------ Node Enter Section ----------------

  // ============= add the curvy lines ==============

  function tick() {
    path.attr('d', function(d) {
      let dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
      return 'M' +
        d.source.x + ',' +
        d.source.y + 'A' +
        dr + ',' + dr + ' 0 0,1 ' +
        d.target.x + ',' +
        d.target.y;
    });

    node.attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
  }

  // ============ Toggle children on click ============
  // ============ Under Construction For Stretch Goal ============
  /*
   function nodeClick(d) {
   if (!d3.event.defaultPrevented) {
   //check if link is from this node, and if so, collapse
   root.edge.forEach(function(l) {
   if(l.source.id == d.id) {
   if(d.collapsed){
   l.target.collapsing--;
   } else {
   l.target.collapsing++;
   }
   }
   });
   d.collapsed = !d.collapsed;
   }
   update();
   }

   function getToItemValues(array, value) {
   let result = [];

   array.forEach (function (item) {
   if (item.fromItem === value) {
   result.push(item.toItem);
   }
   });
   return result;
   }
   */

  function getItemWithId(itemArray, id) {
    let result = null;

    itemArray.forEach (function (item) {
      if (item.id === id) {
        result = item;
        return;
      }
    });

    return result;
  }
});