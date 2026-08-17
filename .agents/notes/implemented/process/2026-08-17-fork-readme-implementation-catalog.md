# Agent Note: Fork README implementation catalog

Status: implemented

English | [中文](2026-08-17-fork-readme-implementation-catalog.zh.md)

## Problem

This checkout is a personal fork. The product-first root README describes upstream DeepSeek Harness and does not tell the author which of their commits actually landed here. Agents that only refresh stale product claims will not record a new author commit so a reader can see the feature.

## Decision

Root `README.md` on this fork is an implementation catalog for commits authored by Nguyen Ba Huan. It contains only those implementations. After each such commit, the same change updates the catalog so a reader can see the commit and the feature it shipped. The Chinese counterpart stays aligned, and the pair is re-recorded. Root `AGENTS.md` carries the standing order.

The official DeepSeek Harness product README policy remains [product-first root README](2026-07-22-product-first-root-readme.md) for that repository. This fork's catalog is a local override of that page's job, not a rewrite of the upstream onboarding path.

## Alternatives considered

**Keep the product-first README and add a changelog section.** The author asked for a README that contains only their implementations. A hybrid page would still lead with upstream product copy.

**Put the catalog in an Agent Note or CONTRIBUTING.** The author named the root README as the place a reader should look after a commit.

**Update the README only when asked.** The standing order exists so an agent records every author commit without another prompt.

## Consequences

The root README is no longer this fork's product onboarding page. Upstream merges that rewrite `README.md` conflict with the catalog and must restore it. Each author commit spends a bounded README edit so the latest feature stays visible.
