export const TEXT = {
  en: {
    appTitle: 'The Agora',
    tagline: 'Observe how ideas relate, respond, and diverge within history\'s universe.',
    legendTitle: 'Legend',
    legendPhilosophy: 'Philosophy',
    legendPolitics: 'Politics',
    legendInterdisciplinary: 'Philosophy + Politics',
    instructionsTitle: 'How to Use',
    instructions: [
      'Click nodes to view details',
      'Scroll to zoom',
      'Drag to pan view',
      'Click background to deselect'
    ],
    stats: (count) => [
      `📚 ${count} concepts`,
      'Ideas appear close because they are discussed in similar contexts, not because they agree.'
    ],
    proximityNote:
      'Ideas appear close because they are discussed in similar contexts, not because they agree.',
    searchPlaceholder: 'Search concepts...',
    description: 'Description',
    keyFigures: 'Key Figures',
    domains: 'Domains',
    relationships: 'Relationships',
    moreRelationships: (count) => `... and ${count} more relationships`,
    languageLabel: 'Language',
    languageEN: 'EN',
    languageZH: '中文',
    welcomeTitle: 'Welcome to The Agora',
    welcomeMessage:
      'Explore the evolution of philosophical and political thought from ancient to contemporary times. Click any node to begin your journey.',
    welcomeFeatures: [
      'Click nodes to reveal connections',
      'Scroll to zoom and drag to pan',
      'View details in the side panel'
    ],
    startExploring: 'Start Exploring',
    loadingTitle: 'Loading The Agora...',
    loadingSubtitle: 'Mapping the landscape of ideas from ancient to contemporary thought',
    eraBCE: 'BCE',
    eraCE: 'CE',
    categoryPhilosophy: 'Philosophy',
    categoryPolitics: 'Politics',
    categoryBoth: 'Philosophy + Politics',
    axisLabel: '← Semantic Similarity →',
    eraNames: ['Ancient', 'Medieval', 'Enlightenment', 'Modern', 'Contemporary']
  },
  zh: {
    appTitle: 'The Agora · 思想星图',
    tagline: '在历史的宇宙中，探索思想如何对话与分化。',
    legendTitle: '图例',
    legendPhilosophy: '哲学',
    legendPolitics: '政治',
    legendInterdisciplinary: '哲学 + 政治',
    instructionsTitle: '使用方式',
    instructions: [
      '点击节点查看详情',
      '滚轮缩放',
      '拖拽平移视图',
      '点击背景取消选择'
    ],
    stats: (count) => [
      `📚 ${count} 个概念`,
      '思想之所以靠近，是因为它们常出现在相似的讨论语境中，而不是因为立场一致。'
    ],
    proximityNote:
      '思想之所以靠近，是因为它们常出现在相似的讨论语境中，而不是因为立场一致。',
    searchPlaceholder: '搜索思想概念...',
    description: '概念说明',
    keyFigures: '关键人物',
    domains: '领域',
    relationships: '关系',
    moreRelationships: (count) => `还有 ${count} 条关系`,
    languageLabel: '语言',
    languageEN: 'EN',
    languageZH: '中文',
    welcomeTitle: '欢迎来到思想星图',
    welcomeMessage:
      '从古典哲学到当代理论，探索思想演进的轨迹。点击任意节点，开启你的星际发现。',
    welcomeFeatures: [
      '点击节点呈现思想关联',
      '滚轮缩放，拖拽平移',
      '在右侧面板查看详情'
    ],
    startExploring: '开始探索',
    loadingTitle: '正在构建思想星图...',
    loadingSubtitle: '从古代到当代的思想脉络正在被点亮',
    eraBCE: '公元前',
    eraCE: '公元',
    categoryPhilosophy: '哲学',
    categoryPolitics: '政治',
    categoryBoth: '哲学 + 政治',
    axisLabel: '← 语义相似度 →',
    eraNames: ['古代', '中世纪', '启蒙', '现代', '当代']
  }
};

const RELATIONSHIP_LABELS = {
  en: {
    influenced_by: 'Influenced By',
    influenced: 'Influenced',
    opposes: 'Opposes',
    similar_to: 'Similar To',
    evolved_from: 'Evolved From',
    evolved_into: 'Evolved Into',
    synthesized_with: 'Synthesized With',
    foundation_for: 'Foundation For',
    critiques: 'Critiques',
    built_on: 'Built On',
    moderate_form: 'Moderate Form',
    diverged_from: 'Diverged From',
    radicalized_into: 'Radicalized Into',
    preceded: 'Preceded',
    succeeded: 'Succeeded',
    challenged_by: 'Challenged By',
    challenged: 'Challenged',
    incorporated_into: 'Incorporated Into',
    reacted_against: 'Reacted Against',
    inspired: 'Inspired',
    inspired_by: 'Inspired By',
    based_on: 'Based On'
  },
  zh: {
    influenced_by: '受其影响',
    influenced: '影响了',
    opposes: '对立',
    similar_to: '相似',
    evolved_from: '演化自',
    evolved_into: '演化为',
    synthesized_with: '综合于',
    foundation_for: '奠基于',
    critiques: '批判',
    built_on: '建立于',
    moderate_form: '温和形式',
    diverged_from: '分化自',
    radicalized_into: '激进化为',
    preceded: '先于',
    succeeded: '继承自',
    challenged_by: '受到挑战',
    challenged: '挑战了',
    incorporated_into: '并入',
    reacted_against: '反思',
    inspired: '启发',
    inspired_by: '受启发',
    based_on: '基于'
  }
};

const DOMAIN_LABELS = {
  en: {
    philosophy: 'Philosophy',
    politics: 'Politics'
  },
  zh: {
    philosophy: '哲学',
    politics: '政治'
  }
};

export function getText(language) {
  return TEXT[language] || TEXT.en;
}

export function formatEra(era, language) {
  const t = getText(language);
  if (era < 0) {
    return language === 'zh'
      ? `${t.eraBCE}${Math.abs(era)}`
      : `${Math.abs(era)} ${t.eraBCE}`;
  }
  return language === 'zh' ? `${t.eraCE}${era}` : `${era} ${t.eraCE}`;
}

export function formatCategory(domains, language) {
  const t = getText(language);
  const hasPolitics = domains.includes('politics');
  const hasPhilosophy = domains.includes('philosophy');

  if (hasPolitics && hasPhilosophy) {
    return t.categoryBoth;
  }
  return hasPolitics ? t.categoryPolitics : t.categoryPhilosophy;
}

export function formatRelationType(type, language) {
  const map = RELATIONSHIP_LABELS[language] || RELATIONSHIP_LABELS.en;
  if (map[type]) {
    return map[type];
  }

  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDomain(domain, language) {
  const map = DOMAIN_LABELS[language] || DOMAIN_LABELS.en;
  return map[domain] || domain;
}
