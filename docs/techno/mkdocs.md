# Mkdocs material quick summary

This note is a quick summary of how [this mkdocs-material site](https://squidfunk.github.io/mkdocs-material/) is built, and how it is applied to these sites:

* [EDA]()
* [EDA tech academy]()

## features

the mkdocs.yaml includes features and extension declarations. See [this note for reference.](https://squidfunk.github.io/mkdocs-material/reference/) Some interesting ones:

* **meta** for title and description inside md file
* "navigation.tabs" for having the top navigation as tab bar.
* "abbr": adds the ability to add a small tooltip to an element
* "Admonition"  adds support for call-outs: like notes, warning...
* "pymdownx.snippets":  adds the ability to embed content from arbitrary files into a document

## Extending theme

* add an overrides folder.

## notes

* Each page can have a template reference if using extending theme

```
---
template: overrides/main.html
title: Insiders
---
```