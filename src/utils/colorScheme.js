/**
 * 颜色编码系统
 * 蓝色 = 哲学
 * 红色 = 政治
 * 紫色 = 哲学+政治交叉
 */

export const COLORS = {
  PHILOSOPHY: '#8fb4ff',  // 蓝色
  POLITICS: '#d48b8b',     // 红色
  BOTH: '#3fd6b5',         // 青绿色
  EDGE_DEFAULT: '#5e6a7d', // 边的默认颜色
  EDGE_HIGHLIGHT: '#9d78f7', // 边的高亮颜色
  EDGE_OPPOSE: '#c084fc',  // 对立关系的边 — 较浅紫色，虚线已表示对立
  BACKGROUND: '#07060f',   // 深色背景
  TEXT: '#ffffff'          // 文字颜色
};

/**
 * 根据概念的领域确定颜色
 */
export function getNodeColor(concept) {
  const hasPolitics = concept.domains.includes('politics');
  const hasPhilosophy = concept.domains.includes('philosophy');

  if (hasPolitics && hasPhilosophy) {
    return COLORS.BOTH; // 紫色 - 交叉
  } else if (hasPolitics) {
    return COLORS.POLITICS; // 红色 - 政治
  } else {
    return COLORS.PHILOSOPHY; // 蓝色 - 哲学
  }
}

/**
 * 根据关系类型确定边的颜色
 */
export function getEdgeColor(relationType, isHighlighted = false) {
  if (!isHighlighted) {
    return COLORS.EDGE_DEFAULT;
  }

  if (relationType === 'opposes' || relationType === 'opposed_by') {
    return COLORS.EDGE_OPPOSE;
  }

  return COLORS.EDGE_HIGHLIGHT;
}

/**
 * 获取节点在不同状态下的样式
 */
export function getNodeStyle(isSelected, isConnected, isDimmed) {
  if (isDimmed) {
    return {
      opacity: 0.2,
      strokeWidth: 0
    };
  }

  if (isSelected) {
    return {
      opacity: 1,
      strokeWidth: 3,
      strokeColor: '#9d78f7' // 选中节点边框
    };
  }

  if (isConnected) {
    return {
      opacity: 1,
      strokeWidth: 2,
      strokeColor: '#ffffff'
    };
  }

  return {
    opacity: 0.8,
    strokeWidth: 1,
    strokeColor: '#ffffff'
  };
}
