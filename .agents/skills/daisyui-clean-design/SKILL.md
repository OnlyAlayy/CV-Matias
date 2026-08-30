---
name: daisyui-clean-design
description: Skill to refactor and clean generic AI-generated Tailwind UI code by applying clean and semantic DaisyUI components.
---

# DaisyUI Clean Design Skill

This skill is designed to take generic, bloated, AI-generated TailwindCSS code and refactor it into clean, maintainable DaisyUI components.

## Rules for Refactoring:

1.  **Remove Utility Bloat**: Replace long chains of Tailwind classes (like `bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`) with semantic DaisyUI classes (like `btn btn-primary`).
2.  **Use Semantic Components**: Identify common UI patterns (Cards, Modals, Navbars, Buttons, Badges, Inputs, Forms, Hero, Stats) and convert them to their corresponding DaisyUI components.
3.  **Color Variables**: Do not use hardcoded colors (`text-gray-500`, `bg-white`, `bg-gray-900`). Use DaisyUI's semantic color classes (`text-base-content`, `text-base-content/70`, `bg-base-100`, `bg-base-200`, `bg-base-300`, `bg-primary`).
4.  **Layout**: Retain standard Tailwind grid and flex utilities for layout, but rely on DaisyUI for the component styling itself.
5.  **Typography**: Use standard Tailwind typography plugins (`prose`) or basic Tailwind text sizes, but align colors with the DaisyUI theme.
6.  **Remove Inline Styles**: Never use inline styles or arbitrarily specific arbitrary values (e.g. `w-[312px]`) unless strictly necessary.

## Execution Steps:

1. Analyze the target file(s) for bloated Tailwind code.
2. Identify the logical UI components being used.
3. Replace the utility classes with the corresponding DaisyUI classes.
4. Verify that the UI structure, dark mode compatibility (via DaisyUI themes), and responsiveness are maintained.
