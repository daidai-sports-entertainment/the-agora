import { useState, useEffect } from 'react';

/**
 * 加载和处理图数据的 Hook
 */
export function useGraphData() {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 加载位置数据
        const positionsRes = await fetch('/src/data/concept_positions_final.json');
        const positions = await positionsRes.json();

        // 加载完整数据（包含关系）
        const conceptsRes = await fetch('/src/data/ideology_dataset_comprehensive.json');
        const concepts = await conceptsRes.json();

        // 创建ID到概念的映射
        const conceptMap = new Map(concepts.map(c => [c.id, c]));

        // 合并数据：位置 + 完整信息
        const nodes = positions.map(pos => {
          const concept = conceptMap.get(pos.id);
          return {
            id: pos.id,
            name: pos.name,
            x: pos.x,  // 时间（era）
            y: pos.y,  // 语义相似度
            era: pos.era,
            domains: pos.domains,
            description: concept?.description || '',
            key_figures: concept?.key_figures || [],
            relationships: concept?.relationships || []
          };
        });

        // 构建边（关系）
        const edges = [];
        nodes.forEach(node => {
          node.relationships.forEach(rel => {
            // 检查目标节点是否存在
            const targetNode = nodes.find(n => n.id === rel.target);
            if (targetNode) {
              edges.push({
                source: node.id,
                target: rel.target,
                type: rel.type,
                description: rel.description || ''
              });
            }
          });
        });

        setData({ nodes, edges });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { data, loading, error };
}
