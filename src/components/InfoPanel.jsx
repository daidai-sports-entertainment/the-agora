import { useState } from 'react';
import { getNodeColor } from '../utils/colorScheme';
import {
  formatCategory,
  formatDomain,
  formatEra,
  formatRelationType,
  getText
} from '../utils/i18n';
import {
  getLayerDisplayName,
  getLayerIcon
} from '../utils/relationOntology';
import { generateWarnings } from '../utils/pathFinding';

/**
 * Right side information panel - displays selected concept details
 * or influence path information
 */
export function InfoPanel({ selectedNode, language, onLanguageChange, totalNodes, pathResult, pathMode, onClearPath, allNodes, onExport }) {
  const t = getText(language);
  const [showQualityTooltip, setShowQualityTooltip] = useState(false);

  const handleLanguageToggle = (nextLanguage) => {
    if (nextLanguage !== language) {
      onLanguageChange?.(nextLanguage);
    }
  };

  // 如果有路径结果，显示路径信息
  if (pathResult && pathResult.path && pathResult.path.length > 0) {
    return (
      <div style={styles.panel} className="info-panel">
        <div style={styles.languageRow}>
          <span style={styles.languageLabel}>{t.languageLabel}</span>
          <div style={styles.languageToggle}>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              style={{
                ...styles.languageOption,
                ...(language === 'en' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'en'}
            >
              {t.languageEN}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('zh')}
              style={{
                ...styles.languageOption,
                ...(language === 'zh' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'zh'}
            >
              {t.languageZH}
            </button>
          </div>
        </div>

        <div style={styles.header}>
          <h2 style={{...styles.conceptName, color: '#e6c98a'}}>
            {language === 'zh' ? '影响路径' : 'Influence Path'}
          </h2>
          <div style={styles.meta}>
            <span style={styles.era}>
              {pathResult.path[0].node?.name} → {pathResult.path[pathResult.path.length - 1].node?.name}
            </span>
          </div>
        </div>

        <div style={styles.section}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <h3 style={{...styles.sectionTitle, margin: 0}}>
                {language === 'zh' ? '📊 路径概览' : '📊 Path Overview'}
              </h3>
              {pathResult.quality && (
                <div
                  style={styles.qualityIconContainer}
                  onMouseEnter={() => setShowQualityTooltip(true)}
                  onMouseLeave={() => setShowQualityTooltip(false)}
                >
                  <span style={styles.qualityIcon}>ℹ️</span>
                  {showQualityTooltip && (
                    <div style={styles.qualityTooltip}>
                      <div style={styles.qualityTooltipContent}>
                        <div style={styles.qualityBadge}>
                          <span style={styles.qualityBadgeIcon}>
                            {getLayerIcon(pathResult.quality.type)}
                          </span>
                          <span style={styles.qualityBadgeText}>
                            {getLayerDisplayName(pathResult.quality.type, language)}
                          </span>
                        </div>

                        <div style={styles.qualityScore}>
                          <span style={styles.qualityScoreLabel}>
                            {language === 'zh' ? '可信度' : 'Confidence'}:
                          </span>
                          <span style={{
                            ...styles.qualityScoreValue,
                            color: pathResult.quality.score >= 80 ? '#4caf50' :
                                   pathResult.quality.score >= 50 ? '#ffa726' :
                                   '#ef5350'
                          }}>
                            {pathResult.quality.score >= 80 ? '🟢' :
                             pathResult.quality.score >= 50 ? '🟡' :
                             '🔴'}
                            {' '}
                            {pathResult.quality.score}%
                          </span>
                        </div>

                        {pathResult.quality.warnings && pathResult.quality.warnings.length > 0 && (
                          <div style={styles.qualityWarnings}>
                            <div style={styles.qualityWarningTitle}>
                              ⚠️ {language === 'zh' ? '注意' : 'Warnings'}:
                            </div>
                            {generateWarnings(pathResult.quality.warnings, language).map((warning, index) => (
                              <div key={index} style={styles.qualityWarningItem}>
                                • {warning}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClearPath}
              style={styles.resetButton}
              title={language === 'zh' ? '重新选择' : 'Reset selection'}
            >
              🔄
            </button>
          </div>
          <div style={styles.pathStats}>
            <div style={styles.pathStat}>
              <span style={styles.pathStatLabel}>
                {language === 'zh' ? '总步数' : 'Total Steps'}:
              </span>
              <span style={styles.pathStatValue}>{pathResult.length}</span>
            </div>
            <div style={styles.pathStat}>
              <span style={styles.pathStatLabel}>
                {language === 'zh' ? '概念数' : 'Concepts'}:
              </span>
              <span style={styles.pathStatValue}>{pathResult.path.length}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            {language === 'zh' ? '🗺️ 详细路径' : '🗺️ Detailed Path'}
          </h3>
          <div style={styles.pathSteps}>
            {pathResult.path.map((step, index) => {
              const node = step.node;
              const edge = pathResult.edges[index];
              const stepNumber = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][index] || (index + 1);

              return (
                <div key={step.nodeId}>
                  <div style={styles.pathStep}>
                    <div style={styles.pathStepNumber}>{stepNumber}</div>
                    <div style={styles.pathStepContent}>
                      <div style={styles.pathStepName}>{node?.name || step.nodeId}</div>
                      <div style={styles.pathStepEra}>
                        {node ? formatEra(node.era, language) : ''}
                      </div>
                    </div>
                  </div>
                  {edge && (
                    <div style={styles.pathArrow}>
                      <span style={styles.pathArrowIcon}>↓</span>
                      <span style={styles.pathArrowLabel}>
                        {formatRelationType(edge.type, language)}
                      </span>
                      {edge.description && (
                        <div style={styles.pathArrowDesc}>{edge.description}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 如果路径搜索失败（pathResult明确为null）
  if (pathMode && pathResult === null) {
    return (
      <div style={styles.panel} className="info-panel">
        <div style={styles.languageRow}>
          <span style={styles.languageLabel}>{t.languageLabel}</span>
          <div style={styles.languageToggle}>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              style={{
                ...styles.languageOption,
                ...(language === 'en' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'en'}
            >
              {t.languageEN}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('zh')}
              style={{
                ...styles.languageOption,
                ...(language === 'zh' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'zh'}
            >
              {t.languageZH}
            </button>
          </div>
        </div>

        <div style={styles.welcome}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
            <h2 style={{...styles.title, margin: 0}}>
              {language === 'zh' ? '❌ 未找到路径' : '❌ No Path Found'}
            </h2>
            <button
              type="button"
              onClick={onClearPath}
              style={styles.resetButton}
              title={language === 'zh' ? '重新选择' : 'Reset selection'}
            >
              🔄
            </button>
          </div>
          <p style={styles.subtitle}>
            {language === 'zh'
              ? '这两个概念之间没有找到符合质量标准的影响路径。'
              : 'No valid influence path found between these concepts that meets quality standards.'}
          </p>

          <div style={styles.instructions}>
            <h3 style={styles.sectionTitle}>
              {language === 'zh' ? '可能的原因' : 'Possible Reasons'}
            </h3>
            <ul style={styles.list}>
              <li>
                {language === 'zh'
                  ? '这两个思想之间没有直接或间接的影响关系'
                  : 'No direct or indirect influence relationship exists'}
              </li>
              <li>
                {language === 'zh'
                  ? '路径过长（超过4步）或质量分数过低（低于40分）'
                  : 'Path too long (>4 steps) or quality score too low (<40)'}
              </li>
              <li>
                {language === 'zh'
                  ? '路径混合了不兼容的关系类型（如对立关系和继承关系混用）'
                  : 'Path mixes incompatible relation types'}
              </li>
            </ul>
          </div>

          <p style={{...styles.subtitle, marginTop: '24px'}}>
            {language === 'zh'
              ? '请尝试选择其他概念组合。'
              : 'Please try selecting different concepts.'}
          </p>
        </div>
      </div>
    );
  }

  // 如果处于路径模式但还没有开始计算路径
  if (pathMode && pathResult === undefined) {
    return (
      <div style={styles.panel} className="info-panel">
        <div style={styles.languageRow}>
          <span style={styles.languageLabel}>{t.languageLabel}</span>
          <div style={styles.languageToggle}>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              style={{
                ...styles.languageOption,
                ...(language === 'en' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'en'}
            >
              {t.languageEN}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('zh')}
              style={{
                ...styles.languageOption,
                ...(language === 'zh' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'zh'}
            >
              {t.languageZH}
            </button>
          </div>
        </div>

        <div style={styles.welcome}>
          <h2 style={styles.title}>
            {language === 'zh' ? '🔍 查找影响路径' : '🔍 Find Influence Path'}
          </h2>
          <p style={styles.subtitle}>
            {language === 'zh'
              ? '追踪思想如何在历史中传播和演进'
              : 'Trace how ideas spread and evolve through history'}
          </p>

          <div style={styles.instructions}>
            <h3 style={styles.sectionTitle}>
              {language === 'zh' ? '使用方法' : 'How to Use'}
            </h3>
            <ul style={styles.list}>
              <li>
                {language === 'zh'
                  ? '第一步：点击任意概念作为起点（将以蓝色高亮）'
                  : 'Step 1: Click any concept as the start point (highlighted in blue)'}
              </li>
              <li>
                {language === 'zh'
                  ? '第二步：点击另一个概念作为终点'
                  : 'Step 2: Click another concept as the end point'}
              </li>
              <li>
                {language === 'zh'
                  ? '系统将自动计算并显示影响路径'
                  : 'The system will automatically calculate and display the influence path'}
              </li>
              <li>
                {language === 'zh'
                  ? '点击 ✕ 按钮或再次点击 🔍 按钮退出路径模式'
                  : 'Click ✕ or 🔍 again to exit path mode'}
              </li>
            </ul>
          </div>

          {selectedNode && (
            <div style={styles.pathSelection}>
              <h3 style={styles.sectionTitle}>
                {language === 'zh' ? '✨ 已选择起点' : '✨ Start Point Selected'}
              </h3>
              <div style={{...styles.pathSelectedNode, borderColor: '#8fb4ff'}}>
                <div style={styles.pathSelectedName}>{selectedNode.name}</div>
                <div style={styles.pathSelectedEra}>{formatEra(selectedNode.era, language)}</div>
              </div>

              <div style={{...styles.constellationHint, marginTop: '16px'}}>
                <p style={styles.constellationText}>
                  {language === 'zh'
                    ? '✨ 星图中亮起的思想可以在4步内到达'
                    : '✨ Illuminated ideas can be reached within 4 steps'}
                </p>
                <p style={{...styles.constellationText, opacity: 0.7}}>
                  {language === 'zh'
                    ? '暗淡的思想暂时无法通过有效路径连接'
                    : 'Dimmed ideas cannot be connected through valid paths'}
                </p>
              </div>

              <p style={{...styles.subtitle, marginTop: '16px'}}>
                {language === 'zh'
                  ? '💫 现在请选择一个亮起的终点...'
                  : '💫 Now select an illuminated end point...'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!selectedNode) {
    return (
      <div style={styles.panel} className="info-panel">
        <div style={styles.languageRow}>
          <span style={styles.languageLabel}>{t.languageLabel}</span>
          <div style={styles.languageToggle}>
            <button
              type="button"
              onClick={() => handleLanguageToggle('en')}
              style={{
                ...styles.languageOption,
                ...(language === 'en' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'en'}
            >
              {t.languageEN}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageToggle('zh')}
              style={{
                ...styles.languageOption,
                ...(language === 'zh' ? styles.languageOptionActive : {})
              }}
              aria-pressed={language === 'zh'}
            >
              {t.languageZH}
            </button>
          </div>
        </div>

        <div style={styles.welcome}>
          <h2 style={styles.title}>{t.appTitle}</h2>
          <p style={styles.subtitle}>{t.tagline}</p>

          <div style={styles.legend}>
            <h3 style={styles.sectionTitle}>{t.legendTitle}</h3>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: 'var(--color-philosophy)'}} />
              <span>{t.legendPhilosophy}</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: 'var(--color-politics)'}} />
              <span>{t.legendPolitics}</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.colorDot, backgroundColor: 'var(--color-both)'}} />
              <span>{t.legendInterdisciplinary}</span>
            </div>
          </div>

          <div style={styles.instructions}>
            <h3 style={styles.sectionTitle}>{t.instructionsTitle}</h3>
            <ul style={styles.list}>
              {t.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>

          <div style={styles.stats}>
            {t.stats(totalNodes || 71).map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const color = getNodeColor(selectedNode);
  const category = formatCategory(selectedNode.domains, language);

  // 计算所有关系：出边 + 入边
  const outgoingRelationships = selectedNode.relationships || [];
  const incomingRelationships = allNodes
    ? allNodes
        .filter(node => node.relationships?.some(rel => rel.target === selectedNode.id))
        .flatMap(node =>
          node.relationships
            .filter(rel => rel.target === selectedNode.id)
            .map(rel => ({
              ...rel,
              source: node.id,
              sourceName: node.name,
              isIncoming: true
            }))
        )
    : [];

  const totalRelationships = outgoingRelationships.length + incomingRelationships.length;

  return (
    <div style={styles.panel} className="info-panel">
      <div style={styles.languageRow}>
        <span style={styles.languageLabel}>{t.languageLabel}</span>
        <div style={styles.languageToggle}>
          <button
            type="button"
            onClick={() => handleLanguageToggle('en')}
            style={{
              ...styles.languageOption,
              ...(language === 'en' ? styles.languageOptionActive : {})
            }}
            aria-pressed={language === 'en'}
          >
            {t.languageEN}
          </button>
          <button
            type="button"
            onClick={() => handleLanguageToggle('zh')}
            style={{
              ...styles.languageOption,
              ...(language === 'zh' ? styles.languageOptionActive : {})
            }}
            aria-pressed={language === 'zh'}
          >
            {t.languageZH}
          </button>
        </div>
      </div>

      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h2 style={{...styles.conceptName, color}}>{selectedNode.name}</h2>
          <div style={styles.meta}>
            <span style={styles.era}>
              {formatEra(selectedNode.era, language)}
            </span>
            <span style={{...styles.category, backgroundColor: color}}>
              {category}
            </span>
          </div>
        </div>
        {!pathMode && onExport && (
          <button
            type="button"
            onClick={onExport}
            style={styles.exportButton}
            title={language === 'zh' ? '导出分享' : 'Export & Share'}
          >
            📤
          </button>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{t.description}</h3>
        <p style={styles.description}>{selectedNode.description}</p>
      </div>

      {selectedNode.key_figures && selectedNode.key_figures.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👤 {t.keyFigures}</h3>
          <ul style={styles.list}>
            {selectedNode.key_figures.map((figure, i) => (
              <li key={i} style={styles.listItem}>{figure}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedNode.domains && selectedNode.domains.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏷️ {t.domains}</h3>
          <div style={styles.tags}>
            {selectedNode.domains.map((domain, i) => (
              <span key={i} style={styles.tag}>{formatDomain(domain, language)}</span>
            ))}
          </div>
        </div>
      )}

      {totalRelationships > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            🔗 {t.relationships} ({totalRelationships})
          </h3>

          {/* 出边：这个思想影响了谁 */}
          {outgoingRelationships.length > 0 && (
            <div style={styles.relationshipGroup}>
              <h4 style={styles.relationshipGroupTitle}>
                📤 {language === 'zh' ? '影响' : 'Influences'} ({outgoingRelationships.length})
              </h4>
              <div style={styles.relationships}>
                {outgoingRelationships.map((rel, i) => (
                  <div key={`out-${i}`} style={styles.relationship} className="relationship-card">
                    <div style={styles.relType}>
                      {formatRelationType(rel.type, language)}
                    </div>
                    <div style={styles.relTarget}>
                      → {formatNodeName(rel.target)}
                    </div>
                    {rel.description && (
                      <div style={styles.relDesc}>{rel.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 入边：谁影响了这个思想 */}
          {incomingRelationships.length > 0 && (
            <div style={styles.relationshipGroup}>
              <h4 style={styles.relationshipGroupTitle}>
                📥 {language === 'zh' ? '被影响' : 'Influenced By'} ({incomingRelationships.length})
              </h4>
              <div style={styles.relationships}>
                {incomingRelationships.map((rel, i) => (
                  <div key={`in-${i}`} style={styles.relationship} className="relationship-card">
                    <div style={styles.relType}>
                      {formatRelationType(rel.type, language)}
                    </div>
                    <div style={styles.relTarget}>
                      ← {rel.sourceName}
                    </div>
                    {rel.description && (
                      <div style={styles.relDesc}>{rel.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Format node names - remove underscores and capitalize
function formatNodeName(name) {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const styles = {
  panel: {
    width: '400px',
    height: '100%',
    background: 'linear-gradient(180deg, rgba(14, 20, 34, 0.96), rgba(10, 14, 26, 0.98))',
    color: 'var(--color-ink)',
    padding: '24px',
    overflowY: 'auto',
    boxShadow: '-10px 0 30px rgba(3, 5, 10, 0.55)',
    borderLeft: '1px solid var(--color-border)',
    position: 'relative'
  },
  languageRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  languageLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--color-muted)'
  },
  languageToggle: {
    display: 'flex',
    padding: '4px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  languageOption: {
    border: 'none',
    background: 'transparent',
    color: 'var(--color-muted)',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '999px',
    cursor: 'pointer',
    letterSpacing: '0.5px'
  },
  languageOptionActive: {
    backgroundColor: 'rgba(227, 201, 154, 0.2)',
    color: 'var(--color-accent)',
    boxShadow: '0 6px 16px rgba(3, 5, 10, 0.35)'
  },
  welcome: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    margin: 0,
    fontFamily: 'var(--font-title)'
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-muted)',
    margin: 0
  },
  header: {
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px'
  },
  headerContent: {
    flex: 1
  },
  exportButton: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: '1px solid rgba(230, 201, 138, 0.3)',
    backgroundColor: 'rgba(230, 201, 138, 0.1)',
    color: 'var(--color-accent)',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0
  },
  conceptName: {
    fontSize: '24px',
    fontWeight: 600,
    margin: '0 0 12px 0',
    fontFamily: 'var(--font-title)',
    letterSpacing: '0.3px'
  },
  meta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  era: {
    fontSize: '14px',
    color: 'var(--color-muted)'
  },
  category: {
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: 600,
    letterSpacing: '0.4px'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-accent)',
    marginBottom: '12px'
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--color-ink)'
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px'
  },
  listItem: {
    marginBottom: '8px',
    color: 'var(--color-ink)'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    fontSize: '12px',
    padding: '4px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    color: 'var(--color-ink)'
  },
  relationshipGroup: {
    marginBottom: '20px'
  },
  relationshipGroupTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-ink)',
    marginBottom: '12px',
    opacity: 0.9
  },
  relationships: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  relationship: {
    padding: '12px',
    backgroundColor: 'rgba(13, 23, 41, 0.75)',
    borderRadius: '12px',
    fontSize: '13px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 10px 24px rgba(3, 6, 12, 0.35)'
  },
  relType: {
    fontWeight: 600,
    color: 'var(--color-accent)',
    marginBottom: '4px'
  },
  relTarget: {
    color: 'var(--color-ink)',
    marginBottom: '4px'
  },
  relDesc: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    fontStyle: 'italic'
  },
  moreRelations: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  legend: {
    marginTop: '8px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
    fontSize: '14px'
  },
  colorDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.12)'
  },
  instructions: {},
  stats: {
    fontSize: '14px',
    color: 'var(--color-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  pathStats: {
    display: 'flex',
    gap: '16px',
    padding: '12px',
    backgroundColor: 'rgba(230, 201, 138, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(230, 201, 138, 0.2)'
  },
  pathStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  pathStatLabel: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  pathStatValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#e6c98a'
  },
  pathSteps: {
    display: 'flex',
    flexDirection: 'column'
  },
  pathStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(13, 23, 41, 0.75)',
    borderRadius: '12px',
    border: '1px solid rgba(230, 201, 138, 0.3)',
    boxShadow: '0 10px 24px rgba(3, 6, 12, 0.35)'
  },
  pathStepNumber: {
    fontSize: '20px',
    color: '#e6c98a',
    fontWeight: 'bold',
    flexShrink: 0
  },
  pathStepContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  pathStepName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-ink)'
  },
  pathStepEra: {
    fontSize: '13px',
    color: 'var(--color-muted)'
  },
  pathArrow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 0',
    gap: '4px'
  },
  pathArrowIcon: {
    fontSize: '20px',
    color: '#e6c98a'
  },
  pathArrowLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#e6c98a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  pathArrowDesc: {
    fontSize: '11px',
    color: 'var(--color-muted)',
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '280px'
  },
  pathSelection: {
    marginTop: '8px'
  },
  pathSelectedNode: {
    padding: '12px',
    backgroundColor: 'rgba(13, 23, 41, 0.75)',
    borderRadius: '12px',
    border: '2px solid',
    boxShadow: '0 10px 24px rgba(3, 6, 12, 0.35)'
  },
  pathSelectedName: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-ink)',
    marginBottom: '4px'
  },
  pathSelectedEra: {
    fontSize: '13px',
    color: 'var(--color-muted)'
  },
  qualityContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'rgba(13, 23, 41, 0.75)',
    borderRadius: '12px',
    border: '1px solid rgba(230, 201, 138, 0.3)',
    boxShadow: '0 10px 24px rgba(3, 6, 12, 0.35)'
  },
  qualityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(230, 201, 138, 0.15)',
    borderRadius: '8px',
    border: '1px solid rgba(230, 201, 138, 0.3)'
  },
  qualityBadgeIcon: {
    fontSize: '18px'
  },
  qualityBadgeText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e6c98a'
  },
  qualityScore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0'
  },
  qualityScoreLabel: {
    fontSize: '14px',
    color: 'var(--color-muted)'
  },
  qualityScoreValue: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  qualityWarnings: {
    padding: '12px',
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(239, 83, 80, 0.3)'
  },
  qualityWarningTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ef5350',
    marginBottom: '8px'
  },
  qualityWarningItem: {
    fontSize: '12px',
    color: 'var(--color-ink)',
    lineHeight: '1.5',
    marginBottom: '4px'
  },
  qualityInfo: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  constellationHint: {
    padding: '12px',
    backgroundColor: 'rgba(230, 201, 138, 0.08)',
    borderRadius: '8px',
    border: '1px solid rgba(230, 201, 138, 0.2)'
  },
  constellationText: {
    fontSize: '13px',
    color: 'var(--color-ink)',
    margin: '4px 0',
    lineHeight: '1.5'
  },
  qualityIconContainer: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  },
  qualityIcon: {
    fontSize: '16px',
    display: 'inline-block',
    transition: 'transform 0.2s ease'
  },
  qualityTooltip: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '28px',
    zIndex: 1000,
    minWidth: '280px',
    maxWidth: '320px'
  },
  qualityTooltipContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'rgba(13, 23, 41, 0.98)',
    borderRadius: '12px',
    border: '1px solid rgba(230, 201, 138, 0.4)',
    boxShadow: '0 12px 32px rgba(3, 6, 12, 0.6)',
    backdropFilter: 'blur(8px)'
  },
  resetButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(230, 201, 138, 0.3)',
    backgroundColor: 'rgba(230, 201, 138, 0.1)',
    color: '#e6c98a',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(230, 201, 138, 0.2)',
      borderColor: 'rgba(230, 201, 138, 0.5)'
    }
  }
};
