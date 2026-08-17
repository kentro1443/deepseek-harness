# Agent Note: Fork README 实现清单

Status: implemented

[English](2026-08-17-fork-readme-implementation-catalog.md) | 中文

## Problem

本 checkout 是个人 fork。产品优先的根 README 描述的是上游 DeepSeek Harness，并不会告诉作者自己的哪些提交真正落在这里。如果 agent 只刷新陈旧的产品声明，就不会记录一次新的作者提交，读者也就看不到对应功能。

## Decision

本 fork 的根 `README.md` 是 Nguyen Ba Huan 所提交实现的清单，正文只包含这些实现。每次此类提交都要在同一次改动里更新该清单，让读者能看到这次提交及其交付的功能。中文对侧文件保持对齐，并重新记录配对。根 `AGENTS.md` 承载这条常驻指令。

官方 DeepSeek Harness 产品 README 策略对那个仓库仍然是[产品优先的根 README](2026-07-22-product-first-root-readme.md)。本 fork 的清单只是本地覆盖该页的职责，并不是改写上游的入门路径。

## Alternatives considered

**保留产品优先的 README，另加一节 changelog。** 作者要求 README 只包含自己的实现。混合页面仍会以上游产品文案开篇。

**把清单放进 Agent Note 或 CONTRIBUTING。** 作者指定根 README 作为读者在提交后应查看的位置。

**只在被要求时才更新 README。** 这条常驻指令的作用，就是让 agent 在没有再次提示的情况下记录每一次作者提交。

## Consequences

根 README 不再是本 fork 的产品入门页。上游合并若重写 `README.md`，会与该清单冲突，必须把清单恢复回来。每次作者提交都要做一次有界的 README 编辑，以便最新功能保持可见。
