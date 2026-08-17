# Agent Note: Composer model list provider disclosure

Status: implemented

English | [中文](2026-08-17-composer-provider-group-disclosure.zh.md)

## Problem

The composer model seat rendered every advertised model of every provider as one flat scrolling list under sticky provider captions. A provider advertising a large catalog therefore pushed the other providers far below the fold, and the menu's own 360px ceiling turned provider-to-provider comparison into scrolling. The `/model` popup does not share the problem because its shell filters rows by typed text; the seat menu has no filter, so list length is the only thing standing between the user and a provider.

## Decision

**Each provider group in the model pane is a disclosure.** The former caption `<div>` is a `role="menuitem"` button carrying `aria-expanded` and `aria-controls` for its model list, a rotating chevron, the provider name, and the group's model count. A collapsed provider costs one row and still reports how many models it holds.

**The current selection's provider opens by default.** Expansion reads `disclosed[groupId] ?? groupId === current.provider`, so a group absent from the override record follows that default even when it arrives from a load that landed after the menu opened — the directory refreshes on every open, and provider topology can change under a resident menu. Closing the menu drops the overrides, so each open starts from where the session actually is rather than from the previous visit's browsing state.

**Collapsed models leave the menu entirely.** They are not rendered, so the existing arrow-key ring — built from the `itemRefs` registration order — walks provider headers and only the visible options, and a collapsed provider cannot receive focus through a hidden radio.

## Alternatives considered

**A text filter over the flat list.** Rejected for this change: it duplicates the `/model` popup's own affordance inside a 240px menu, and it does not help the user who wants to see which providers exist before naming one. The two are compatible; a filter can land later above the groups.

**Collapse every group by default, including the selected one.** Rejected because the seat's first job is showing where the session is; an all-collapsed pane hides the checked row that answers it.

**A model-count threshold that decides which groups collapse.** Rejected as a hidden tunable — the number would be a deployment-varying choice with no config field behind it, and the resulting menu would expand or collapse for reasons the user cannot see.

**Persist the disclosure state across menu opens.** Rejected because the state would outlive its usefulness with no visible control to reset it, and a stale expansion contradicts the default that points at the current selection.

## Consequences

A user with several providers sees a provider list first and drills into one, and a single-provider session is unchanged apart from a chevron and count on the caption it already had. The seat's keyboard ring now includes provider headers, so arrow traversal of a many-provider directory is shorter while collapsed and identical to before while expanded. Provider names remain presentation-only, and no selection, directory, or wire behavior changes: this is entirely inside `ModelSelect`.
