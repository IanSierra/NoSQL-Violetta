import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  label: string;
  name: string;
  group: string;
}

interface Link {
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface GraphVisualizationProps {
  data: GraphData;
  width?: string | number;
  height: number;
}

const GraphVisualization = ({ data, width = "100%", height }: GraphVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Color map for node types
  const colorMap: Record<string, string> = {
    User: "#1F4F9E",
    Product: "#13AA52",
    Order: "#4A77D6",
    Supplier: "#00684A",
    Manufacturer: "#FF9900",
    Distributor: "#FF5733",
    Retailer: "#8E44AD"
  };

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const containerWidth = svgRef.current.clientWidth;
    
    // Set up the simulation
    const simulation = d3.forceSimulation<d3.SimulationNodeDatum & Node>()
      .force("link", d3.forceLink<Node, d3.SimulationLinkDatum<Node>>().id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(containerWidth / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Process the links to use node objects instead of IDs
    const nodeMap = new Map<string, Node & d3.SimulationNodeDatum>();
    data.nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, x: containerWidth / 2, y: height / 2 });
    });

    const links = data.links.map(link => ({
      source: nodeMap.get(link.source) || link.source,
      target: nodeMap.get(link.target) || link.target,
      label: link.label
    }));

    // Create the link lines
    const linkElements = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,5");

    // Create link labels
    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(links)
      .enter()
      .append("text")
      .text(d => d.label)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .attr("fill", "#666");

    // Create node groups
    const nodeGroups = svg.append("g")
      .selectAll("g")
      .data(Array.from(nodeMap.values()))
      .enter()
      .append("g")
      .call(d3.drag<SVGGElement, Node & d3.SimulationNodeDatum>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    // Create node circles
    nodeGroups.append("circle")
      .attr("r", 25)
      .attr("fill", d => colorMap[d.group] || "#999")
      .attr("fill-opacity", 0.7)
      .attr("stroke", d => colorMap[d.group] || "#999")
      .attr("stroke-width", 2);

    // Create node labels
    nodeGroups.append("text")
      .text(d => d.name)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white");

    // Add node type labels below
    nodeGroups.append("text")
      .text(d => d.label)
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("dy", "20px")
      .attr("fill", "white");

    // Set up the simulation
    simulation.nodes(Array.from(nodeMap.values()));
    (simulation.force("link") as d3.ForceLink<Node, d3.SimulationLinkDatum<Node>>).links(links);

    // Update positions on tick
    simulation.on("tick", () => {
      linkElements
        .attr("x1", d => (d.source as Node & d3.SimulationNodeDatum).x!)
        .attr("y1", d => (d.source as Node & d3.SimulationNodeDatum).y!)
        .attr("x2", d => (d.target as Node & d3.SimulationNodeDatum).x!)
        .attr("y2", d => (d.target as Node & d3.SimulationNodeDatum).y!);

      linkLabels
        .attr("x", d => ((d.source as Node & d3.SimulationNodeDatum).x! + (d.target as Node & d3.SimulationNodeDatum).x!) / 2)
        .attr("y", d => ((d.source as Node & d3.SimulationNodeDatum).y! + (d.target as Node & d3.SimulationNodeDatum).y!) / 2);

      nodeGroups.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node & d3.SimulationNodeDatum, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node & d3.SimulationNodeDatum, any>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node & d3.SimulationNodeDatum, any>) {
      if (!event.active) simulation.alphaTarget(0);
      
      // Keep the node fixed at its current position
      // Remove these lines if you want nodes to drift back into simulation
      // event.subject.fx = null;
      // event.subject.fy = null;
    }

    // Clean up
    return () => {
      simulation.stop();
    };
  }, [data, height]);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ overflow: "visible" }}></svg>
  );
};

export default GraphVisualization;
