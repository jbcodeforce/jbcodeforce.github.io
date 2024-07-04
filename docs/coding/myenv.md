# Docker based environments

## Different development CLI

* Build a dev image

```sh
 docker build -f Dev-Dockerfile -t j9r/dev-env .
```

* Run it to access to git client

```sh
docker run -ti -v $(pwd):/home/me j9r/dev-env bash
```

* Use it for git commands.

```sh
git config --global user.email "..."
git config --global user.name jbcodeforce
```

## Python / Machine Learning

For Python environment, see the [ML repository](https://github.com/jbcodeforce/ML-studies)

## VSCode

* [Product doc](https://code.visualstudio.com/docs)
* [Beginner guide]()
* [Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

* Ctrl+shift P to open command palette 
* Ctrl K + ctrl T for changing the theme for all windows

Settings are at user level, so for all workspace and windows, or at workspace level.

* [Command short cut sheet Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)  [mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)
* [Article on theme customization per workspace](https://medium.com/@juris.savos/setting-a-per-project-colour-scheme-in-vscode-89cc5836b1de) and [theme color](https://code.visualstudio.com/api/references/theme-color)

Assess heme like atom light and icon theme like material icon.
