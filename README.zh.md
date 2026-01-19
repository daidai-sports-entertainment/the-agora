# Ideology Universe - 交互式哲学与政治思想可视化

**🌐 语言**: **[中文](./README.zh.md)** | [English](./README.md)

探索2500年的思想演进：从古希腊哲学到当代政治理论的互动式可视化。

![Ideology Universe](../comprehensive_visualization.png)

## ✨ 核心功能

### ✅ 已实现（MVP v0.1）

1. **2D时间-语义空间可视化**
   - X轴 = 历史时间（公元前500年 - 2010年）
   - Y轴 = 语义相似度（neural embedding）
   - 71个概念，涵盖古代至当代思想

2. **智能颜色编码**
   - 🔵 蓝色 = 纯哲学概念
   - 🔴 红色 = 纯政治概念
   - 🟣 紫色 = 哲学+政治交叉

3. **核心交互：关系高亮**
   - **点击任意节点** → 自动高亮所有相关节点和连线
   - 其他节点半透明化
   - 一目了然看到思想之间的联系

4. **详细信息面板**
   - 概念描述
   - 关键人物
   - 所属领域
   - 所有关系（类型+描述）

5. **缩放与平移**
   - 鼠标滚轮缩放
   - 拖拽移动画布
   - 点击空白处取消选择

6. **时间轴标注**
   - X轴下方标注主要历史时期
   - 古代、中世纪、启蒙、现代、当代

---

## 📝 更新日志

### 2026-01-05
- 新增中英切换（右侧面板开关），并统一中英文界面文案
- 视觉风格升级：典雅宇宙主题、Lora 字体、面板与背景质感优化
- 交互增强：望远镜式聚焦、右下角缩放与重置控制
- 图例支持多选筛选（Philosophy / Politics / Philosophy + Politics）
- 节点缓慢闪烁与微弱漂浮，强化星空感
- 主画布新增语义提示语（斜体浮层）
- 交叉概念颜色调整为 Cyan-Green，更易区分

---

## 🚀 快速开始

### 前置要求

- Node.js 18+ 和 npm

### 安装

```bash
# 进入项目目录
cd ideology-universe

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`

---

## 📁 项目结构

```
ideology-universe/
├── src/
│   ├── components/
│   │   ├── IdeologyCanvas.jsx    # 主可视化画布（D3.js）
│   │   └── InfoPanel.jsx         # 信息面板
│   ├── hooks/
│   │   └── useGraphData.js       # 数据加载 Hook
│   ├── utils/
│   │   └── colorScheme.js        # 颜色编码逻辑
│   ├── data/
│   │   ├── concept_positions_final.json           # 位置数据
│   │   └── ideology_dataset_comprehensive.json    # 完整概念数据
│   ├── App.jsx                   # 主应用
│   ├── main.jsx                  # 入口
│   └── index.css                 # 全局样式
├── package.json
├── vite.config.js
└── index.html
```

---

## 🎨 设计特色

### 颜色系统

我们使用颜色来区分概念的性质：

- **哲学概念**（如Platonism, Stoicism）→ 蓝色
- **政治概念**（如Liberalism, Fascism）→ 红色
- **交叉概念**（如Marxism, Confucianism）→ 青绿色（Cyan-Green）

这突出了一个关键洞察：**很多思想横跨哲学和政治领域**，这正是思想史的魅力所在。

### 关系类型

可视化展示9种关系类型：

- `influenced_by` / `influenced` - 影响关系
- `opposes` - 对立（红色虚线）
- `similar_to` - 相似
- `evolved_from` - 演化
- `synthesized_with` - 综合
- `foundation_for` - 奠基
- `critiques` - 批判
- `built_on` - 建立于
- `related_to` - 相关

---

## 🧠 技术栈

- **React 18** - UI框架
- **D3.js v7** - 数据可视化
- **Vite** - 构建工具
- **Zustand** - 状态管理（轻量）
- **sentence-transformers** - 语义嵌入（后端Python）

---

## 📊 数据说明

### 数据来源

- `concept_positions_final.json` - 包含每个概念的X/Y坐标
  - X坐标 = 历史时期（era）
  - Y坐标 = 语义相似度（通过UMAP从768维嵌入降维）

- `ideology_dataset_comprehensive.json` - 完整数据
  - 71个概念（新增中世纪、启蒙及现代重要思想）
  - 每个概念包含：description, key_figures, domains, relationships

### 嵌入生成

使用 `all-mpnet-base-v2` 模型生成768维语义嵌入，然后用UMAP降维到2D。

详见 `../generate_embeddings.py`

---

## 🎯 交互示例

### 探索马克思主义的思想网络

1. 点击 **Marxism** 节点（紫色，1850年）
2. 观察高亮的关系：
   - ← 受 **Hegelianism**（蓝色）影响
   - → 形成了 **Socialism**（红色）
   - ⚔️ 对立于 **Capitalism**（红色虚线）
3. 右侧面板显示完整描述和关键人物（Karl Marx）
4. 点击空白处取消，继续探索

### 对比东西方古代哲学

1. 缩放到古代区域（X轴 -500 附近）
2. 观察：
   - **Confucianism**（紫色）- 东方，强调政治伦理
   - **Platonism**（蓝色）- 西方，纯哲学
3. 点击两者查看差异和相似之处

---

## 🔮 未来功能（Roadmap）

### V0.2 - 搜索与过滤
- [ ] 搜索框（自动补全）
- [ ] 时期过滤器（按钮组）
- [ ] 领域过滤器（多选）
- [ ] 关系类型过滤

### V0.3 - 高级交互
- [ ] 影响路径追踪（A → B → C）
- [ ] 对比模式（同时选中多个概念）
- [ ] 预设视图（"古希腊哲学"、"启蒙时代"等）
- [ ] URL分享（编码当前视图状态）

### V0.4 - 美化与优化
- [ ] 浅色/深色模式切换
- [ ] 响应式设计（移动端）
- [ ] 动画过渡
- [ ] 性能优化（Canvas渲染？）

### V1.0 - 完整版
- [ ] 推荐系统（"你可能感兴趣..."）
- [ ] 时间动画（历史演进播放）
- [ ] 导出功能（PNG/SVG）
- [ ] 用户笔记（本地存储）

---

## 🤝 贡献

这是一个开源项目，欢迎贡献！

可以帮助的方向：
- 添加更多概念（当前71个）
- 完善关系描述
- 翻译（英文/中文）
- UI/UX改进
- 性能优化

---

## 📄 许可

MIT License

---

## 🙏 致谢

- **数据来源**：手工整理 + AI辅助
- **嵌入模型**：sentence-transformers (all-mpnet-base-v2)
- **可视化灵感**：D3.js Gallery, Observable

---

## 📞 联系

有问题或建议？欢迎提Issue！
我的邮箱：yd2598@columbia.edu

**Enjoy exploring the universe of ideas! 🌌**
