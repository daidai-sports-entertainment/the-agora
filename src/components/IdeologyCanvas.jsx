import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getNodeColor, getEdgeColor, COLORS } from '../utils/colorScheme';
import { formatEra, getText } from '../utils/i18n';

/**
 * 主可视化画布组件
 * 核心功能：点击节点 → 高亮所有关联的节点和边
 */
export function IdeologyCanvas({
  data,
  selectedNode: externalSelectedNode,
  onNodeSelect,
  language,
  onRegisterControls,
  filterDomain
}) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const zoomRef = useRef(null);
  const svgSelectionRef = useRef(null);

  useEffect(() => {
    if (!data.nodes.length) return;

    const t = getText(language);
    const nodeById = new Map(data.nodes.map(node => [node.id, node]));

    const matchesFilter = (node) => {
      if (!filterDomain || filterDomain.length === 0) return true;
      const hasPhilosophy = node.domains.includes('philosophy');
      const hasPolitics = node.domains.includes('politics');
      const category = hasPhilosophy && hasPolitics
        ? 'both'
        : hasPolitics
          ? 'politics'
          : 'philosophy';

      return filterDomain.includes(category);
    };

    const matchesEdgeFilter = (edge) => {
      if (!filterDomain || filterDomain.length === 0) return true;
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      if (!source || !target) return false;
      return matchesFilter(source) && matchesFilter(target);
    };

    const toRGBA = (hex, alpha) => {
      const sanitized = hex.replace('#', '');
      const r = parseInt(sanitized.slice(0, 2), 16);
      const g = parseInt(sanitized.slice(2, 4), 16);
      const b = parseInt(sanitized.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    svgSelectionRef.current = svg;

    // 创建主绘图组（用于缩放）
    const g = svg.append('g').attr('class', 'main-group');

    // Calculate scales
    const yExtent = d3.extent(data.nodes, d => d.x); // Semantic embedding range (Y-axis)

    const margin = { top: 40, right: 100, bottom: 80, left: 100 };

    // Segmented time axis - 5 equal-width eras
    const eras = [
      { name: t.eraNames[0], start: -500, end: 0, color: '#5c6fb3' },
      { name: t.eraNames[1], start: 0, end: 1500, color: '#4f7aa3' },
      { name: t.eraNames[2], start: 1500, end: 1700, color: '#6c9a8b' },
      { name: t.eraNames[3], start: 1700, end: 1900, color: '#b59f6a' },
      { name: t.eraNames[4], start: 1900, end: 2010, color: '#b57474' }
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
        .style('font-family', 'var(--font-title)')
        .text(era.name);

      // Year range label below
      axisGroup.append('text')
        .attr('x', segmentStart + segmentWidth / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('fill', COLORS.TEXT)
        .style('font-size', '11px')
        .style('opacity', 0.6)
        .style('font-family', 'var(--font-body)')
        .text(`${formatEra(era.start, language)} - ${formatEra(era.end, language)}`);
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
      .style('font-family', 'var(--font-body)')
      .text(t.axisLabel);

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

    const effectsLayer = g.append('g').attr('class', 'effects');

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
      .attr('transform', d => {
        d.baseX = yearToSegmentedX(d.era);
        d.baseY = yScale(d.x);
        return `translate(${d.baseX}, ${d.baseY})`;
      });

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
      .attr('opacity', d => (matchesFilter(d) ? 0.85 : 0.2))
      .style('cursor', 'pointer')
      .style('filter', d => {
        const baseColor = getNodeColor(d);
        if (!matchesFilter(d)) {
          return `drop-shadow(0 0 2px ${toRGBA(baseColor, 0.2)})`;
        }
        const blurRadius = d.starSize * 1.2;
        return `drop-shadow(0 0 ${blurRadius}px ${baseColor})`;
      });

    // Add subtle twinkle animation to each node
    nodes.selectAll('circle').each(function(d) {
      const twinkle = () => {
        const delay = Math.random() * 2000;
        const duration = 1800 + Math.random() * 2600;
        const minOpacity = matchesFilter(d) ? 0.55 : 0.18;
        const maxOpacity = matchesFilter(d) ? 0.95 : 0.25;

        d3.select(this)
          .transition()
          .delay(delay)
          .duration(duration)
          .attr('opacity', minOpacity)
          .transition()
          .duration(duration)
          .attr('opacity', maxOpacity)
          .on('end', twinkle);
      };

      twinkle();
    });

    nodes.each(function(d) {
      const node = d3.select(this);
      const drift = () => {
        const dx = (Math.random() - 0.5) * 6;
        const dy = (Math.random() - 0.5) * 6;
        const duration = 4000 + Math.random() * 3000;

        if (!matchesFilter(d)) {
          return;
        }

        node
          .transition()
          .duration(duration)
          .ease(d3.easeSinInOut)
          .attr('transform', `translate(${d.baseX + dx}, ${d.baseY + dy})`)
          .transition()
          .duration(duration)
          .ease(d3.easeSinInOut)
          .attr('transform', `translate(${d.baseX}, ${d.baseY})`)
          .on('end', drift);
      };

      drift();
    });

    // 节点标签
    nodes.append('text')
      .attr('dy', -12)
      .attr('text-anchor', 'middle')
      .attr('class', 'node-label')
      .style('fill', COLORS.TEXT)
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('font-family', 'var(--font-body)')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .style('opacity', 0)
      .text(d => d.name);

    const applyFilterBaseState = () => {
      nodes.selectAll('circle')
        .attr('opacity', d => (matchesFilter(d) ? 0.85 : 0.2))
        .attr('stroke', d => (matchesFilter(d) ? '#8a94a8' : 'transparent'))
        .attr('stroke-width', d => (matchesFilter(d) ? 1 : 0))
        .style('filter', d => {
          const baseColor = getNodeColor(d);
          if (!matchesFilter(d)) {
            return `drop-shadow(0 0 2px ${toRGBA(baseColor, 0.2)})`;
          }
          const blurRadius = d.starSize * 1.2;
          return `drop-shadow(0 0 ${blurRadius}px ${baseColor})`;
        });

      nodes.selectAll('text')
        .interrupt()
        .style('opacity', 0)
        .style('font-weight', '500');

      edges
        .attr('stroke', d => getEdgeColor(d.type, false))
        .attr('stroke-width', d => (matchesEdgeFilter(d) ? 1.2 : 1))
        .attr('stroke-opacity', d => {
          if (!filterDomain || filterDomain.length === 0) return 0;
          return matchesEdgeFilter(d) ? 0.25 : 0;
        });
    };

    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;

    const zoomBy = (factor) => {
      if (!svgSelectionRef.current || !zoomRef.current) return;
      svgSelectionRef.current
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, factor);
    };

    const resetView = () => {
      if (!svgSelectionRef.current || !zoomRef.current) return;
      svgSelectionRef.current
        .transition()
        .duration(500)
        .ease(d3.easeCubicOut)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    };

    onRegisterControls?.({
      zoomIn: () => zoomBy(1.2),
      zoomOut: () => zoomBy(0.8),
      reset: resetView
    });

    const focusOnNode = (node) => {
      const focusScale = 1.6;
      const nodeX = yearToSegmentedX(node.era);
      const nodeY = yScale(node.x);
      const translateX = (dimensions.width / 2) - (nodeX * focusScale);
      const translateY = (dimensions.height / 2) - (nodeY * focusScale);

      svg.transition()
        .duration(900)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(focusScale));
    };

    const resetFocus = () => {
      svg.transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .call(zoom.transform, d3.zoomIdentity);
    };

    const spawnDiscoveryPulse = (node) => {
      const nodeX = yearToSegmentedX(node.era);
      const nodeY = yScale(node.x);
      const pulseColor = '#e6c98a';

      effectsLayer.append('circle')
        .attr('cx', nodeX)
        .attr('cy', nodeY)
        .attr('r', (node.starSize || 8) + 8)
        .attr('fill', 'none')
        .attr('stroke', pulseColor)
        .attr('stroke-width', 2)
        .attr('opacity', 0.9)
        .style('filter', 'drop-shadow(0 0 12px rgba(230, 201, 138, 0.65))')
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr('r', 70)
        .attr('opacity', 0)
        .remove();
    };

    svg.call(zoom);
    applyFilterBaseState();

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
          if (!matchesFilter(node)) return 0.2;
          if (node.id === d.id) return 1;
          if (connectedIds.has(node.id)) return 1;
          return 0.2;
        })
        .attr('stroke', node => {
          if (!matchesFilter(node)) return 'transparent';
          if (node.id === d.id) return '#e6c98a'; // 选中节点金色边框
          if (connectedIds.has(node.id)) return '#e9e4da';
          return '#6b768a';
        })
        .attr('stroke-width', node => {
          if (!matchesFilter(node)) return 0;
          if (node.id === d.id) return 3;
          if (connectedIds.has(node.id)) return 2;
          return 1;
        });

      // 更新节点标签
      nodes.selectAll('text')
        .interrupt()
        .style('opacity', node => {
          if (!matchesFilter(node)) return 0;
          if (node.id === d.id) return 1;
          if (connectedIds.has(node.id)) return 0.6;
          return 0;
        })
        .style('font-weight', node => {
          if (!matchesFilter(node)) return '500';
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
          if (!matchesEdgeFilter(edge)) return 0;
          return isRelated ? 1.0 : 0;
        });
    };

    // 核心交互：点击节点高亮关联
    nodes.on('click', function(event, d) {
      if (!matchesFilter(d)) return;
      event.stopPropagation();
      onNodeSelect(d);
      highlightNode(d, this);
      spawnDiscoveryPulse(d);
      focusOnNode(d);
    });

    // Handle external selection (e.g., from search)
    if (externalSelectedNode && matchesFilter(externalSelectedNode)) {
      highlightNode(externalSelectedNode);
      spawnDiscoveryPulse(externalSelectedNode);
      focusOnNode(externalSelectedNode);
    }

    // 点击画布空白处取消选择
    svg.on('click', function() {
      onNodeSelect(null);

      applyFilterBaseState();

      resetFocus();
    });

    // 悬停效果 - Enhanced for starfield
    nodes.on('mouseenter', function(event, d) {
      if (externalSelectedNode) return; // 如果已选中节点，不响应悬停
      if (!matchesFilter(d)) return;

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
      if (!matchesFilter(d)) return;

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

  }, [data, dimensions, externalSelectedNode, onNodeSelect, language, onRegisterControls, filterDomain]);

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
