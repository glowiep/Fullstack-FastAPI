import React, { useState, useEffect, useRef } from 'react';
import { FileText, Mic, Image, AlertCircle, File } from 'lucide-react';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
// import { sampleStudents } from '../constants/sampleStudents';
interface Student {
  id: string;
  name: string;
  behaviors: string[];
  reports: string[];
  textFiles: string[];
  voiceFiles: string[];
  imageFiles: string[];
}

interface Node {
  id: string;
  x: number;
  y: number;
  type: 'student' | 'behavior' | 'report' | 'text' | 'voice' | 'image';
  label: string;
  parentId?: string; // Track parent node for child nodes
}

interface Edge {
  source: string;
  target: string;
}

interface StudentGraphProps {
  sampleStudents: Student[];
}

const StudentGraph: React.FC<StudentGraphProps> = ({ sampleStudents }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState(zoomIdentity.scale(1.2)); // Default zoomed in
  const svgRef = useRef<SVGSVGElement>(null);

  // Sample data
//   const sampleStudents: Student[] = [
//     {
//       id: '1',
//       name: 'Alice Smith',
//       behaviors: ['Disruptive in class', 'Excellent participation'],
//       reports: ['Q1 Progress', 'Mid-year evaluation'],
//       textFiles: ['Notes_1.txt', 'Essay_1.doc'],
//       voiceFiles: ['Presentation1.mp3'],
//       imageFiles: ['Project1.jpg', 'Project2.jpg']
//     },
//     {
//       id: '2',
//       name: 'Bob Johnson',
//       behaviors: ['Good teamwork'],
//       reports: ['Q1 Progress'],
//       textFiles: ['Essay_2.doc'],
//       voiceFiles: [],
//       imageFiles: ['Assignment1.jpg']
//     }
//   ];

  useEffect(() => {
    // Initialize graph layout
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const centerX = window.innerWidth / 2; // Center of the screen
    const centerY = window.innerHeight / 2; // Center of the screen
    const radius = 150;

    // Create student nodes
    sampleStudents.forEach((student, index) => {
      const angle = (index / sampleStudents.length) * 2 * Math.PI;
      const studentNode: Node = {
        id: student.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        type: 'student',
        label: student.name
      };
      newNodes.push(studentNode);

      // Create connected nodes and edges
      let connectedNodes = 0;
      
      student.behaviors.forEach((behavior, i) => {
        const nodeId = `${student.id}-behavior-${i}`;
        const subAngle = angle + (connectedNodes * 0.2);
        newNodes.push({
          id: nodeId,
          x: centerX + (radius * 1.5) * Math.cos(subAngle),
          y: centerY + (radius * 1.5) * Math.sin(subAngle),
          type: 'behavior',
          label: behavior,
          parentId: student.id // Link to parent node
        });
        newEdges.push({ source: student.id, target: nodeId });
        connectedNodes++;
      });

      // Add other node types similarly...
      [
        { items: student.reports, type: 'report' },
        { items: student.textFiles, type: 'text' },
        { items: student.voiceFiles, type: 'voice' },
        { items: student.imageFiles, type: 'image' }
      ].forEach(({ items, type }) => {
        items.forEach((item, i) => {
          const nodeId = `${student.id}-${type}-${i}`;
          const subAngle = angle + (connectedNodes * 0.2);
          newNodes.push({
            id: nodeId,
            x: centerX + (radius * 1.5) * Math.cos(subAngle),
            y: centerY + (radius * 1.5) * Math.sin(subAngle),
            type: type as any,
            label: item,
            parentId: student.id // Link to parent node
          });
          newEdges.push({ source: student.id, target: nodeId });
          connectedNodes++;
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      const svg = select(svgRef.current);
      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 2]) // Zoom limits
        .on('zoom', (event) => {
          setTransform(event.transform);
        });

      // Apply initial zoom and center
      svg.call(zoomBehavior.transform, zoomIdentity.scale(1.2).translate(-200, -140)); // Adjust translate for centering
    }
  }, []);

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    setDragging(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setOffset({
        x: e.clientX - node.x * transform.k - transform.x,
        y: e.clientY - node.y * transform.k - transform.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const dx = (e.clientX - transform.x - offset.x) / transform.k;
      const dy = (e.clientY - transform.y - offset.y) / transform.k;

      setNodes(nodes.map(node => {
        if (node.id === dragging || node.parentId === dragging) {
          // Move the parent node or its children
          return {
            ...node,
            x: node.id === dragging ? dx : node.x + (dx - nodes.find(n => n.id === dragging)!.x),
            y: node.id === dragging ? dy : node.y + (dy - nodes.find(n => n.id === dragging)!.y)
          };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'voice':
        return <Mic className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'behavior':
        return <AlertCircle className="w-4 h-4" />;
      case 'report':
        return <File className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full h-screen bg-gray-100 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        ref={svgRef}
        className="w-full h-full"
      >
        {/* Apply transformation to the SVG group */}
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {/* Draw edges */}
          {edges.map((edge, i) => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (source && target) {
              return (
                <line
                  key={`edge-${i}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={selectedNode && (edge.source === selectedNode || edge.target === selectedNode) ? '#2563eb' : '#e5e7eb'}
                  strokeWidth="1"
                />
              );
            }
            return null;
          })}
        </g>
      </svg>

      {/* Draw nodes */}
      {nodes.map(node => {
        // Hide connected nodes when zoomed out
        if (node.type !== 'student' && transform.k < 1) return null;

        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move
              ${node.type === 'student' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}
              ${selectedNode === node.id ? 'ring-2 ring-blue-500' : ''}
              rounded-lg shadow-sm p-2 flex items-center gap-2`}
            style={{
              left: `${node.x * transform.k + transform.x}px`,
              top: `${node.y * transform.k + transform.y}px`,
              transform: `scale(${1 / transform.k})`
            }}
            onMouseDown={(e) => handleMouseDown(node.id, e)}
            onClick={() => setSelectedNode(node.id)}
          >
            {getNodeIcon(node.type)}
            <span className={`text-sm ${node.type === 'student' ? 'font-medium' : ''}`}>
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StudentGraph;