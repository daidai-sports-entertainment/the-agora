# Development Logs

此目录记录 Ideology Universe (The Agora) 项目的所有重要开发活动、功能实现、bug 修复和技术决策。

---

## 📁 Log Structure

每个开发日志包含以下部分：

### 基础信息
- **日期**: YYYY-MM-DD
- **功能名称**: 简短描述
- **状态**: Complete / In Progress / Planned
- **影响级别**: Critical / High / Medium / Low

### 核心内容
1. **Summary**: 简短总结（2-3 句话）
2. **Problem Statement**: 要解决的问题
3. **Implementation Details**: 技术实现细节
4. **Bugs Encountered**: 遇到的 bug 和解决方案
5. **Modified Files**: 修改的文件列表
6. **Testing**: 测试计划和结果
7. **Impact Analysis**: 性能、用户体验、代码质量影响
8. **Future Improvements**: 未来可能的改进方向

---

## 📚 Development Logs Index

### 2026-01

| Date | Title | Status | Impact | Files Changed |
|------|-------|--------|--------|---------------|
| 2026-01-19 | [Path Normalization Feature](./2026-01-19-path-normalization.md) | ✅ Complete | Critical | 2 core files |

---

## 🏷️ Log Categories

### Feature Implementation
实现新功能的完整记录，包括设计决策、技术选型、实现细节。

**Tags**: `feature`, `implementation`

### Bug Fixes
重要 bug 的修复记录，包括问题描述、根本原因分析、解决方案。

**Tags**: `bugfix`, `hotfix`

### Performance Optimization
性能优化的记录，包括瓶颈分析、优化策略、效果对比。

**Tags**: `performance`, `optimization`

### Refactoring
代码重构记录，包括重构原因、影响范围、风险评估。

**Tags**: `refactoring`, `code-quality`

### Technical Debt
技术债务的识别和偿还记录。

**Tags**: `tech-debt`, `maintenance`

---

## 📝 How to Create a New Log

### 1. 命名规范

```
YYYY-MM-DD-short-description.md
```

**Examples**:
- `2026-01-19-path-normalization.md`
- `2026-01-20-export-feature.md`
- `2026-01-21-performance-optimization.md`

### 2. 使用模板

复制 [log-template.md](./log-template.md) 开始新的日志：

```bash
cp docs/development-logs/log-template.md docs/development-logs/2026-01-XX-your-feature.md
```

### 3. 填写内容

- ✅ **Do**: 详细记录技术细节、决策原因、遇到的问题
- ✅ **Do**: 包含代码示例、配置变更、测试结果
- ✅ **Do**: 记录 "为什么" 而不只是 "做了什么"
- ❌ **Don't**: 只记录简单的提交信息
- ❌ **Don't**: 省略错误和失败的尝试
- ❌ **Don't**: 忘记更新索引表格

### 4. 更新索引

在 [README.md](./README.md) 的索引表格中添加新条目：

```markdown
| 2026-01-XX | [Your Feature](./2026-01-XX-your-feature.md) | ✅ Complete | High | 5 files |
```

---

## 🔍 Search Tips

### 按关键词搜索

```bash
# 搜索所有提到 "performance" 的日志
grep -r "performance" docs/development-logs/

# 搜索特定文件的修改记录
grep -r "pathFinding.js" docs/development-logs/
```

### 按日期范围查找

```bash
# 查看 2026 年 1 月的所有日志
ls docs/development-logs/2026-01-*.md
```

### 按影响级别筛选

```bash
# 查找所有 Critical 级别的变更
grep -l "Impact: Critical" docs/development-logs/*.md
```

---

## 📊 Statistics

### Current Stats (as of 2026-01-19)

- **Total Logs**: 1
- **Features Implemented**: 1
- **Bugs Fixed**: 0
- **Performance Optimizations**: 0
- **Refactorings**: 0

### Impact Distribution

- **Critical**: 1 (100%)
- **High**: 0 (0%)
- **Medium**: 0 (0%)
- **Low**: 0 (0%)

---

## 🎯 Development Roadmap

### Week 1: Path Tracking (Current)
- [x] Path Normalization
- [ ] Path Visualization Enhancements
- [ ] Path Quality Indicators
- [ ] Comprehensive Testing

### Week 2: Export Feature
- [ ] SVG Export
- [ ] PNG Export (multiple resolutions)
- [ ] Export Dialog UI
- [ ] Path Export Mode

### Week 3: Polish & Testing
- [ ] Full Integration Testing
- [ ] Performance Optimization
- [ ] Documentation Updates
- [ ] User Feedback Collection

---

## 💡 Best Practices

### Writing Good Logs

1. **Be Specific**: 说明具体改了什么，为什么要改
2. **Include Context**: 提供足够的背景信息，让未来的开发者理解决策
3. **Document Failures**: 记录失败的尝试和为什么不可行
4. **Link Resources**: 链接到相关的 PRs, issues, 文档
5. **Update Regularly**: 不要等到功能完成才写日志，边做边记录

### Code Examples

在日志中包含关键代码示例时，使用完整的上下文：

```javascript
// ✅ Good: 包含函数签名和注释
/**
 * Normalize path to chronological order
 * @param {Object} pathResult - Original path
 * @returns {Object} Normalized path
 */
function normalizePathToChronological(pathResult) {
  // Implementation...
}

// ❌ Bad: 只有孤立的代码片段
if (startEra > endEra) {
  return pathResult.reverse();
}
```

---

## 📧 Contact

如有关于开发日志的问题或建议，请联系：

- **Project Lead**: [Your Name]
- **GitHub**: [Repository URL]
- **Email**: [Your Email]

---

**Last Updated**: 2026-01-19
