# Git summary

Git can convert any local system folder into a Git repository. Each machine or location is called a remote, in Git's terminology, each remote may have one or more branches.

## Core Concepts 

### Repository Setup
```bash
# Authentication (one-time setup)
git config --global user.name "Your Name Here"
git config --global user.email "MY_NAME@example.com"

# Clone repository
git clone <repository-url>
```

This information is persisted in $HOME/.gitconfig. It is possible to use different .gitconfig and reference it with the environment variable:

```sh
export  GIT_CONFIG_GLOBAL=~/.mygitconfig
```

When you clone a project, the local copy of the repository contains the entire history of the project files, not just the latest version of project files.

Files in the working directory can be in one of two states: **tracked** or **untracked**. Tracked files are files that were in the last snapshot; they can be unmodified, modified, or staged. Untracked files are everything else.

In order to begin tracking a new file, you use the command `git add <filename>`. If you want to remove a file: `git rm <filename>`

To track file changes in Git, you create a series of project snapshots or **commits**.

### Daily Operations

```bash
# Stage and commit changes
git add <filename>          # Stage specific file
git add .                   # Stage all changes
git commit -m "message"     # Commit staged changes
git commit -am "message"    # Stage and commit in one step

# Sync with remote
git fetch origin           # Download updates without merging
git pull                   # Fetch and merge
git push origin main       # Push to remote branch
```

### Branching

Git version control features a branching model to track code changes. A branch is a named reference to a particular sequence of commits. All Git repositories have a base branch named **main**.

```bash
# Create and switch to branch
git checkout -b feature-branch

# Switch branches
git checkout main
git checkout feature-branch

# Merge and cleanup
git merge feature-branch
git branch -d feature-branch  # Delete merged branch
```

By convention, the main branch in a Git repository contains the latest, stable version of the application source code. To implement a new feature or functionality, create a new branch from the main branch. This new branch, called a feature branch, contains commits corresponding to code changes for the new feature. 

When you use a branch for feature development, you can commit and share your code frequently without impacting the stability of code in the main branch. After ensuring the code in the feature branch is completed, tested, and reviewed, you are ready to merge the branch into another branch, such as the main branch. Merging is the process of combining the commit histories from two separate branches into a single branch.

## Different development workflows

A **centralized Git** workflow uses a central Git repository as the single source of record for application code. Developers push code changes directly to the main branch, and do not push commits in other branches to the central repository. Because the workflow results in commits to a single branch only, team members are prone to merge conflicts. It open doors to commit partial or incomplete code changes. Code is always on the most updated features so may be unstable.

A **feature branch** workflow implements safety mechanisms to protect the stability of code on the main branch. The aim of this workflow is to always have deployable and stable code for every commit on the main branch, but still allow team members to develop and contribute new features to the project. We can add a second main trunk, `development` or `dev` to support coding for the next software release. And feature branches can be done from this development branch. 

In a feature branch workflow, each new feature is implemented in a dedicated branch. 

The **Forked** repository workflow is often used with large open source projects. With a large number of contributors, managing feature branches in a central repository is difficult. Additionally, the project owner may not want to allow contributors to create branches in the code repository. In this scenario, branch creation on the central repository is limited to a small number of team members. Once forked, clone your repo and add the upstream repository (the one you forked from).  `git remote add upstream <url of the git repository source of your fork>`. It's good practice to regularly sync your work with the upstream repository. To do this, you'll need to use Git on the command line:

```shell
git fetch upstream
or
git merge upstream/main
```

In case the upstream get other Pull Requests, you can rebase to the latest upstream changes, resolving any conflicts. Commits to `main` will be stored in a local branch, `upstream/main`.
Merge the changes from `upstream/main` into your local main branch. This brings your fork's main branch into sync with the upstream repository, without losing your local changes.

### Gitflow workflow

Some major concepts of gitflow:

* Use of feature branches and multiple primary branches. It uses two branches to record the history of the project: main and develop for example.
* The **main** branch stores the official release history, and the **develop** branch serves as an integration branch for features
* Has numerous, longer-lived branches and larger commits
* merge happens when feature is complete to the develop branch.
* can introduce  conflicting updates.
* tag all commits in the main branch with a version number.
* Once develop has acquired enough features for a release, fork a **release** branch off of `develop`. Once Release is ready to ship, the `release` branch gets merged into `main` and tagged with a version number. It has to be merged back into develop, which may have progressed since the release was initiated. 


Commits are done on the current checked out branch. If by any bad chance you have committed changes to the wrong branch, create the new branch, reset the master branch back to before these commits, then switch to the new branch and then commit:

```sh
git reset abc5b0de1 --hard
```

```
MA --- MB --- MC --- FA --- FB --- FC <- main

git checkout -b feature

MA --- MB --- MC --- FA --- FB --- FC <- feature
                                    ^
                                    |
                                  main

git branch -f master MC

MA --- MB --- MC --- FA --- FB --- FC <- feature
               ^
               |
             main
```

* **git checkout**: Literally allows you to “check out” a repository that you are not currently inside. This is a navigational command that lets you move to the repository you want to check. You can use this command as `git checkout main` to look at the main branch. Un-modify a modified file by doing `git checkout -- <filename>`
* **git merge**: When you’re done working on a branch, you can merge your changes back to the main branch, which is visible to all collaborators.
* **git diff** to compare what is in your working directory with what is in your staging area
* **git push**: `git push  [remote-name] [branch-name]`  If you’re working on your local host, and want your commits to be visible online on GitHub as well, you “push” the changes up to GitHub with this command. `git push -u origin main`. If you and someone else clone at the same time and they push upstream then any push up-stream, will rightly be rejected. You’ll have to fetch their work first and incorporate it into yours before you’ll be allowed to push.
* **git pull**: If you’re working on your local computer and want the most up-to-date version of your repository to work with, you “pull” the changes down from GitHub with this command. It is a shorthand for `git fetch ` followed by `git merge FETCH_HEAD`.

* **git fetch** : `git fetch origin`, get update from a remote server branch and download to local repository. Not doing a merge. This will fetch any work that has been pushed, and download it to local repository without merging with your local work.
* **git remote**: to work on the repositories: `git remote -v`: to get the list of remote repository/server part of the configuration. `get remote show origin` to get detail of the origin repo URL.

```shell
# Change the url of repository
git remote set-url origin <url>
```

* `git log -10 --stat`: To see the last 10 commits done on main
* disable using ssl: `git config --global http.sslverify false`
* In case the push did not return and hangs, it may be a problem of buffer size, then use `git config http.postBuffer 524288000`.

### Signing commits

[See product documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) with [define signing key with git](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key) and to be summarized as:

```sh
git config commit.gpgsign true
# define a key with gpg
# Get the list of secret
gpg --list-secret-keys --keyid-format=long 
/Users/jerome/.gnupg/pubring.kbx
--------------------------------
sec   rsa4096/E698B.... 2025-05-28 [SC]
      09B1.....F8583
uid                 [ultimate] <jboyer@.....com>

# define user signing key
git config --global user.signingkey E698B...
# or git config user.signingkey. for local to the repo.
# sign a commit with -S
git commit -S -am "a message"
# Be sure that the gpg key is defined in git server. Extract the public key using
gpg --armor --export E698B..
```

## Practices

* Link a commit to an issue to close it. The commit message need to just include one of the following:

```
fix #xxx
fixes #xxx
fixed #xxx
close #xxx
closes #xxx
closed #xxx
resolve #xxx
resolves #xxx
resolved #xxx
```

* Verify the config:  `git config list`
* Get the list of commits
      ```sh
      git log

      # look at lost commits
      git fsck --lost-found
      ```

## Get SSH key for github account

* Use OpenSSH client, which comes pre-installed on GNU/Linux, MacOS, and Windows 10 to define public key. Existing ssh keys are under `.ssh/` folder. The file `id_rsa.pub` is the public key for RSA encrypted key.
      ```sh
      # verify keys
      gh ssh-key list
      ```

* If needed, generate key with:
      ```sh
      ssh-keygen -t rsa -b 2048 -C "email@address.here" -f ~/.ssh/id_ed25519_...e -N ""
      # add the key
      ssh-add ~/.ssh/id_ed25519_jbcodeforce
      # Verify
      ssh-add -l
      ```

* add this new key to your jbcodeforce GitHub account  
      ```sh
      gh ssh-key add ~/.ssh/id_ed25519_jbcodeforce.pub --title "MacBook SSH Key - jbcodeforce"
      ```

* Add a configuration in .ssh/config
      ```
      Host github.com-jbcode
            HostName github.com
            AddKeysToAgent yes
            UseKeychain yes
            IdentityFile ~/.ssh/id_ed25519_jbcodeforce
            IdentitiesOnly yes
      ```

* It may be necessary to update the ssh agent with:
      ```sh
      eval "$(ssh-agent -s)"
      ```

* Also to use the private key to any git command do something like:
      ```sh
      GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa -o IdentitiesOnly=yes' git clone git@github.com:...
      GIT_SSH_COMMAND='ssh -i ~/.ssh/id_rsa -o IdentitiesOnly=yes' git push git@github.com
      ```

## Webhook

Webhooks help to get applications to subscribe to events on GitHub. When one of those events is triggered, github'll send a HTTP POST payload 
to the webhook's configured URL.

Webhooks can be installed on an organization, a specific repository. To set up a webhook, go to the settings page
 of your repository or organization. From there, click Webhooks, then Add webhook.


## Tags

If we want to mark a specific point in our history as a particular version, that’s what tags are for.

Tag helps to create code release. In the github pages, tags are visible in the release folder.

```shell
# create a local tag
git tag <tagname>
# When pushing to your remote repo, tags are NOT included by default. You will need to explicitly say that you want to push your tags to your remote repo:
git push origin —tags
# or
git push origin <tagname>
```

## Release management

[Git release management](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) helps to bundle release notes, binary files and code. For better release management the simplest workflow includes:

* Adopt Semantic Versioning: Major.Minor.Patch
* When doing python project use the pyproject.toml to configure the project and maintenance. [See the Python Semantic Release project and module](https://python-semantic-release.readthedocs.io/en/latest/).
* Adopt features or bug fixes on separate branches. Merge within `main` using Pull Requests.

???- info "The Python Semantic Release cli quick summary"
      ```sh
      # Update the pyproject.toml with PSR configuration:
      semantic-release generate-config --pyproject >> pyproject.toml
      # Run the command in no-operation mode to see what would happen
      semantic-release -v --noop version
      ```

## Removing sensitive data

Removing sensitive data from repo by using PGP and the filter approach from here [removing-sensitive-data-from-a-repository](https://docs.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository)

```shell
bgp -D mm2.properties
git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

Can also remove all the commit history using:

```shell
git checkout --orphan TEMP_BRANCH
git add -A
git  commit -am "New initial commit"
# delete main
git branch -D main
# rename temp branch to main
git branch -m main
git push -f origin main
```

## More reading

* [Getting started](http://git-scm.com/book/en/Getting-Started)
* [Git Branching Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
* [Gitlab](http://www.gitlab.com)
* [Eclipse EGit](http://wiki.eclipse.org/EGit)
* [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)