/**
 * 路径搜索工具（增强版）
 * 使用BFS算法找到两个概念之间语义一致的影响路径
 * 支持关系分层、路径评分、质量过滤
 */

import {
  getRelationDirection,
  getRelationLayer,
  getRelationWeight,
  areLayersCompatible,
  reverseRelationType,
  RELATION_LAYERS
} from './relationOntology';

/**
 * 构建图的邻接表（考虑关系方向和时间约束）
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @returns {Map<string, Array>} 邻接表：nodeId => [{targetId, type, description, originalEdge}]
 */
function buildAdjacencyList(nodes, edges) {
  const adjacencyList = new Map();

  // 构建节点ID到节点的映射，方便查询era信息
  const nodeById = new Map();
  nodes.forEach(node => {
    nodeById.set(node.id, node);
    adjacencyList.set(node.id, []);
  });

  // 添加边（考虑方向和时间约束）
  edges.forEach(edge => {
    const direction = getRelationDirection(edge.type);
    const layer = getRelationLayer(edge.type);
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);

    // 如果节点不存在，跳过该边
    if (!sourceNode || !targetNode) {
      return;
    }

    // 时间容差：允许50年以内的误差（处理同时期的思想和数据误差）
    const TIME_TOLERANCE = 50;

    // 判断是否需要时间约束
    // 只对谱系链（Genealogical）和部分意识形态链（Ideological）的关系进行严格时间检查
    // 说明性关系（如 similar_to）不需要时间约束
    const needsTimeConstraint = layer === RELATION_LAYERS.GENEALOGICAL;

    if (direction === 'forward' || direction === 'bidirectional') {
      // 正向：source -> target
      let canAdd = true;

      // 如果需要时间约束且两个节点都有era信息，检查时间方向
      if (needsTimeConstraint && sourceNode.era !== undefined && targetNode.era !== undefined) {
        // 时间约束：target.era 必须 >= source.era（影响只能从早到晚传播）
        canAdd = targetNode.era >= sourceNode.era - TIME_TOLERANCE;
      }

      if (canAdd) {
        adjacencyList.get(edge.source).push({
          targetId: edge.target,
          type: edge.type,
          description: edge.description,
          originalEdge: edge
        });
      }
    }

    if (direction === 'backward' || direction === 'bidirectional') {
      // 反向：target -> source
      let canAdd = true;

      // 如果需要时间约束且两个节点都有era信息，检查时间方向
      if (needsTimeConstraint && sourceNode.era !== undefined && targetNode.era !== undefined) {
        // 时间约束：source.era 必须 >= target.era（反向遍历时，实际影响方向是 target -> source）
        canAdd = sourceNode.era >= targetNode.era - TIME_TOLERANCE;
      }

      if (canAdd) {
        adjacencyList.get(edge.target).push({
          targetId: edge.source,
          type: edge.type,
          description: edge.description,
          originalEdge: edge,
          isReversed: direction === 'backward' // 标记这是反向遍历
        });
      }
    }
  });

  return adjacencyList;
}

/**
 * 将路径规范化为历史因果顺序（从早期思想到晚期思想）
 * 这确保路径始终展示正确的历史因果链，而不是时间倒置的关系
 *
 * @param {Object} pathResult - 路径对象 {path, edges, length}
 * @returns {Object} 规范化后的路径对象
 *
 * @example
 * // 输入: Secularism (1750) → Enlightenment (1700) [emerged_from]
 * // 输出: Enlightenment (1700) → Secularism (1750) [gave_rise_to]
 */
function normalizePathToChronological(pathResult) {
  if (!pathResult || !pathResult.path || pathResult.path.length === 0) {
    return pathResult;
  }

  // 如果路径只有一个节点，无需规范化
  if (pathResult.path.length === 1) {
    return pathResult;
  }

  const startEra = pathResult.path[0].node?.era;
  const endEra = pathResult.path[pathResult.path.length - 1].node?.era;

  // 如果缺少era信息，返回原路径（无法判断时间方向）
  if (startEra === undefined || endEra === undefined) {
    return pathResult;
  }

  // 如果路径已经是正序（从早到晚），直接返回
  if (startEra <= endEra) {
    return pathResult;
  }

  // 路径是时间逆序的，需要反转
  console.log(`[Path Normalization] Reversing path from ${startEra} → ${endEra} to chronological order`);

  // 注意：使用 [...array].reverse() 避免修改原数组
  return {
    path: [...pathResult.path].reverse(),
    edges: [...pathResult.edges].reverse().map(edgeInfo => ({
      ...edgeInfo,
      type: reverseRelationType(edgeInfo.type),  // 转换关系标签
      isReversed: !edgeInfo.isReversed  // 切换反转标记
    })),
    length: pathResult.length
  };
}

/**
 * 使用BFS查找最短路径
 * @param {string} startId - 起点节点ID
 * @param {string} endId - 终点节点ID
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @returns {Object|null} 路径对象或null（如果没有路径）
 * {
 *   path: [{nodeId, node}],          // 路径上的节点
 *   edges: [{edge, type, description}], // 路径上的边
 *   length: number                    // 路径长度（边的数量）
 * }
 */
export function findShortestPath(startId, endId, nodes, edges) {
  // 边界检查
  if (!startId || !endId) {
    return null;
  }

  if (startId === endId) {
    const node = nodes.find(n => n.id === startId);
    return {
      path: [{ nodeId: startId, node }],
      edges: [],
      length: 0
    };
  }

  // 检查节点是否存在
  const startNode = nodes.find(n => n.id === startId);
  const endNode = nodes.find(n => n.id === endId);

  if (!startNode || !endNode) {
    return null;
  }

  // 构建邻接表
  const adjacencyList = buildAdjacencyList(nodes, edges);

  // BFS队列：{nodeId, path, edgePath}
  const queue = [{
    nodeId: startId,
    path: [startId],
    edgePath: []
  }];

  const visited = new Set([startId]);

  while (queue.length > 0) {
    const { nodeId, path, edgePath } = queue.shift();

    // 获取邻居
    const neighbors = adjacencyList.get(nodeId) || [];

    for (const neighbor of neighbors) {
      const { targetId, type, description, originalEdge, isReversed } = neighbor;

      // 如果到达终点
      if (targetId === endId) {
        const finalPath = [...path, targetId];
        const finalEdgePath = [
          ...edgePath,
          {
            edge: originalEdge,
            type,
            description,
            isReversed
          }
        ];

        // 构建返回对象
        const pathResult = {
          path: finalPath.map(nodeId => ({
            nodeId,
            node: nodes.find(n => n.id === nodeId)
          })),
          edges: finalEdgePath,
          length: finalEdgePath.length
        };

        // 规范化路径为历史因果顺序（从早到晚）
        return normalizePathToChronological(pathResult);
      }

      // 如果未访问过，加入队列
      if (!visited.has(targetId)) {
        visited.add(targetId);
        queue.push({
          nodeId: targetId,
          path: [...path, targetId],
          edgePath: [
            ...edgePath,
            {
              edge: originalEdge,
              type,
              description,
              isReversed
            }
          ]
        });
      }
    }
  }

  // 没有找到路径
  return null;
}

/**
 * 查找所有路径（限制深度，避免性能问题）
 * @param {string} startId - 起点节点ID
 * @param {string} endId - 终点节点ID
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @param {number} maxDepth - 最大搜索深度（默认5）
 * @returns {Array} 路径数组，按长度排序
 */
export function findAllPaths(startId, endId, nodes, edges, maxDepth = 5) {
  if (!startId || !endId || startId === endId) {
    return [];
  }

  const adjacencyList = buildAdjacencyList(nodes, edges);
  const allPaths = [];

  function dfs(currentId, path, edgePath, visited) {
    if (path.length > maxDepth) {
      return; // 超过最大深度
    }

    if (currentId === endId) {
      allPaths.push({
        path: path.map(nodeId => ({
          nodeId,
          node: nodes.find(n => n.id === nodeId)
        })),
        edges: edgePath,
        length: edgePath.length
      });
      return;
    }

    const neighbors = adjacencyList.get(currentId) || [];

    for (const neighbor of neighbors) {
      const { targetId, type, description, originalEdge, isReversed } = neighbor;

      if (!visited.has(targetId)) {
        visited.add(targetId);
        dfs(
          targetId,
          [...path, targetId],
          [
            ...edgePath,
            { edge: originalEdge, type, description, isReversed }
          ],
          visited
        );
        visited.delete(targetId);
      }
    }
  }

  const visited = new Set([startId]);
  dfs(startId, [startId], [], visited);

  // 按路径长度排序
  return allPaths.sort((a, b) => a.length - b.length);
}

/**
 * 检查两个节点是否直接相连
 * @param {string} node1Id - 节点1 ID
 * @param {string} node2Id - 节点2 ID
 * @param {Array} edges - 边数组
 * @returns {Object|null} 如果直接相连返回边信息，否则返回null
 */
export function findDirectConnection(node1Id, node2Id, edges) {
  // 查找直接连接
  const directEdge = edges.find(
    edge =>
      (edge.source === node1Id && edge.target === node2Id) ||
      (edge.source === node2Id && edge.target === node1Id)
  );

  if (directEdge) {
    return {
      edge: directEdge,
      type: directEdge.type,
      description: directEdge.description,
      isReversed: directEdge.source === node2Id
    };
  }

  return null;
}

/**
 * 格式化路径为可读字符串
 * @param {Object} pathResult - findShortestPath的返回结果
 * @returns {string} 格式化的路径字符串
 */
export function formatPathString(pathResult) {
  if (!pathResult || pathResult.length === 0) {
    return '';
  }

  const names = pathResult.path.map(p => p.node?.name || p.nodeId);
  return names.join(' → ');
}

/**
 * 计算路径质量分数
 * @param {Object} pathResult - 路径对象
 * @returns {Object} 包含score, type, warnings的对象
 */
export function calculatePathQuality(pathResult) {
  if (!pathResult || !pathResult.edges || pathResult.edges.length === 0) {
    return { score: 0, type: 'none', warnings: [] };
  }

  let score = 100;
  const warnings = [];

  // 1. 长度惩罚：每多一步扣10分
  const lengthPenalty = (pathResult.length - 1) * 10;
  score -= lengthPenalty;

  // 2. 层级一致性检查
  const layers = pathResult.edges.map(e => getRelationLayer(e.type));
  const uniqueLayers = new Set(layers);

  let pathType = 'mixed';

  if (uniqueLayers.size === 1) {
    // 同层路径 - 最可信
    pathType = layers[0];
  } else {
    // 跨层路径 - 检查是否允许
    score -= 20;
    warnings.push('cross_layer');

    // 检查层级兼容性
    for (let i = 0; i < layers.length - 1; i++) {
      if (!areLayersCompatible(layers[i], layers[i + 1])) {
        score -= 15;
        warnings.push('incompatible_layers');
        break;
      }
    }

    // 判断主导层级
    const layerCounts = {};
    layers.forEach(l => {
      layerCounts[l] = (layerCounts[l] || 0) + 1;
    });
    pathType = Object.keys(layerCounts).reduce((a, b) =>
      layerCounts[a] > layerCounts[b] ? a : b
    );
  }

  // 3. 关系权重加权
  const avgWeight = pathResult.edges.reduce((sum, e) =>
    sum + getRelationWeight(e.type), 0) / pathResult.edges.length;
  score *= avgWeight;

  // 4. 时间连续性检查
  if (pathResult.path && pathResult.path.length >= 2) {
    const startEra = pathResult.path[0].node?.era;
    const endEra = pathResult.path[pathResult.path.length - 1].node?.era;

    if (startEra !== undefined && endEra !== undefined) {
      const timeDiff = Math.abs(endEra - startEra);

      // 时间跨度小于500年加分
      if (timeDiff < 500) {
        score += 10;
      }

      // 时间跨度超过1500年警告
      if (timeDiff > 1500) {
        warnings.push('large_time_span');
      }

      // 检查时间逆向（未来影响过去）
      let hasTimeReversal = false;
      for (let i = 0; i < pathResult.path.length - 1; i++) {
        const current = pathResult.path[i].node?.era;
        const next = pathResult.path[i + 1].node?.era;
        if (current !== undefined && next !== undefined && next < current - 100) {
          hasTimeReversal = true;
          break;
        }
      }

      if (hasTimeReversal) {
        score -= 20;
        warnings.push('time_reversal');
      }
    }
  }

  // 5. 路径过长警告
  if (pathResult.length > 4) {
    warnings.push('path_too_long');
    score -= (pathResult.length - 4) * 15;
  }

  // 确保分数在0-100范围内
  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    type: pathType,
    warnings,
    avgWeight: Math.round(avgWeight * 100) / 100
  };
}

/**
 * 生成路径警告信息
 * @param {Array} warnings - 警告代码数组
 * @param {string} language - 语言
 * @returns {Array} 警告信息数组
 */
export function generateWarnings(warnings, language = 'en') {
  const warningMessages = {
    cross_layer: {
      en: 'This path crosses different relation types (genealogical, ideological, illustrative).',
      zh: '此路径跨越了不同类型的关系（谱系、意识形态、说明性）。'
    },
    incompatible_layers: {
      en: 'Some relations in this path are semantically incompatible.',
      zh: '此路径中的某些关系在语义上不兼容。'
    },
    large_time_span: {
      en: 'This path spans more than 1500 years, which may indicate weak connections.',
      zh: '此路径跨越超过1500年，可能表明联系较弱。'
    },
    time_reversal: {
      en: 'This path includes anachronistic connections (later ideas "influencing" earlier ones).',
      zh: '此路径包含时间倒置的连接（后来的思想"影响"早期的思想）。'
    },
    path_too_long: {
      en: 'This path is longer than 4 steps, which reduces semantic coherence.',
      zh: '此路径长度超过4步，这会降低语义连贯性。'
    }
  };

  return warnings.map(w =>
    warningMessages[w]?.[language] || w
  );
}

/**
 * 增强版路径搜索：支持层级过滤和质量评分
 * @param {string} startId - 起点节点ID
 * @param {string} endId - 终点节点ID
 * @param {Array} nodes - 节点数组
 * @param {Array} edges - 边数组
 * @param {Object} options - 选项
 * @returns {Object|null} 包含路径和质量信息的对象
 */
export function findSemanticPath(startId, endId, nodes, edges, options = {}) {
  const {
    preferredLayer = null,    // 优先层级
    maxLength = 4,             // 最大长度
    minScore = 40              // 最小可信度
  } = options;

  // 先尝试找到基本路径
  const basicPath = findShortestPath(startId, endId, nodes, edges);

  if (!basicPath) {
    return null;
  }

  // 计算路径质量
  const quality = calculatePathQuality(basicPath);

  // 过滤低质量路径
  if (quality.score < minScore || basicPath.length > maxLength) {
    return null;
  }

  // 返回增强的路径对象
  return {
    ...basicPath,
    quality
  };
}
