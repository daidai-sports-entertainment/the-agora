# Bilingual Documentation Guide
# 双语文档指南

---

## 📋 TL;DR / 快速摘要

**Recommendation**: **Separate files** with `.zh.md` suffix for Chinese versions.

**推荐方案**：使用 `.zh.md` 后缀**分开存放**中英文文档。

---

## 🎯 Why Separate Files? / 为什么分开？

### ✅ Advantages / 优点

1. **Clean separation / 清晰分离**
   - Each file focuses on one language
   - Easier to maintain and update
   - No mixed language confusion
   - 每个文件专注一种语言
   - 更易维护和更新
   - 不会语言混杂

2. **Search friendly / 搜索友好**
   - `grep "error"` won't return Chinese results
   - `grep "错误"` won't return English results
   - Better for code search tools
   - 不会返回混合语言的搜索结果
   - 对代码搜索工具更友好

3. **GitHub support / GitHub 支持**
   - GitHub can detect language and provide switcher
   - Follows open source conventions (like `README.zh.md`)
   - Better for international contributors
   - GitHub 可以检测语言并提供切换
   - 符合开源惯例（如 `README.zh.md`）
   - 对国际贡献者更友好

4. **Independent updates / 独立更新**
   - Can update one language without touching the other
   - Different translators can work independently
   - Version control is clearer
   - 可以只更新一种语言
   - 不同译者可独立工作
   - 版本控制更清晰

5. **Machine translation friendly / 机器翻译友好**
   - Easier to use automated translation tools
   - Can process entire file at once
   - 易于使用自动翻译工具
   - 可一次处理整个文件

### ❌ Disadvantages of mixed docs / 混合文档的缺点

1. **Confusing to read / 阅读困惑**
   - Readers have to skip sections constantly
   - Harder to maintain parallel structure
   - 读者需要不断跳过段落
   - 难以保持平行结构

2. **Version control messiness / 版本控制混乱**
   - Changes to one language affect the other's diff
   - Merge conflicts more complex
   - 对一种语言的修改会影响另一种的 diff
   - 合并冲突更复杂

3. **Search pollution / 搜索污染**
   - Grep results include both languages
   - IDE search becomes less useful
   - Grep 结果包含两种语言
   - IDE 搜索效果变差

---

## 📂 Recommended Structure / 推荐结构

```
docs/development-logs/
├── README.md                                    # English index
├── README.zh.md                                 # Chinese index (中文索引)
│
├── log-template.md                              # English template
├── log-template.zh.md                           # Chinese template (中文模板)
│
├── 2026-01-19-path-normalization.md             # English log
├── 2026-01-19-path-normalization.zh.md          # Chinese log (中文日志)
│
└── 2026-01-19-bugfixes.md                       # English bug report
    └── 2026-01-19-bugfixes.zh.md (optional)     # Chinese version (可选)
```

---

## 🔗 Cross-Linking / 交叉链接

### At the top of each document / 在每个文档顶部

**English version** (`README.md`):
```markdown
# Development Logs

> **[中文版本](./README.zh.md) / Chinese Version**

This directory contains...
```

**Chinese version** (`README.zh.md`):
```markdown
# 开发日志

> **[English Version](./README.md) / 英文版本**

此目录包含...
```

### In navigation / 在导航中

```markdown
## 📚 Development Logs Index / 开发日志索引

| Date | Title (EN) | Title (ZH) | Status |
|------|------------|------------|--------|
| 2026-01-19 | [Path Normalization](./2026-01-19-path-normalization.md) | [路径规范化](./2026-01-19-path-normalization.zh.md) | ✅ Complete |
| 2026-01-19 | [Bug Fixes](./2026-01-19-bugfixes.md) | [Bug 修复](./2026-01-19-bugfixes.zh.md) | ✅ Complete |
```

---

## 📝 Naming Conventions / 命名规范

### File naming / 文件命名

```
# English (default)
filename.md

# Chinese
filename.zh.md

# Other languages (if needed)
filename.es.md  # Spanish
filename.fr.md  # French
filename.ja.md  # Japanese
```

### Why `.zh.md` not `.cn.md`? / 为什么用 `.zh` 不是 `.cn`？

- `zh` = Chinese language (语言代码)
- `cn` = China country (国家代码)
- Language codes are more appropriate for content
- Follow ISO 639-1 standard
- 语言代码更适合内容
- 遵循 ISO 639-1 标准

---

## 🔄 Translation Workflow / 翻译工作流

### Option 1: Manual Translation / 手动翻译

1. Write English version first / 先写英文版
2. Create `.zh.md` copy / 创建 `.zh.md` 副本
3. Translate content / 翻译内容
4. Add cross-links / 添加交叉链接
5. Commit both files together / 一起提交两个文件

### Option 2: Automated Translation / 自动翻译

```bash
# Use Claude or GPT to translate
cat docs/path-normalization.md | claude translate --to zh > docs/path-normalization.zh.md

# Or use other tools
# 或使用其他工具
```

### Option 3: Progressive Translation / 渐进式翻译

- Write important docs in both languages / 重要文档双语撰写
- Less important docs: English only first / 次要文档：先只写英文
- Add Chinese version when needed / 需要时再加中文版

---

## 📚 Examples / 示例

### Example 1: README with language switcher / 带语言切换的 README

**README.md**:
```markdown
# Development Logs

**Languages**: [English](./README.md) | **[中文](./README.zh.md)**

---

This directory records all significant development activities...

## Index

| Date | Title | Status |
|------|-------|--------|
| 2026-01-19 | [Path Normalization](./2026-01-19-path-normalization.md) ([中文](./2026-01-19-path-normalization.zh.md)) | ✅ Complete |
```

**README.zh.md**:
```markdown
# 开发日志

**语言**: **[中文](./README.zh.md)** | [English](./README.md)

---

此目录记录所有重要的开发活动...

## 索引

| 日期 | 标题 | 状态 |
|------|-------|--------|
| 2026-01-19 | [路径规范化](./2026-01-19-path-normalization.zh.md) ([English](./2026-01-19-path-normalization.md)) | ✅ 完成 |
```

### Example 2: Detailed log with inline language notes / 带语言注释的详细日志

Sometimes you might want small bilingual notes in code examples:

**2026-01-19-path-normalization.md**:
```markdown
## Bug Fix

We fixed the array mutation issue:

\`\`\`javascript
// Before (wrong) / 之前（错误）
path.reverse()  // ❌ Mutates original / 修改了原数组

// After (correct) / 之后（正确）
[...path].reverse()  // ✅ Creates new array / 创建新数组
\`\`\`
```

This is acceptable for:
- Code comments / 代码注释
- Technical terms / 术语
- Quick clarifications / 快速说明

But still keep main content monolingual!
但主要内容仍保持单语！

---

## 🎯 Recommendation for This Project / 项目建议

### For Important Docs / 重要文档
✅ **Write both languages** (separate files):
- README.md / README.zh.md
- Main feature logs / 主要功能日志
- Bug reports affecting users / 影响用户的 Bug 报告

### For Internal Notes / 内部笔记
✅ **English only** (with Chinese comments in code):
- Quick notes / 快速笔记
- Work-in-progress logs / 进行中的日志
- Technical implementation details / 技术实现细节

### For User-Facing Docs / 面向用户的文档
✅ **Both languages required** / 必须双语:
- README.md
- CHANGELOG.md
- User guides / 用户指南
- API documentation / API 文档

---

## 🔧 Tools to Help / 辅助工具

### 1. Automated Translation Script / 自动翻译脚本

```bash
# translate_doc.sh
#!/bin/bash
SOURCE_FILE=$1
TARGET_LANG=${2:-zh}

BASE_NAME="${SOURCE_FILE%.md}"
TARGET_FILE="${BASE_NAME}.${TARGET_LANG}.md"

# Use Claude API or similar
# 使用 Claude API 或类似工具
claude translate "$SOURCE_FILE" --to "$TARGET_LANG" > "$TARGET_FILE"

echo "Translated: $SOURCE_FILE → $TARGET_FILE"
```

### 2. VSCode Extension / VSCode 扩展

- **i18n Ally**: Manages translations
- **Markdown All in One**: TOC generation
- **markdownlint**: Consistent formatting

### 3. Pre-commit Hook / 提交前钩子

```bash
# .git/hooks/pre-commit
# Check if .zh.md exists for important docs
# 检查重要文档是否有 .zh.md 版本

for file in $(git diff --cached --name-only | grep -E 'README|CHANGELOG'); do
  if [[ $file == *.md ]] && [[ $file != *.zh.md ]]; then
    ZH_FILE="${file%.md}.zh.md"
    if [ ! -f "$ZH_FILE" ]; then
      echo "⚠️  Warning: Missing Chinese version: $ZH_FILE"
    fi
  fi
done
```

---

## ✅ Final Recommendation / 最终建议

**For this project**: Use **separate files with `.zh.md` suffix**

**本项目使用**：带 `.zh.md` 后缀的**分离文件**

### Quick Action Plan / 快速行动计划

1. ✅ Keep existing English docs as-is / 保持现有英文文档
2. 📝 Create `.zh.md` versions for important docs / 为重要文档创建 `.zh.md` 版本
3. 🔗 Add language switcher links at the top / 在顶部添加语言切换链接
4. 📊 Update index table to show both versions / 更新索引表显示两个版本
5. 🚀 Commit both languages together / 一起提交两种语言

### Priority for Translation / 翻译优先级

1. **High priority** / 高优先级:
   - README.md → README.zh.md
   - CHANGELOG.md → CHANGELOG.zh.md
   - Main feature logs / 主要功能日志

2. **Medium priority** / 中优先级:
   - Bug reports / Bug 报告
   - Development guides / 开发指南

3. **Low priority** / 低优先级:
   - Internal notes / 内部笔记
   - Work logs / 工作日志

---

**Last Updated**: 2026-01-19
