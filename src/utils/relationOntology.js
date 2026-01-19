/**
 * 关系本体系统 (Relation Ontology)
 * 定义思想关系的层级分类，用于构建语义一致的影响路径
 */

/**
 * 关系层级定义
 */
export const RELATION_LAYERS = {
  GENEALOGICAL: 'genealogical',    // 谱系链：思想生成关系
  IDEOLOGICAL: 'ideological',      // 意识形态链：立场关系
  ILLUSTRATIVE: 'illustrative'     // 说明链：举例/相似关系
};

/**
 * 完整的关系类型本体
 * 每个关系包含：层级、权重、方向、语义描述
 */
export const RELATION_ONTOLOGY = {
  // ============ Genealogical Layer (谱系链) ============
  // 这些关系表示思想的生成、演化、继承关系

  'influenced_by': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 1.0,
    direction: 'backward',
    semanticRole: 'intellectual_influence',
    description: 'A was intellectually influenced by B',
    zhDescription: 'A受到B的思想影响'
  },

  'influenced': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 1.0,
    direction: 'forward',
    semanticRole: 'intellectual_influence',
    description: 'A influenced B intellectually',
    zhDescription: 'A影响了B的思想'
  },

  'evolved_from': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.95,
    direction: 'backward',
    semanticRole: 'evolutionary_development',
    description: 'A evolved from B',
    zhDescription: 'A从B演化而来'
  },

  'evolved_into': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.95,
    direction: 'forward',
    semanticRole: 'evolutionary_development',
    description: 'A evolved into B',
    zhDescription: 'A演化成B'
  },

  'founded_on': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.9,
    direction: 'backward',
    semanticRole: 'theoretical_foundation',
    description: 'A is founded on B',
    zhDescription: 'A建立在B的基础上'
  },

  'foundation_for': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.9,
    direction: 'forward',
    semanticRole: 'theoretical_foundation',
    description: 'A is the foundation for B',
    zhDescription: 'A是B的理论基础'
  },

  'built_on': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.85,
    direction: 'backward',
    semanticRole: 'incremental_building',
    description: 'A is built on B',
    zhDescription: 'A建立在B之上'
  },

  'derived_from': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.85,
    direction: 'backward',
    semanticRole: 'derivation',
    description: 'A is derived from B',
    zhDescription: 'A源自B'
  },

  'developed': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.8,
    direction: 'forward',
    semanticRole: 'development',
    description: 'A developed B',
    zhDescription: 'A发展了B'
  },

  'based_on': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.8,
    direction: 'backward',
    semanticRole: 'theoretical_basis',
    description: 'A is based on B',
    zhDescription: 'A基于B'
  },

  'led_to': {
    layer: RELATION_LAYERS.GENEALOGICAL,
    weight: 0.75,
    direction: 'forward',
    semanticRole: 'causal_progression',
    description: 'A led to B',
    zhDescription: 'A导致了B的出现'
  },

  // ============ Ideological Layer (意识形态链) ============
  // 这些关系表示思想之间的立场、批判、对抗关系

  'opposes': {
    layer: RELATION_LAYERS.IDEOLOGICAL,
    weight: 0.7,
    direction: 'bidirectional',
    semanticRole: 'political_opposition',
    description: 'A opposes B',
    zhDescription: 'A反对B'
  },

  'critiques': {
    layer: RELATION_LAYERS.IDEOLOGICAL,
    weight: 0.75,
    direction: 'forward',
    semanticRole: 'critical_analysis',
    description: 'A critiques B',
    zhDescription: 'A批判B'
  },

  'reacts_against': {
    layer: RELATION_LAYERS.IDEOLOGICAL,
    weight: 0.7,
    direction: 'forward',
    semanticRole: 'reactive_stance',
    description: 'A reacts against B',
    zhDescription: 'A是对B的反应'
  },

  'contrasts_with': {
    layer: RELATION_LAYERS.IDEOLOGICAL,
    weight: 0.65,
    direction: 'bidirectional',
    semanticRole: 'ideological_contrast',
    description: 'A contrasts with B',
    zhDescription: 'A与B形成对比'
  },

  'rejects': {
    layer: RELATION_LAYERS.IDEOLOGICAL,
    weight: 0.7,
    direction: 'forward',
    semanticRole: 'rejection',
    description: 'A rejects B',
    zhDescription: 'A拒绝B'
  },

  'challenges': {
    layer: RELATION_LAYERS.IDEOLOGICAL,
    weight: 0.65,
    direction: 'forward',
    semanticRole: 'intellectual_challenge',
    description: 'A challenges B',
    zhDescription: 'A挑战B'
  },

  // ============ Illustrative Layer (说明链) ============
  // 这些关系表示概念之间的相似、举例、综合关系

  'similar_to': {
    layer: RELATION_LAYERS.ILLUSTRATIVE,
    weight: 0.5,
    direction: 'bidirectional',
    semanticRole: 'similarity',
    description: 'A is similar to B',
    zhDescription: 'A与B相似'
  },

  'exemplified_by': {
    layer: RELATION_LAYERS.ILLUSTRATIVE,
    weight: 0.45,
    direction: 'forward',
    semanticRole: 'exemplification',
    description: 'A is exemplified by B',
    zhDescription: 'A以B为例'
  },

  'related_to': {
    layer: RELATION_LAYERS.ILLUSTRATIVE,
    weight: 0.4,
    direction: 'bidirectional',
    semanticRole: 'general_relation',
    description: 'A is related to B',
    zhDescription: 'A与B相关'
  },

  'synthesized_with': {
    layer: RELATION_LAYERS.ILLUSTRATIVE,
    weight: 0.6,
    direction: 'bidirectional',
    semanticRole: 'synthesis',
    description: 'A is synthesized with B',
    zhDescription: 'A与B综合'
  },

  'parallels': {
    layer: RELATION_LAYERS.ILLUSTRATIVE,
    weight: 0.5,
    direction: 'bidirectional',
    semanticRole: 'parallel_development',
    description: 'A parallels B',
    zhDescription: 'A与B平行发展'
  },

  'resonates_with': {
    layer: RELATION_LAYERS.ILLUSTRATIVE,
    weight: 0.45,
    direction: 'bidirectional',
    semanticRole: 'thematic_resonance',
    description: 'A resonates with B',
    zhDescription: 'A与B产生共鸣'
  }
};

/**
 * 获取关系的层级
 * @param {string} relationType - 关系类型
 * @returns {string} 层级名称
 */
export function getRelationLayer(relationType) {
  const relation = RELATION_ONTOLOGY[relationType];
  return relation ? relation.layer : RELATION_LAYERS.ILLUSTRATIVE; // 默认为说明层
}

/**
 * 获取关系的权重
 * @param {string} relationType - 关系类型
 * @returns {number} 权重值 (0-1)
 */
export function getRelationWeight(relationType) {
  const relation = RELATION_ONTOLOGY[relationType];
  return relation ? relation.weight : 0.3; // 默认低权重
}

/**
 * 获取关系的方向
 * @param {string} relationType - 关系类型
 * @returns {'forward'|'backward'|'bidirectional'} 方向
 */
export function getRelationDirection(relationType) {
  const relation = RELATION_ONTOLOGY[relationType];
  return relation ? relation.direction : 'forward';
}

/**
 * 获取关系的完整信息
 * @param {string} relationType - 关系类型
 * @param {string} language - 语言 ('en' | 'zh')
 * @returns {Object} 关系信息
 */
export function getRelationInfo(relationType, language = 'en') {
  const relation = RELATION_ONTOLOGY[relationType];
  if (!relation) {
    return {
      layer: RELATION_LAYERS.ILLUSTRATIVE,
      weight: 0.3,
      direction: 'forward',
      description: language === 'zh' ? '未知关系' : 'Unknown relation'
    };
  }

  return {
    ...relation,
    description: language === 'zh' ? relation.zhDescription : relation.description
  };
}

/**
 * 判断两个层级是否兼容（可以在同一路径中）
 * @param {string} layer1 - 第一个层级
 * @param {string} layer2 - 第二个层级
 * @returns {boolean} 是否兼容
 */
export function areLayersCompatible(layer1, layer2) {
  // 同层总是兼容
  if (layer1 === layer2) return true;

  // Genealogical → Ideological 允许（继承后反对）
  if (layer1 === RELATION_LAYERS.GENEALOGICAL &&
      layer2 === RELATION_LAYERS.IDEOLOGICAL) {
    return true;
  }

  // 其他跨层组合不允许
  return false;
}

/**
 * 获取层级的显示名称
 * @param {string} layer - 层级
 * @param {string} language - 语言
 * @returns {string} 显示名称
 */
export function getLayerDisplayName(layer, language = 'en') {
  const names = {
    [RELATION_LAYERS.GENEALOGICAL]: {
      en: 'Genealogical Chain',
      zh: '谱系链'
    },
    [RELATION_LAYERS.IDEOLOGICAL]: {
      en: 'Ideological Opposition',
      zh: '意识形态对立'
    },
    [RELATION_LAYERS.ILLUSTRATIVE]: {
      en: 'Illustrative Connection',
      zh: '说明性关联'
    }
  };

  return names[layer]?.[language] || layer;
}

/**
 * 获取层级的图标
 * @param {string} layer - 层级
 * @returns {string} emoji图标
 */
export function getLayerIcon(layer) {
  const icons = {
    [RELATION_LAYERS.GENEALOGICAL]: '📜',
    [RELATION_LAYERS.IDEOLOGICAL]: '⚔️',
    [RELATION_LAYERS.ILLUSTRATIVE]: '🔗'
  };

  return icons[layer] || '•';
}

/**
 * 获取所有谱系层关系类型
 * @returns {string[]} 关系类型数组
 */
export function getGenealogicalRelations() {
  return Object.keys(RELATION_ONTOLOGY).filter(
    type => RELATION_ONTOLOGY[type].layer === RELATION_LAYERS.GENEALOGICAL
  );
}

/**
 * 获取所有意识形态层关系类型
 * @returns {string[]} 关系类型数组
 */
export function getIdeologicalRelations() {
  return Object.keys(RELATION_ONTOLOGY).filter(
    type => RELATION_ONTOLOGY[type].layer === RELATION_LAYERS.IDEOLOGICAL
  );
}

/**
 * 获取所有说明层关系类型
 * @returns {string[]} 关系类型数组
 */
export function getIllustrativeRelations() {
  return Object.keys(RELATION_ONTOLOGY).filter(
    type => RELATION_ONTOLOGY[type].layer === RELATION_LAYERS.ILLUSTRATIVE
  );
}

/**
 * 反向关系映射表
 * 用于路径规范化：当路径需要反转时，将关系类型转换为其反向形式
 * 基于实际数据中的69种关系类型构建
 */
export const RELATION_REVERSE_MAP = {
  // 谱系链关系对 (Genealogical pairs)
  'influenced_by': 'influenced',
  'influenced': 'influenced_by',
  'evolved_from': 'evolved_into',
  'evolved_into': 'evolved_from',
  'emerged_from': 'gave_rise_to',
  'gave_rise_to': 'emerged_from',
  'founded_on': 'foundation_for',
  'foundation_for': 'founded_on',
  'founded_by': 'founded',
  'founded': 'founded_by',
  'foundation_of': 'had_foundation_in',
  'had_foundation_in': 'foundation_of',
  'built_on': 'provided_foundation_for',
  'provided_foundation_for': 'built_on',
  'based_on': 'provides_basis_for',
  'provides_basis_for': 'based_on',
  'derived_from': 'derived_into',
  'derived_into': 'derived_from',
  'developed': 'developed_from',
  'developed_from': 'developed',
  'led_to': 'was_led_from',
  'was_led_from': 'led_to',
  'preceded': 'succeeded',
  'succeeded': 'preceded',
  'anticipated': 'was_anticipated_by',
  'was_anticipated_by': 'anticipated',
  'preserved_and_developed': 'was_preserved_by',
  'was_preserved_by': 'preserved_and_developed',

  // 意识形态链关系对 (Ideological pairs)
  'opposes': 'opposed_by',
  'opposed_by': 'opposes',
  'critiques': 'critiqued_by',
  'critiqued_by': 'critiques',
  'critiqued': 'was_critiqued_by',
  'was_critiqued_by': 'critiqued',
  'challenges': 'challenged_by',
  'challenged_by': 'challenges',
  'challenged': 'was_challenged_by',
  'was_challenged_by': 'challenged',
  'reacts_against': 'provoked_reaction_in',
  'provoked_reaction_in': 'reacts_against',
  'reacted_against': 'provoked',
  'provoked': 'reacted_against',
  'responded_to_by': 'responds_to',
  'responds_to': 'responded_to_by',
  'rejects': 'rejected_by',
  'rejected_by': 'rejects',
  'contrasts_with': 'contrasts_with',  // 对称关系
  'conflicts_with': 'conflicts_with',  // 对称关系
  'tensions_with': 'tensions_with',  // 对称关系
  'skeptical_of': 'viewed_skeptically_by',
  'viewed_skeptically_by': 'skeptical_of',

  // 形式/类型关系 (Form/Type relationships)
  'form_of': 'has_form',
  'has_form': 'form_of',
  'early_form': 'later_became',
  'later_became': 'early_form',
  'radical_form': 'has_radical_version',
  'has_radical_version': 'radical_form',
  'moderate_form': 'has_moderate_version',
  'has_moderate_version': 'moderate_form',
  'extreme_form': 'has_extreme_version',
  'has_extreme_version': 'extreme_form',
  'modern_form': 'has_modern_version',
  'has_modern_version': 'modern_form',
  'variant_of': 'has_variant',
  'has_variant': 'variant_of',
  'revival_of': 'was_revived_as',
  'was_revived_as': 'revival_of',
  'diverged_from': 'split_into',
  'split_into': 'diverged_from',
  'radicalized_into': 'moderate_version_was',
  'moderate_version_was': 'radicalized_into',

  // 综合/整合关系 (Synthesis/Integration)
  'synthesized_with': 'synthesized_with',  // 对称关系
  'synthesizes_with': 'synthesizes_with',  // 对称关系
  'integrated_into': 'integrated',
  'integrated': 'integrated_into',
  'incorporated_into': 'incorporated',
  'incorporated': 'incorporated_into',

  // 相似/关联关系 (Similarity/Association)
  'similar_to': 'similar_to',  // 对称关系
  'related_to': 'related_to',  // 对称关系
  'closely_related': 'closely_related',  // 对称关系
  'linked_to': 'linked_to',  // 对称关系
  'associated_with': 'associated_with',  // 对称关系
  'intersects': 'intersects',  // 对称关系
  'aligned_with': 'aligned_with',  // 对称关系
  'often_aligned': 'often_aligned',  // 对称关系
  'often_combined': 'often_combined',  // 对称关系
  'distinct_from': 'distinct_from',  // 对称关系
  'both_opposes_and_promotes': 'both_opposes_and_promotes',  // 对称关系

  // 示例/实例关系 (Exemplification)
  'exemplifies': 'exemplified_by',
  'exemplified_by': 'exemplifies',
  'includes': 'included_in',
  'included_in': 'includes',

  // 应用/扩展关系 (Application/Extension)
  'applies': 'applied_by',
  'applied_by': 'applies',
  'applied_as': 'was_applied_by',
  'was_applied_by': 'applied_as',
  'extends': 'extended_by',
  'extended_by': 'extends',
  'employs': 'employed_by',
  'employed_by': 'employs',

  // 部分/整体关系 (Part/Whole)
  'part_of': 'has_part',
  'has_part': 'part_of',
  'central_to': 'has_central_element',
  'has_central_element': 'central_to',

  // 支持/推广关系 (Support/Promotion)
  'promotes': 'promoted_by',
  'promoted_by': 'promotes',
  'promoted': 'was_promoted_by',
  'was_promoted_by': 'promoted',
  'championed_by': 'championed',
  'championed': 'championed_by',
  'strongly_supports': 'strongly_supported_by',
  'strongly_supported_by': 'strongly_supports',

  // 辩护/正当化关系 (Justification)
  'justifies': 'justified_by',
  'justified_by': 'justifies',

  // 特殊关系 (Special cases)
  'inverted': 'was_inverted_by',
  'was_inverted_by': 'inverted',
  'regulates': 'regulated_by',
  'regulated_by': 'regulates',
  'claimed_to_represent': 'claimed_as_representation_by',
  'claimed_as_representation_by': 'claimed_to_represent',
  'accused_of': 'accused_by',
  'accused_by': 'accused_of'
};

/**
 * 将关系类型转换为其反向形式
 * 用于路径规范化，确保路径从早期思想指向晚期思想
 *
 * @param {string} relationType - 原始关系类型
 * @returns {string} 反向关系类型，如果不存在映射则返回原类型
 *
 * @example
 * reverseRelationType('emerged_from') // returns 'gave_rise_to'
 * reverseRelationType('influenced_by') // returns 'influenced'
 * reverseRelationType('similar_to') // returns 'similar_to' (对称关系)
 */
export function reverseRelationType(relationType) {
  return RELATION_REVERSE_MAP[relationType] || relationType;
}
