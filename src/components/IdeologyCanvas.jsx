import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getNodeColor, getEdgeColor, COLORS } from '../utils/colorScheme';
import { formatEra, getText } from '../utils/i18n';
import { findSemanticPath, calculatePathQuality } from '../utils/pathFinding';

/**
 * 主可视化画布组件
 * 核心功能：点击节点 → 高亮所有关联的节点和边
 * 新增功能：影响路径追踪
 */
export function IdeologyCanvas({
  data,
  selectedNode: externalSelectedNode,
  onNodeSelect,
  language,
  onRegisterControls,
  filterDomain,
  pathMode,
  pathStart,
  pathEnd,
  onPathNodeSelect,
  pathResult,
  onPathResult,
  onZoomExtreme
}) {
  const svgRef = useRef(null);
  const [dimensions] = useState({ width: 1200, height: 800 });
  const zoomRef = useRef(null);
  const svgSelectionRef = useRef(null);
  const nodesSelectionRef = useRef(null);
  const edgesSelectionRef = useRef(null);
  const highlightPathRef = useRef(null);
  const applyFilterBaseStateRef = useRef(null);
  const yearToSegmentedXRef = useRef(null);
  const yScaleRef = useRef(null);
  const effectsLayerRef = useRef(null);
  const fireworkTimersRef = useRef([]);
  const zoomExtremeTriggeredRef = useRef({ max: false, min: false }); // 存储所有烟花定时器

  // 独立的effect用于计算路径（不触发重新渲染）
  useEffect(() => {
    if (pathMode && pathStart && pathEnd && pathResult === undefined) {
      try {
        // 使用增强的语义路径搜索
        const result = findSemanticPath(pathStart.id, pathEnd.id, data.nodes, data.edges, {
          maxLength: 4,        // 最多4步
          minScore: 40         // 最低40分
        });

        // 如果找到路径，确保有质量评分
        if (result && !result.quality) {
          result.quality = calculatePathQuality(result);
        }

        // 即使result为null也要调用，让父组件知道没有找到路径
        onPathResult?.(result);
      } catch (error) {
        console.error('Error calculating path:', error);
        onPathResult?.(null);
      }
    }
  }, [pathMode, pathStart, pathEnd, pathResult, data.nodes, data.edges, onPathResult]);

  // 独立的effect用于高亮路径（不重新渲染整个图）
  useEffect(() => {
    if (!nodesSelectionRef.current || !edgesSelectionRef.current) return;

    // 清理函数：停止所有动画和定时器
    const cleanup = () => {
      // 清除所有烟花定时器
      fireworkTimersRef.current.forEach(timer => clearTimeout(timer));
      fireworkTimersRef.current = [];

      // 停止所有闪烁动画
      if (nodesSelectionRef.current) {
        nodesSelectionRef.current.selectAll('circle').interrupt();
      }

      // 清除所有烟花粒子
      if (effectsLayerRef.current) {
        effectsLayerRef.current.selectAll('circle').remove();
      }
    };

    if (pathResult && pathResult.path && highlightPathRef.current) {
      // 有路径结果，高亮路径
      cleanup(); // 先清理
      highlightPathRef.current(pathResult);
    } else if (pathMode && pathStart && !pathEnd && pathResult === undefined && applyFilterBaseStateRef.current) {
      // 路径模式，已选起点，还没选终点 - 显示"星座回应"效果
      cleanup(); // 先清理之前的效果
      const nodes = nodesSelectionRef.current;

      // 🔧 性能优化：使用单次BFS找出所有可达节点，而不是为每个节点单独计算路径
      // 从O(n * BFS复杂度) 降到 O(单次BFS)
      const reachableNodes = new Set([pathStart.id]);

      // 构建邻接表
      const adjacency = new Map();
      data.nodes.forEach(n => adjacency.set(n.id, []));
      data.edges.forEach(edge => {
        adjacency.get(edge.source)?.push(edge.target);
        adjacency.get(edge.target)?.push(edge.source);
      });

      // BFS遍历，限制深度为4步（与findSemanticPath的maxLength一致）
      const queue = [{ id: pathStart.id, depth: 0 }];
      const visited = new Set([pathStart.id]);

      while (queue.length > 0) {
        const { id, depth } = queue.shift();
        if (depth >= 4) continue; // 最多4步

        const neighbors = adjacency.get(id) || [];
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            reachableNodes.add(neighborId);
            queue.push({ id: neighborId, depth: depth + 1 });
          }
        }
      }

      // 应用"星座回应"效果 - 更明显的视觉反馈
      nodes.selectAll('circle')
        .interrupt() // 停止所有现有动画
        .attr('opacity', node => {
          if (node.id === pathStart.id) return 1; // 起点：完全不透明
          if (reachableNodes.has(node.id)) return 1; // 可达节点：完全明亮
          return 0.2; // 不可达节点：非常暗淡
        })
        .attr('fill', node => {
          if (node.id === pathStart.id) return '#8fb4ff'; // 起点：亮蓝色
          if (reachableNodes.has(node.id)) return '#ffeb3b'; // 可达节点：亮黄色（更醒目）
          return getNodeColor(node); // 不可达节点：保持原色但透明
        })
        .attr('stroke', node => {
          if (node.id === pathStart.id) return '#ffffff'; // 起点：白色边框
          if (reachableNodes.has(node.id)) return '#ffffff'; // 可达节点：白色边框
          return 'transparent';
        })
        .attr('stroke-width', node => {
          if (node.id === pathStart.id) return 4;
          if (reachableNodes.has(node.id)) return 3;
          return 0;
        })
        .attr('transform', node => {
          if (node.id === pathStart.id) return 'scale(1.5)'; // 起点：更大
          if (reachableNodes.has(node.id)) return 'scale(1.2)'; // 可达节点：明显放大
          return 'scale(1)';
        })
        .style('filter', node => {
          if (node.id === pathStart.id) {
            return `drop-shadow(0 0 12px #8fb4ff) drop-shadow(0 0 24px #8fb4ff)`;
          }
          if (reachableNodes.has(node.id)) {
            return `drop-shadow(0 0 12px #ffeb3b) drop-shadow(0 0 24px #ffeb3b)`;
          }
          const baseColor = getNodeColor(node);
          return `drop-shadow(0 0 2px ${baseColor})`;
        });

      // 为可达节点添加强烈的闪烁动画
      nodes.selectAll('circle').each(function(node) {
        if (reachableNodes.has(node.id) && node.id !== pathStart.id) {
          const circle = d3.select(this);

          // 闪烁动画：在亮黄色和橙色之间快速切换
          function blink() {
            circle
              .transition()
              .duration(400)
              .attr('fill', '#ff9800') // 橙色
              .style('filter', 'drop-shadow(0 0 16px #ff9800) drop-shadow(0 0 32px #ff9800)')
              .transition()
              .duration(400)
              .attr('fill', '#ffeb3b') // 亮黄色
              .style('filter', 'drop-shadow(0 0 12px #ffeb3b) drop-shadow(0 0 24px #ffeb3b)')
              .on('end', blink);
          }
          blink();
        }
      });

      // 🔧 性能优化：减少烟花动画的粒子数量和频率，限制同时动画的节点数量
      if (yearToSegmentedXRef.current && yScaleRef.current && effectsLayerRef.current) {
        // 限制最多10个节点有烟花效果，避免创建过多粒子
        const reachableArray = Array.from(reachableNodes).filter(id => id !== pathStart.id);
        const animatedNodes = reachableArray.slice(0, 10);

        animatedNodes.forEach((nodeId, index) => {
          const node = data.nodes.find(n => n.id === nodeId);
          if (!node) return;

          const nodeX = yearToSegmentedXRef.current(node.era);
          const nodeY = yScaleRef.current(node.x);

          function createFirework() {
            if (!pathMode || !pathStart || pathEnd || pathResult !== undefined) {
              return;
            }

            // 🔧 减少粒子数量从12个到6个
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2;
              const distance = 30 + Math.random() * 20;
              const endX = nodeX + Math.cos(angle) * distance;
              const endY = nodeY + Math.sin(angle) * distance;

              if (effectsLayerRef.current) {
                effectsLayerRef.current.append('circle')
                  .attr('cx', nodeX)
                  .attr('cy', nodeY)
                  .attr('r', 2.5)
                  .attr('fill', i % 2 === 0 ? '#ffeb3b' : '#ff9800')
                  .attr('opacity', 0.8)
                  .transition()
                  .duration(800)
                  .ease(d3.easeCubicOut)
                  .attr('cx', endX)
                  .attr('cy', endY)
                  .attr('r', 0.5)
                  .attr('opacity', 0)
                  .remove();
              }
            }

            // 🔧 增加间隔时间从1.5秒到2.5秒
            const timerId = setTimeout(createFirework, 2500);
            fireworkTimersRef.current.push(timerId);
          }

          // 错开初始时间，避免所有节点同时爆发
          const initialTimerId = setTimeout(createFirework, index * 200 + Math.random() * 300);
          fireworkTimersRef.current.push(initialTimerId);
        });
      }
    } else {
      // 不在正确的状态（退出路径模式、选择了终点、或有路径结果），清理所有效果
      cleanup();
      if (applyFilterBaseStateRef.current) {
        applyFilterBaseStateRef.current();
      }
    }

    // 返回清理函数
    return cleanup;
  }, [pathResult, pathMode, pathStart, pathEnd, filterDomain, data.nodes, data.edges]);

  useEffect(() => {
    if (!data.nodes.length) return;

    const t = getText(language);
    // 🔧 性能优化：预先构建节点索引Map，避免O(n)的.find()查找
    const nodeById = new Map(data.nodes.map(node => [node.id, node]));

    // 🔧 性能优化：预计算节点位置，避免重复计算
    const nodePositions = new Map();

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

    // 清空之前的内容（包括旧的defs）
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    svgSelectionRef.current = svg;

    // 🔧 性能优化：预定义滤镜，避免每个节点都创建独立的CSS filter
    // 创建一个defs区域来存放可复用的滤镜（必须在使用前创建）
    const defs = svg.append('defs');

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

    // 保存函数到 ref 供其他 useEffect 使用
    yearToSegmentedXRef.current = yearToSegmentedX;
    yScaleRef.current = yScale;

    // 🔧 性能优化：预计算所有节点位置，避免在边渲染时重复计算
    data.nodes.forEach(node => {
      nodePositions.set(node.id, {
        x: yearToSegmentedX(node.era),
        y: yScale(node.x)
      });
    });

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

    // 🔧 性能优化：使用预计算的位置Map，避免O(n)的.find()查找
    // 绘制边（关系）
    const edges = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(data.edges)
      .join('line')
      .attr('x1', d => nodePositions.get(d.source)?.x || 0)
      .attr('y1', d => nodePositions.get(d.source)?.y || 0)
      .attr('x2', d => nodePositions.get(d.target)?.x || 0)
      .attr('y2', d => nodePositions.get(d.target)?.y || 0)
      .attr('stroke', d => getEdgeColor(d.type, false))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0)  // Hidden by default
      .attr('stroke-dasharray', d => {
        return d.type === 'opposes' ? '5,5' : '0';
      });

    edgesSelectionRef.current = edges;

    const effectsLayer = g.append('g').attr('class', 'effects');
    effectsLayerRef.current = effectsLayer;

    // 🔧 性能优化：使用网格索引优化星云计算，从O(n²)降到O(n)
    const clusterRadius = 80; // px - distance to consider "close"
    const nebulae = [];

    // 创建空间网格索引
    const gridSize = clusterRadius;
    const grid = new Map();

    // 首先将所有节点放入网格
    data.nodes.forEach((node, i) => {
      const pos = nodePositions.get(node.id);
      const gridX = Math.floor(pos.x / gridSize);
      const gridY = Math.floor(pos.y / gridSize);
      const key = `${gridX},${gridY}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push({ node, pos, index: i });
    });

    // 然后只检查相邻网格中的节点
    data.nodes.forEach((node, i) => {
      const pos = nodePositions.get(node.id);
      const gridX = Math.floor(pos.x / gridSize);
      const gridY = Math.floor(pos.y / gridSize);

      let nearbyCount = 0;
      let avgColor = { r: 0, g: 0, b: 0 };

      // 只检查周围9个网格
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const key = `${gridX + dx},${gridY + dy}`;
          const cellNodes = grid.get(key) || [];
          for (const other of cellNodes) {
            if (other.index === i) continue;
            const distance = Math.sqrt(
              Math.pow(pos.x - other.pos.x, 2) +
              Math.pow(pos.y - other.pos.y, 2)
            );

            if (distance < clusterRadius) {
              nearbyCount++;
              const color = getNodeColor(other.node);
              const rgb = {
                r: parseInt(color.slice(1,3), 16),
                g: parseInt(color.slice(3,5), 16),
                b: parseInt(color.slice(5,7), 16)
              };
              avgColor.r += rgb.r;
              avgColor.g += rgb.g;
              avgColor.b += rgb.b;
            }
          }
        }
      }

      // If cluster found (3+ nearby nodes), create nebula
      if (nearbyCount >= 3) {
        avgColor.r = Math.floor(avgColor.r / nearbyCount);
        avgColor.g = Math.floor(avgColor.g / nearbyCount);
        avgColor.b = Math.floor(avgColor.b / nearbyCount);

        nebulae.push({
          x: pos.x,
          y: pos.y,
          color: `rgb(${avgColor.r}, ${avgColor.g}, ${avgColor.b})`,
          intensity: Math.min(nearbyCount / 10, 0.3) // Max 30% opacity
        });
      }
    });

    // 🔧 性能优化：预创建可复用的流星渐变，避免内存泄漏
    // Draw shooting stars layer (behind nebulae)
    const shootingStarsLayer = g.insert('g', ':first-child')
      .attr('class', 'shooting-stars');

    // 预创建一个通用的流星尾巴渐变
    const shootingStarGradient = defs.append('linearGradient')
      .attr('id', 'shooting-star-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    shootingStarGradient.selectAll('stop')
      .data([
        { offset: '0%', opacity: 0 },
        { offset: '70%', opacity: 0.3 },
        { offset: '100%', opacity: 0.8 }
      ])
      .join('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', d => d.opacity);

    // 预创建发光滤镜用于流星头部
    const starHeadFilter = defs.append('filter')
      .attr('id', 'star-head-glow')
      .attr('x', '-100%')
      .attr('y', '-100%')
      .attr('width', '300%')
      .attr('height', '300%');
    starHeadFilter.append('feGaussianBlur')
      .attr('stdDeviation', 3)
      .attr('result', 'glow');
    const starMerge = starHeadFilter.append('feMerge');
    starMerge.append('feMergeNode').attr('in', 'glow');
    starMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Function to create a realistic shooting star (bright head + fading tail)
    const createShootingStar = () => {
      const startX = Math.random() * dimensions.width;
      const startY = Math.random() * dimensions.height;

      const angle = Math.random() * Math.PI / 2 + Math.PI / 4;
      const distance = 60 + Math.random() * 90;
      const tailLength = 40 + Math.random() * 30;

      const endX = startX + Math.cos(angle) * distance;
      const endY = startY + Math.sin(angle) * distance;

      // 🔧 使用预创建的渐变，不再动态创建
      const starGroup = shootingStarsLayer.append('g')
        .style('opacity', 0);

      starGroup.append('line')
        .attr('x1', startX - Math.cos(angle) * tailLength)
        .attr('y1', startY - Math.sin(angle) * tailLength)
        .attr('x2', startX)
        .attr('y2', startY)
        .attr('stroke', 'url(#shooting-star-gradient)')
        .attr('stroke-width', 2)
        .attr('stroke-linecap', 'round');

      starGroup.append('circle')
        .attr('cx', startX)
        .attr('cy', startY)
        .attr('r', 2.5)
        .attr('fill', '#ffffff')
        .style('filter', 'url(#star-head-glow)');

      const duration = 1500 + Math.random() * 1000;

      starGroup
        .transition()
        .duration(200)
        .style('opacity', 1)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr('transform', `translate(${endX - startX}, ${endY - startY})`)
        .transition()
        .duration(400)
        .style('opacity', 0)
        .remove();
    };

    // 🔧 性能优化：降低流星创建频率
    const shootingStarInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 降低到30%概率
        createShootingStar();
      }
    }, 4000); // 降低检查频率到4秒

    // Initial shooting stars
    setTimeout(() => createShootingStar(), 1000);
    setTimeout(() => createShootingStar(), 3000);

    const cleanupShootingStars = () => {
      clearInterval(shootingStarInterval);
    };

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

    nodesSelectionRef.current = nodes;

    // 创建不同颜色的发光滤镜（使用之前创建的defs）
    ['philosophy', 'politics', 'both', 'dimmed'].forEach(type => {
      const colors = {
        philosophy: '#8fb4ff',
        politics: '#d48b8b',
        both: '#3fd6b5',
        dimmed: '#666666'
      };
      const filter = defs.append('filter')
        .attr('id', `glow-${type}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', type === 'dimmed' ? 1 : 4)
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // 获取节点对应的滤镜ID
    const getFilterId = (node, isFiltered) => {
      if (!isFiltered) return 'url(#glow-dimmed)';
      const hasPhilosophy = node.domains.includes('philosophy');
      const hasPolitics = node.domains.includes('politics');
      if (hasPhilosophy && hasPolitics) return 'url(#glow-both)';
      if (hasPolitics) return 'url(#glow-politics)';
      return 'url(#glow-philosophy)';
    };

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
      // 🔧 性能优化：使用预定义的SVG滤镜替代动态CSS filter
      .style('filter', d => getFilterId(d, matchesFilter(d)));

    // 🔧 性能优化：使用CSS动画替代D3 transitions进行闪烁效果
    // 添加CSS keyframes动画（只添加一次）
    if (!document.getElementById('twinkle-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'twinkle-animation-styles';
      style.textContent = `
        @keyframes twinkle {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.95; }
        }
        @keyframes twinkle-dim {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.25; }
        }
        .star-node {
          animation: twinkle 3s ease-in-out infinite;
        }
        .star-node-dim {
          animation: twinkle-dim 4s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // 给节点添加CSS类实现闪烁，避免每个节点独立的D3 transition
    nodes.selectAll('circle').each(function(d, i) {
      const circle = d3.select(this);
      // 使用CSS动画，通过animation-delay创建错开效果
      circle
        .classed('star-node', matchesFilter(d))
        .classed('star-node-dim', !matchesFilter(d))
        .style('animation-delay', `${(i % 20) * 0.15}s`);
    });

    // 🔧 性能优化：只对20%的节点应用漂移动画，减少并发transition数量
    const driftNodes = data.nodes.filter((_, i) => i % 5 === 0);
    nodes.filter(d => driftNodes.includes(d)).each(function(d) {
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

    const applyFilterBaseState = (withTransition = false) => {
      const selection = nodes.selectAll('circle');
      const textSelection = nodes.selectAll('text');

      if (withTransition) {
        // Smooth transition when deselecting
        selection
          .interrupt()
          .transition()
          .duration(1200)
          .ease(d3.easeCubicOut)
          .attr('opacity', d => (matchesFilter(d) ? 0.85 : 0.2))
          .attr('stroke', d => (matchesFilter(d) ? '#8a94a8' : 'transparent'))
          .attr('stroke-width', d => (matchesFilter(d) ? 1 : 0))
          .attr('transform', 'scale(1)')
          // 🔧 性能优化：使用预定义的SVG滤镜
          .style('filter', d => getFilterId(d, matchesFilter(d)));

        textSelection
          .interrupt()
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .style('opacity', 0)
          .style('font-weight', '500');
      } else {
        // Immediate update (for filters, etc.)
        selection
          .attr('opacity', d => (matchesFilter(d) ? 0.85 : 0.2))
          .attr('stroke', d => (matchesFilter(d) ? '#8a94a8' : 'transparent'))
          .attr('stroke-width', d => (matchesFilter(d) ? 1 : 0))
          .attr('transform', 'scale(1)')
          // 🔧 性能优化：使用预定义的SVG滤镜
          .style('filter', d => getFilterId(d, matchesFilter(d)));

        textSelection
          .interrupt()
          .style('opacity', 0)
          .style('font-weight', '500');
      }

      // Remove path numbers
      nodes.selectAll('.path-number').remove();

      // Update edges with transition if needed
      const edgeSelection = edges;
      if (withTransition) {
        edgeSelection
          .interrupt() // Stop any ongoing transitions
          .transition()
          .duration(1200)
          .ease(d3.easeCubicOut)
          .attr('stroke', d => getEdgeColor(d.type, false))
          .attr('stroke-width', d => (matchesEdgeFilter(d) ? 1.2 : 1))
          .attr('stroke-opacity', d => {
            if (!filterDomain || filterDomain.length === 0) return 0;
            return matchesEdgeFilter(d) ? 0.25 : 0;
          })
          .attr('marker-end', ''); // Remove arrows
      } else {
        edgeSelection
          .attr('stroke', d => getEdgeColor(d.type, false))
          .attr('stroke-width', d => (matchesEdgeFilter(d) ? 1.2 : 1))
          .attr('stroke-opacity', d => {
            if (!filterDomain || filterDomain.length === 0) return 0;
            return matchesEdgeFilter(d) ? 0.25 : 0;
          })
          .attr('marker-end', ''); // Remove arrows
      }
    };

    applyFilterBaseStateRef.current = applyFilterBaseState;

    // 🔧 性能优化：使用节流的zoom回调，减少极值检查频率
    let lastZoomCheck = 0;
    const ZOOM_CHECK_THROTTLE = 100; // 最多100ms检查一次

    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('start', (event) => {
        svg.style('cursor', 'grabbing');
      })
      .on('zoom', (event) => {
        // 核心transform操作，每帧都需要执行
        g.attr('transform', event.transform);

        // 🔧 节流极值检查，避免每帧都执行判断逻辑
        const now = Date.now();
        if (now - lastZoomCheck < ZOOM_CHECK_THROTTLE) return;
        lastZoomCheck = now;

        const scale = event.transform.k;
        if (scale >= 5 && onZoomExtreme && !zoomExtremeTriggeredRef.current.max) {
          zoomExtremeTriggeredRef.current.max = true;
          zoomExtremeTriggeredRef.current.min = false;
          onZoomExtreme('max');
        } else if (scale <= 0.5 && onZoomExtreme && !zoomExtremeTriggeredRef.current.min) {
          zoomExtremeTriggeredRef.current.min = true;
          zoomExtremeTriggeredRef.current.max = false;
          onZoomExtreme('min');
        } else if (scale > 0.5 && scale < 5) {
          zoomExtremeTriggeredRef.current.max = false;
          zoomExtremeTriggeredRef.current.min = false;
        }
      })
      .on('end', (event) => {
        svg.style('cursor', 'grab');
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
        .duration(1200)
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

    // Function to highlight influence path
    const highlightPath = (pathData) => {
      if (!pathData || !pathData.path) return;

      const pathNodeIds = new Set(pathData.path.map(p => p.nodeId));
      const pathEdgeSet = new Set(
        pathData.edges.map(e => `${e.edge.source}-${e.edge.target}`)
      );

      // 更新节点样式 - 路径节点金色高亮
      nodes.selectAll('circle')
        .attr('opacity', node => {
          if (!matchesFilter(node)) return 0.2;
          if (pathNodeIds.has(node.id)) return 1;
          return 0.15; // 非路径节点更加透明
        })
        .attr('stroke', node => {
          if (!matchesFilter(node)) return 'transparent';
          if (pathNodeIds.has(node.id)) return '#e6c98a'; // 金色
          return 'transparent';
        })
        .attr('stroke-width', node => {
          if (!matchesFilter(node)) return 0;
          if (pathNodeIds.has(node.id)) return 3;
          return 0;
        })
        .attr('transform', node => {
          // 路径节点略微放大
          if (pathNodeIds.has(node.id)) return 'scale(1.3)';
          return 'scale(1)';
        });

      // 显示路径节点标签和序号
      nodes.selectAll('text')
        .interrupt()
        .style('opacity', node => {
          if (!matchesFilter(node)) return 0;
          if (pathNodeIds.has(node.id)) return 1;
          return 0;
        })
        .style('font-weight', node => {
          if (pathNodeIds.has(node.id)) return 'bold';
          return '500';
        });

      // 添加路径序号
      nodes.each(function(node) {
        const pathIndex = pathData.path.findIndex(p => p.nodeId === node.id);
        if (pathIndex >= 0) {
          d3.select(this).selectAll('.path-number').remove();
          d3.select(this).append('text')
            .attr('class', 'path-number')
            .attr('dy', 20)
            .attr('text-anchor', 'middle')
            .style('fill', '#e6c98a')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .style('pointer-events', 'none')
            .text(['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][pathIndex] || (pathIndex + 1));
        }
      });

      // 更新边样式 - 路径边加粗并金色高亮
      edges
        .attr('stroke', edge => {
          const edgeKey = `${edge.source}-${edge.target}`;
          const isInPath = pathEdgeSet.has(edgeKey) || pathEdgeSet.has(`${edge.target}-${edge.source}`);
          if (isInPath) return '#e6c98a'; // 金色
          return getEdgeColor(edge.type, false);
        })
        .attr('stroke-width', edge => {
          const edgeKey = `${edge.source}-${edge.target}`;
          const isInPath = pathEdgeSet.has(edgeKey) || pathEdgeSet.has(`${edge.target}-${edge.source}`);
          return isInPath ? 4 : 1.5;
        })
        .attr('stroke-opacity', edge => {
          const edgeKey = `${edge.source}-${edge.target}`;
          const isInPath = pathEdgeSet.has(edgeKey) || pathEdgeSet.has(`${edge.target}-${edge.source}`);
          if (isInPath) return 1.0;
          if (!matchesEdgeFilter(edge)) return 0;
          return 0.05; // 非路径边几乎透明
        })
        .attr('marker-end', edge => {
          const edgeKey = `${edge.source}-${edge.target}`;
          const isInPath = pathEdgeSet.has(edgeKey) || pathEdgeSet.has(`${edge.target}-${edge.source}`);
          return isInPath ? 'url(#arrowhead)' : '';
        });

      // 添加箭头标记定义
      if (!svg.select('#arrowhead').node()) {
        svg.append('defs').append('marker')
          .attr('id', 'arrowhead')
          .attr('markerWidth', 10)
          .attr('markerHeight', 10)
          .attr('refX', 9)
          .attr('refY', 3)
          .attr('orient', 'auto')
          .append('polygon')
          .attr('points', '0 0, 10 3, 0 6')
          .style('fill', '#e6c98a');
      }
    };

    highlightPathRef.current = highlightPath;

    // 核心交互：点击节点高亮关联
    nodes.on('click', function(event, d) {
      if (!matchesFilter(d)) return;
      event.stopPropagation();

      // 路径模式下的点击处理
      if (pathMode) {
        onPathNodeSelect?.(d);
        spawnDiscoveryPulse(d);
        return;
      }

      // 正常模式
      onNodeSelect(d);
      highlightNode(d, this);
      spawnDiscoveryPulse(d);
      focusOnNode(d);
    });

    // Handle external selection (e.g., from search) - only in non-path mode
    if (!pathMode && externalSelectedNode && matchesFilter(externalSelectedNode)) {
      highlightNode(externalSelectedNode);
      spawnDiscoveryPulse(externalSelectedNode);
      focusOnNode(externalSelectedNode);
    }

    // 点击画布空白处取消选择
    svg.on('click', function() {
      // Start visual transitions first
      applyFilterBaseState(true);
      resetFocus();

      // Then notify React (to avoid interrupting transitions)
      setTimeout(() => {
        onNodeSelect(null);
      }, 0);
    });

    // 🔧 性能优化：悬停效果使用预定义的SVG滤镜
    // 创建悬停用的增强发光滤镜
    ['philosophy', 'politics', 'both'].forEach(type => {
      const colors = {
        philosophy: '#8fb4ff',
        politics: '#d48b8b',
        both: '#3fd6b5'
      };
      const filter = defs.append('filter')
        .attr('id', `glow-hover-${type}`)
        .attr('x', '-100%')
        .attr('y', '-100%')
        .attr('width', '300%')
        .attr('height', '300%');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', 8) // 更强的模糊
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // 获取悬停状态的滤镜ID
    const getHoverFilterId = (node) => {
      const hasPhilosophy = node.domains.includes('philosophy');
      const hasPolitics = node.domains.includes('politics');
      if (hasPhilosophy && hasPolitics) return 'url(#glow-hover-both)';
      if (hasPolitics) return 'url(#glow-hover-politics)';
      return 'url(#glow-hover-philosophy)';
    };

    // 悬停效果 - Enhanced for starfield
    nodes.on('mouseenter', function(event, d) {
      if (externalSelectedNode) return;
      if (!matchesFilter(d)) return;

      // Enlarge node and apply hover glow
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('transform', 'scale(1.3)')
        .style('filter', getHoverFilterId(d));

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

      // Restore node size and normal glow
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('transform', 'scale(1)')
        .style('filter', getFilterId(d, matchesFilter(d)));

      // Hide label with smooth fade-out
      d3.select(this).select('text')
        .transition()
        .duration(300)
        .style('opacity', 0)
        .style('font-weight', '500');
    });

    // Cleanup function for shooting stars
    return () => {
      cleanupShootingStars();
    };
  }, [data, dimensions, externalSelectedNode, language, filterDomain, pathMode, pathStart, pathEnd, pathResult]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.BACKGROUND,
      overflow: 'hidden'
    }}>
      <svg
        ref={svgRef}
        style={{
          display: 'block',
          cursor: 'grab'
        }}
      />
    </div>
  );
}
