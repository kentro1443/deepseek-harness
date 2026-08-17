# Agent Note: 对话变更审查标签页与 Git 差异面板

Status: implemented

[English](2026-08-23-chat-review-changes-diff-panel.md) | 中文

## 问题

在与助手对话并进行文件修改时，用户缺乏统一的入口来在右侧面板中审阅整个会话的文件变更或查看聚合的 Git 差异。先前仅在单个工具调用行中单独呈现 diff 卡片，难以在全局视角进行改动审查。

## 决策

**新增变更审查（Review Changes）特性，包含右侧 Git 差异面板与页头操作按钮。**

1. **页头操作与选择目标**：
   - 向 `conversation.session.header.utilities` 插槽注册 `ReviewChangesAction`。
   - 当当前会话存在文件变更时显示“变更”按钮及总增加/删除行数（`+A -B`）。
   - 点击该按钮触发带审查选择目标（`toolName: 'review'`）的 `openDetails` 调用，展开右侧 Details 栏。

2. **Details 面板中的 Git 差异视图**：
   - 增强 `DetailsPanel` 以处理 review 选择目标。
   - 经由 `collectSessionDiffs` 汇总当前会话所有节点的改动文件与行数统计。
   - 渲染包含分支信息、改动文件数以及基于 `DiffBlock` 的逐文件 diff 卡片。

3. **Turn Tail 产物行集成**：
   - 更新 `@deepseek-ai/dsh-client-ui-deliverables` 包中的 `ProducedFiles`，使其呈现包含“已编辑 N 个文件”、“撤销”与“审查”按钮的卡片页头。
   - 点击“审查”按钮同样触发右侧 Details 面板的审查模式。

## 替代方案考量

**仅依赖单次工具调用的 diff 卡片。** 否决：在多轮对话中修改多个文件的用户需要一个集中面板以在提交或执行下一步前审查所有变更。

**打开全屏弹窗式 diff 视图。** 否决：侧边栏面板布局能在审阅文件 diff 的同时保留对话上下文。

## 影响

用户现在可以从对话 Turn 产物卡片与页头工具区域便捷审查全局文件变更，获得类似现代 AI 编程助手的统一 Git 差异面板体验。
