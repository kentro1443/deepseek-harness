# Fork 实现

[English](README.md) | 中文

本 README 只列出 Nguyen Ba Huan 在本 checkout 中交付的实现。该作者每次新提交后，都要新增或刷新对应章节，让读者能看到这次提交改了什么。

## Review Changes 标签页与 git diff 面板

`6c9f6d483f` — `feat(ui): add review changes tab and git diff panel`

只要当前会话存在文件 diff，会话标题栏就会显示 Changes 操作，并带上会话范围的 `+additions` / `-deletions`。点击该操作，或点击一轮里已编辑文件卡片上的 Review，会在详情面板打开 review 目标：把会话中的全部 diff 汇总成按文件排列的 `DiffBlock` 卡片，并显示分支与变更计数。决策记录：[会话 Review Changes](.agents/notes/implemented/feature/2026-08-23-chat-review-changes-diff-panel.md)。

## Composer 提供方分组展开

`592569ea15` — `feat(ui-model-selection): collapse composer model list by provider`

Composer 模型菜单里的每个提供方分组都是展开控件：标题是带 `aria-expanded` 的 `menuitem`，还有 chevron 和该组模型数量。当前选中项所属的提供方默认展开；显式切换会保留到菜单关闭；收起的模型不会渲染，因此方向键焦点只在可见行之间移动。决策记录：[Composer 提供方展开](.agents/notes/implemented/feature/2026-08-17-composer-provider-group-disclosure.md)。

## OpenAI 兼容的工具调用 delta

`5a600719a6` — `Add OpenAI compatible capability`

`@deepseek-ai/dsh-llm-deepseek` 中的 `translate()` 仅在 delta 值非空时写入流式工具调用的 `id` 或 `function.name`。因此，在后续分片里重复发送空字符串的 OpenAI 兼容提供方会保留首个 delta 建立的身份，而不会把它覆盖掉。
