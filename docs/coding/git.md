# Git summary

Git can convert any local system folder into a Git repository. Each machine or location is called a remote, in Git's terminology, each remote may have one or more branches.

When you clone a project, a complete copy of the original remote repository is created locally on your system. Your local copy of the repository contains the entire history of the project files, not just the latest version of project files.

Files in your working directory can be in one of two states: **tracked** or **untracked**. Tracked files are files that were in the last snapshot; they can be unmodified, modified, or staged. Untracked files are everything else.

In order to begin tracking a new file, you use the command `git add <filename>`. If you want to remove a file: `git rm <filename>`

To track file changes in Git, you create a series of project snapshots or **commits**.

Git version control features a branching model to track code changes. A branch is a named reference to a particular sequence of commits.

When doing a `git status`, git compares with the stage: files staged are under the “Changes to be committed” heading. File not staged are under Changes not stated for commit. Any changes done on a file after it was added to the stage, enforce doing a second add operation. 

All Git repositories have a base branch named **main**.

By convention, the master branch in a Git repository contains the latest, stable version of the application source code. To implement a new feature or functionality, create a new branch from the master branch. This new branch, called a feature branch, contains commits corresponding to code changes for the new feature. 

When you use a branch for feature development, you can commit and share your code frequently without impacting the stability of code in the master branch. After ensuring the code in the feature branch is complete, tested, and reviewed, you are ready to merge the branch into another branch, such as the master branch. Merging is the process of combining the commit histories from two separate branches into a single branch.

## Different workflows

A **centralized Git** workflow uses a central Git repository as the single source of record for application code. Developers push code changes directly to the master branch, and do not push commits in other branches to the central repository. Because the workflow results in commits to a single branch only, team members are prone to merge conflicts. It open doors to commit partial or incomplete code changes.

A **feature branch** workflow implements safety mechanisms to protect the stability of code on the master branch. The aim of this workflow is to always have deployable and stable code for every commit on the master branch, but still allow team members to develop and contribute new features to the project.

In a feature branch workflow, each new feature is implemented in a dedicated branch.

The **Forked** repository workflow is often used with large open source projects. With a large number of contributors, managing feature branches in a central repository is difficult. Additionally, the project owner may not want to allow contributors to create branches in the code repository. In this scenario, branch creation on the central repository is limited to a small number of team members. Once forked, clone your repo and add the upstream repository (the one you forked from).  `git remote add upstream <url of the git repository source of your fork>`. It's good practice to regularly sync your work with the upstream repository. To do this, you'll need to use Git on the command line:

```shell
git fetch upstream
or
git merge upstream/master
```

In case the upstream get other Pull Requests, you can rebase to the latest upstream changes, resolving any conflicts. Commits to master will be stored in a local branch, upstream/master.
Merge the changes from upstream/master into your local master branch. This brings your fork's master branch into sync with the upstream repository, without losing your local changes.

```shell
# Be sure to be on your own master branch
git branch
# if needed checkout your master 
git checkout master
# merge the changes
git merge upstream/master
# 
```

Create pull request against the integration branch of the upstream repository.

## Commands summary

* **git config**: Short for “configure,” this is most useful when you’re setting up Git for the first time

```
git config --global user.name "Your Name Here"
```

* **git init**: Initializes a new Git repository. Until you run this command inside a repository or directory, it’s just a regular folder. Only after you input this does it accept further Git commands.

* **git add**: This does not add new files to your repository. Instead, it brings new files to Git’s attention. After you add files, they’re included in Git’s “snapshots” of the repository
* **git rm**: remove from local working directory. If you want to keep the local file use the `git rm --cached` command
* **git status**: Check the status of your repository. See which files are inside it, which changes still need to be committed, and which branch of the repository you’re currently working on

* **git commit**: After you make any sort of change, you input this in order to take a “snapshot” of the repository. Usually it goes git commit -m “Message here.” The -m indicates that the following section of the command should be read as a message. changing the last commit: If you want to try that commit again, you can run commit with the --amend option

```shell
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```
This command takes your staging area and uses it for the commit. If you’ve made no changes since your last commit (for instance, you run this command immediately after your previous commit), then your snapshot will look exactly the same, and all you’ll change is your commit message.

* **git branch**: Working with multiple collaborators and want to make changes on your own? This command will let you build a new branch, or timeline of commits, of changes and file additions that are completely your own.

```shell
# create a local branch from remote branch. So this one will be local branch with tracking
git checkout -b <my-feature-dev> integration
# list the local branch
git branch   
# Remote tracking branches can be viewed with 
git branch -r
# create a local tracking branch
git branch --track hello-kitty origin/hello-kitty
# delete a branch on a remote machine:
git branch -rd origin/registration
```

* **git checkout**: Literally allows you to “check out” a repository that you are not currently inside. This is a navigational command that lets you move to the repository you want to check. You can use this command as git checkout master to look at the master branch. Un-modify a modified file by doing `git checkout -- <filename>`
* **git merge**: When you’re done working on a branch, you can merge your changes back to the master branch, which is visible to all collaborators.
* **git diff** to compare what is in your working directory with what is in your staging area
* **git push**: `git push  [remote-name] [branch-name]`  If you’re working on your local host, and want your commits to be visible online on GitHub as well, you “push” the changes up to GitHub with this command.
`git push -u origin master`
If you and someone else clone at the same time and they push upstream and then you push up- stream, your push will rightly be rejected. You’ll have to fetch their work first and incorporate it into yours before you’ll be allowed to push.
* **git pull**: If you’re working on your local computer and want the most up-to-date version of your repository to work with, you “pull” the changes down from GitHub with this command
it is a shorthand for git fetch followed by git merge FETCH_HEAD.

* **git fetch** : `git fetch origin`, get update from a remote server branch and download to local repository. Not doing a merge. This will fetch any work that has been pushed, and download it to local repository without merging with local work
* **git remote**: to work on the repositories: `git remote -v`: to get the list of remote repository/server part of the configuration. `get remote show origin` to get detail of the origin repo URL.

```shell
# Change the url of repository
git remote set-url origin <url>
```

* `git log -10 --stat`: To see the last 10 commits done on master
* disable using ssl: `git config --global http.sslverify false`

## Branching

Branching means you diverge from the main line of development and continue to do work without messing with that main line. Git encourages a workflow that branches and merges often, even multiple times in a day.

To create a branch and switch to it at the same time, you can run the git checkout command with the -b switch:

```shell
# git branch creates a pointer to the last commit
git branch issue2
# checkout move the HEAD to the branch
git checkout issue2
#can be done with one command:
git checkout -b issue2
```

Any new commit will move the branch forward, because you have it checked out (that is, your HEAD is pointing to it).
It’s important to note that when you switch branches in Git, files in your working directory will change. If you switch to an older branch, your working directory will be reverted to look like it did the last time you committed on that branch. If Git cannot do it cleanly, it will not let you switch at all.

Because a branch in Git is in actuality a simple file that contains the 40 character SHA-1 checksum of the commit it points to, branches are cheap to create and destroy.

If you need to apply fix to existing master branch do a git checkout master and the local working directory is exactly the way it was before you started working on the branch. Then add a new branch as hotfix, work on the code, and proceed to merge it back to the main branch using git merge.

When you try to merge one commit with a commit that can be reached by following the first commit’s history, Git simplifies things by moving the pointer forward because there is no divergent work to merge together — this is called a "fast forward".

When the main branch and the fix branch are at the same level, you should delete the fix branch: `git branch -d hotfix`

Once the work on the branch is done, checkout to the target main branch:

```shell
git checkout master
git merge issue2
git push
```

When development history has diverged from some older point. Because the commit on the branch you’re on isn’t a direct ancestor of the branch you’re merging in, Git has to do some work. In this case, Git does a simple three-way merge, using the two snapshots pointed to by the branch tips and the common ancestor of the two.
Git creates a new snapshot that results from this three-way merge and automatically creates a new commit that points to it: this is a merge-commit and it has two parents. Git determines the best common ancestor to use for its merge base.

When code change applies to the same source code, conflict may happen and the merge will not be automatic. `git status` helps to assess where the merge-commit stopped. Anything that has merge conflicts and hasn’t been resolved is listed as `unmerged`.

After you’ve resolved each of these sections in each conflicted file, run git add on each file to mark it as resolved

Stashing takes the dirty state of your working directory — that is, your modified tracked files and staged changes — and saves it on a stack of unfinished changes that you can reapply at any time.

## Get SSH key for github account


## Webhook

Webhooks help to get applications to subscribe to events on GitHub. When one of those events is triggered, github'll send a HTTP POST payload 
to the webhook's configured URL.

Webhooks can be installed on an organization, a specific repository. To set up a webhook, go to the settings page
 of your repository or organization. From there, click Webhooks, then Add webhook.


## VS Code git plugin

Palette includes: git: clone, git... 

VS Code can initialize a folder as local git repository.

VS Code handles the pull and push Git operations when you synchronize your local repository to the remote repository.

The Source Control view compares your local repository with the corresponding remote repository. If there are commits to download from the remote repository, then the number of commits displays with a download arrow icon

## Tags

Tag helps to create code release. In the github pages, tags are visible in the release folder.

```shell
# create a local tag
git tag <tagname>
# When pushing to your remote repo, tags are NOT included by default. You will need to explicitly say that you want to push your tags to your remote repo:
git push origin —tags
# or
git push origin <tagname>
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
# delete master
git branch -D master
# rename temp branch to master
git branch -m master
git push -f origin master
```

## More reading

* [Getting started](http://git-scm.com/book/en/Getting-Started)
* [Git Branching Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
* [Gitlab](http://www.gitlab.com)
* [Eclipse EGit](http://wiki.eclipse.org/EGit)