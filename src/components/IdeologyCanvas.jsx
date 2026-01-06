import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getNodeColor, getNodeStyle, getEdgeColor, COLORS } from '../utils/colorScheme';

/**
 * 主可视化画布组件
 * 核心功能：点击节点 → 高亮所有关联的节点和边
 */
export function IdeologyCanvas({ data, selectedNode: externalSelectedNode, onNodeSelect }) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (!data.nodes.length) return;

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // 创建主绘图组（用于缩放）
    const g = svg.append('g').attr('class', 'main-group');

    // Calculate scales
    const yExtent = d3.extent(data.nodes, d => d.x); // Semantic embedding range (Y-axis)

    const margin = { top: 40, right: 100, bottom: 80, left: 100 };

    // Segmented time axis - 5 equal-width eras
    const eras = [
      { name: 'Ancient', start: -500, end: 0, color: '#8e44ad' },
      { name: 'Medieval', start: 0, end: 1500, color: '#2980b9' },
      { name: 'Enlightenment', start: 1500, end: 1700, color: '#27ae60' },
      { name: 'Modern', start: 1700, end: 1900, color: '#f39c12' },
      { name: 'Contemporary', start: 1900, end: 2010, color: '#e74c3c' }
    ];

    const totalWidth = dimensions.width - margin.left - margin.right;
    const segmentWidth = totalWidth / 5; // 20% each

    // Function to map year to segmented X position
    function yearToSegmentedX(year) {
      const era = eras.find(e => year >= e.start && year < e.end) || eras[eras.length - 1];
      const eraIndex = eras.indexOf(era);
      const eraProgress = (year - era.start) / (era.end - era.start);
      const segmentStart = margin.left + (eraIndex * segmentWidth);
      return segmentStart + (eraProgress * segmentWidth);
    }

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([dimensions.height - margin.bottom, margin.top]);

    // Draw segmented X-axis with colored backgrounds
    const axisGroup = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${dimensions.height - margin.bottom})`);

    eras.forEach((era, i) => {
      const segmentStart = margin.left + (i * segmentWidth);

      // Background rectangle for each era
      axisGroup.append('rect')
        .attr('x', segmentStart)
        .attr('y', -10)
        .attr('width', segmentWidth)
        .attr('height', 20)
        .attr('fill', era.color)
        .attr('opacity', 0.1)
        .attr('stroke', era.color)
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.3);

      // Era boundary line (except first)
      if (i > 0) {
        axisGroup.append('line')
          .attr('x1', segmentStart)
          .attr('x2', segmentStart)
          .attr('y1', -5)
          .attr('y2', 5)
          .attr('stroke', COLORS.TEXT)
          .attr('stroke-width', 2);
      }

      // Era label
      axisGroup.append('text')
        .attr('x', segmentStart + segmentWidth / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', era.color)
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(era.name);

      // Year range label below
      axisGroup.append('text')
        .attr('x', segmentStart + segmentWidth / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('fill', COLORS.TEXT)
        .style('font-size', '11px')
        .style('opacity', 0.6)
        .text(`${era.start < 0 ? Math.abs(era.start) + ' BCE' : era.start} - ${era.end}`);
    });

    // Y-axis label (semantic dimension has no absolute meaning)
    // Just add a hint text on the left side
    g.append('text')
      .attr('x', 20)
      .attr('y', dimensions.height / 2)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90, 20, ${dimensions.height / 2})`)
      .style('fill', COLORS.TEXT)
      .style('font-size', '12px')
      .style('opacity', 0.5)
      .text('← Semantic Similarity →');

    // 计算节点的连接关系（用于高亮）
    const nodeConnections = new Map();
    data.nodes.forEach(node => {
      const connected = new Set();
      data.edges.forEach(edge => {
        if (edge.source === node.id) {
          connected.add(edge.target);
        }
        if (edge.target === node.id) {
          connected.add(edge.source);
        }
      });
      nodeConnections.set(node.id, connected);
    });

    // 绘制边（关系）
    const edges = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(data.edges)
      .join('line')
      .attr('x1', d => {
        const source = data.nodes.find(n => n.id === d.source);
        return yearToSegmentedX(source.era);  // X-axis = time (era)
      })
      .attr('y1', d => {
        const source = data.nodes.find(n => n.id === d.source);
        return yScale(source.x);  // Y-axis = semantic embedding (x)
      })
      .attr('x2', d => {
        const target = data.nodes.find(n => n.id === d.target);
        return yearToSegmentedX(target.era);  // X-axis = time (era)
      })
      .attr('y2', d => {
        const target = data.nodes.find(n => n.id === d.target);
        return yScale(target.x);  // Y-axis = semantic embedding (x)
      })
      .attr('stroke', d => getEdgeColor(d.type, false))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0)  // Hidden by default
      .attr('stroke-dasharray', d => {
        return d.type === 'opposes' ? '5,5' : '0';
      });

    // Calculate node clusters for nebula effect
    const clusterRadius = 80; // px - distance to consider "close"
    const nebulae = [];

    data.nodes.forEach((node, i) => {
      const nodeX = yearToSegmentedX(node.era);  // X-axis = time
      const nodeY = yScale(node.x);  // Y-axis = semantic embedding

      // Count nearby nodes
      let nearbyCount = 0;
      let avgColor = { r: 0, g: 0, b: 0 };

      data.nodes.forEach((other, j) => {
        if (i === j) return;
        const otherX = yearToSegmentedX(other.era);  // X-axis = time
        const otherY = yScale(other.x);  // Y-axis = semantic embedding
        const distance = Math.sqrt(
          Math.pow(nodeX - otherX, 2) +
          Math.pow(nodeY - otherY, 2)
        );

        if (distance < clusterRadius) {
          nearbyCount++;
          // Get RGB from hex color
          const color = getNodeColor(other);
          const rgb = {
            r: parseInt(color.slice(1,3), 16),
            g: parseInt(color.slice(3,5), 16),
            b: parseInt(color.slice(5,7), 16)
          };
          avgColor.r += rgb.r;
          avgColor.g += rgb.g;
          avgColor.b += rgb.b;
        }
      });

      // If cluster found (3+ nearby nodes), create nebula
      if (nearbyCount >= 3) {
        avgColor.r = Math.floor(avgColor.r / nearbyCount);
        avgColor.g = Math.floor(avgColor.g / nearbyCount);
        avgColor.b = Math.floor(avgColor.b / nearbyCount);

        nebulae.push({
          x: nodeX,
          y: nodeY,
          color: `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`,
          intensity: Math.min(nearbyCount / 10, 0.3) // Max 30% opacity
        });
      }
    });

    // Draw nebulae as radial gradients (behind everything)
    const nebulaLayer = g.insert('g', ':first-child')
      .attr('class', 'nebulae');

    nebulae.forEach((nebula, idx) => {
      // Create unique gradient ID
      const gradientId = `nebula-${idx}`;

      svg.append('defs').append('radialGradient')
        .attr('id', gradientId)
        .selectAll('stop')
        .data([
          { offset: '0%', color: nebula.color, opacity: nebula.intensity },
          { offset: '50%', color: nebula.color, opacity: nebula.intensity * 0.3 },
          { offset: '100%', color: nebula.color, opacity: 0 }
        ])
        .join('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color)
        .attr('stop-opacity', d => d.opacity);

      // Draw nebula circle
      nebulaLayer.append('circle')
        .attr('cx', nebula.x)
        .attr('cy', nebula.y)
        .attr('r', 60)
        .attr('fill', `url(#${gradientId})`)
        .attr('pointer-events', 'none');
    });

    // 绘制节点
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('transform', d => `translate(${yearToSegmentedX(d.era)}, ${yScale(d.x)})`);

    // 节点圆圈 - Starfield effect with random sizes and glow
    nodes.append('circle')
      .attr('r', d => {
        // Random size between 5-10px for depth variation
        // Store on node data for consistency across updates
        if (!d.starSize) d.starSize = 5 + Math.random() * 5;
        return d.starSize;
      })
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', 'none')  // Remove white border for softer look
      .attr('opacity', 0.85)   // Slightly more visible
      .style('cursor', 'pointer')
      .style('filter', d => {
        // Glow effect - larger glow for larger stars
        const blurRadius = d.starSize * 1.2;
        return `drop-shadow(0 0 ${blurRadius}px ${getNodeColor(d)})`;
      });

    // Add subtle twinkle animation to each node
    nodes.selectAll('circle').each(function(d) {
      // Random delay and duration for natural effect
      const delay = Math.random() * 3000;
      const duration = 2000 + Math.random() * 2000; // 2-4 seconds

      const twinkle = () => {
        d3.select(this)
          .transition()
          .delay(delay)
          .duration(duration)
          .attr('opacity', 0.7)
          .transition()
          .duration(duration)
          .attr('opacity', 1.0)
          .on('end', twinkle); // Loop forever
      };

      twinkle();
    });

    // 节点标签
    nodes.append('text')
      .attr('dy', -12)
      .attr('text-anchor', 'middle')
      .attr('class', 'node-label')
      .style('fill', COLORS.TEXT)
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('opacity', 0)
      .text(d => d.name);

    // Function to highlight a node and its connections
    const highlightNode = (d, element) => {
      const connectedIds = nodeConnections.get(d.id);

      // Visual feedback: flash effect on clicked node (only if element provided)
      if (element) {
        d3.select(element).select('circle')
          .transition().duration(200).attr('r', 12)
          .transition().duration(200).attr('r', 8);
      }

      // 更新节点样式
      nodes.selectAll('circle')
        .attr('opacity', node => {
          if (node.id === d.id) return 1; // 选中的节点
          if (connectedIds.has(node.id)) return 1; // 连接的节点
          return 0.15; // 其他节点半透明
        })
        .attr('stroke', node => {
          if (node.id === d.id) return '#ffd700'; // 选中节点金色边框
          if (connectedIds.has(node.id)) return '#ffffff';
          return '#ffffff';
        })
        .attr('stroke-width', node => {
          if (node.id === d.id) return 3;
          if (connectedIds.has(node.id)) return 2;
          return 1;
        });

      // 更新节点标签
      nodes.selectAll('text')
        .style('opacity', node => {
          if (node.id === d.id) return 1;              // Selected: fully visible
          if (connectedIds.has(node.id)) return 0.6;   // Connected: semi-visible
          return 0;                                     // Others: hidden
        })
        .style('font-weight', node => {
          if (node.id === d.id) return 'bold';
          if (connectedIds.has(node.id)) return '600';
          return '500';
        });

      // 更新边样式 - 重点：只高亮相关的边
      edges
        .attr('stroke', edge => {
          const isRelated = edge.source === d.id || edge.target === d.id;
          return getEdgeColor(edge.type, isRelated);
        })
        .attr('stroke-width', edge => {
          const isRelated = edge.source === d.id || edge.target === d.id;
          return isRelated ? 3 : 1.5;
        })
        .attr('stroke-opacity', edge => {
          const isRelated = edge.source === d.id || edge.target === d.id;
          return isRelated ? 1.0 : 0;  // Hide unrelated edges completely
        });
    };

    // 核心交互：点击节点高亮关联
    nodes.on('click', function(event, d) {
      event.stopPropagation();
      onNodeSelect(d);
      highlightNode(d, this);
    });

    // Handle external selection (e.g., from search)
    if (externalSelectedNode) {
      highlightNode(externalSelectedNode);
    }

    // 点击画布空白处取消选择
    svg.on('click', function() {
      onNodeSelect(null);

      // 恢复所有节点
      nodes.selectAll('circle')
        .attr('opacity', 0.8)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);

      // Hide all labels again
      nodes.selectAll('text')
        .transition()
        .duration(300)
        .style('opacity', 0)
        .style('font-weight', '500');

      // 恢复所有边
      edges
        .attr('stroke', d => getEdgeColor(d.type, false))
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0);  // Keep edges hidden when deselected
    });

    // 悬停效果 - Enhanced for starfield
    nodes.on('mouseenter', function(event, d) {
      if (externalSelectedNode) return; // 如果已选中节点，不响应悬停

      // Enlarge node smoothly (works with any base size)
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('transform', 'scale(1.3)'); // 30% larger

      // Enhanced glow on hover
      d3.select(this).select('circle')
        .style('filter', () => {
          const blurRadius = d.starSize * 2; // Double glow
          return `drop-shadow(0 0 ${blurRadius}px ${getNodeColor(d)})`;
        });

      // Show THIS node's label with elegant fade-in
      d3.select(this).select('text')
        .transition()
        .duration(300)
        .style('opacity', 1)
        .style('font-weight', 'bold');

      // Keep all other labels hidden
      const hoveredNode = d;
      nodes.selectAll('text')
        .filter(node => node.id !== hoveredNode.id)
        .transition()
        .duration(200)
        .style('opacity', 0);
    });

    nodes.on('mouseleave', function(event, d) {
      if (externalSelectedNode) return;

      // Restore node size
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('transform', 'scale(1)');

      // Restore normal glow
      d3.select(this).select('circle')
        .style('filter', () => {
          const blurRadius = d.starSize * 1.2;
          return `drop-shadow(0 0 ${blurRadius}px ${getNodeColor(d)})`;
        });

      // Hide label with smooth fade-out
      d3.select(this).select('text')
        .transition()
        .duration(300)
        .style('opacity', 0)
        .style('font-weight', '500');
    });

    // 缩放功能
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [data, dimensions, externalSelectedNode, onNodeSelect]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.BACKGROUND,
      overflow: 'hidden'
    }}>
      <svg ref={svgRef} style={{ display: 'block' }} />
    </div>
  );
}
