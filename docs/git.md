# Git summary

Git can convert any local system folder into a Git repository.

When you clone a project, a complete copy of the original remote repository is created locally on your system. Your local copy of the repository contains the entire history of the project files, not just the latest version of project files.

Files in your working directory can be in one of two states: tracked or untracked. Tracked files are files that were in the last snapshot; they can be unmodified, modified, or staged. Untracked files are everything else.

In order to begin tracking a new file, you use the command git add <filename>. If you want to remove a file: git rm <filename>

To track file changes in Git, you create a series of project snapshots or **commits**.

Git version control features a branching model to track code changes. A branch is a named reference to a particular sequence of commits.

When doing a git status, git compares with the stage: files staged are under the “Changes to be committed” heading. File not staged are under Changes not stated for commit. Any changes done on a file after it was added to the stage, enforce doing a second add operation. 

All Git repositories have a base branch named **main**.

By convention, the master branch in a Git repository contains the latest, stable version of the application source code. To implement a new feature or functionality, create a new branch from the master branch. This new branch, called a feature branch, contains commits corresponding to code changes for the new feature. 

When you use a branch for feature development, you can commit and share your code frequently without impacting the stability of code in the master branch. After ensuring the code in the feature branch is complete, tested, and reviewed, you are ready to merge the branch into another branch, such as the master branch. Merging is the process of combining the commit histories from two separate branches into a single branch.

### Different workflows

A **centralized Git** workflow uses a central Git repository as the single source of record for application code. Developers push code changes directly to the master branch, and do not push commits in other branches to the central repository. Because the workflow results in commits to a single branch only, team members are prone to merge conflicts. It open doors to commit partial or incomplete code changes.

A **feature branch** workflow implements safety mechanisms to protect the stability of code on the master branch. The aim of this workflow is to always have deployable and stable code for every commit on the master branch, but still allow team members to develop and contribute new features to the project.

In a feature branch workflow, each new feature is implemented in a dedicated branch.


The **Forked** repository workflow is often used with large open source projects. With a large number of contributors, managing feature branches in a central repository is difficult. Additionally, the project owner may not want to allow contributors to create branches in the code repository. In this scenario, branch creation on the central repository is limited to a small number of team members. 

## Commands summary

* **git config**: Short for “configure,” this is most useful when you’re setting up Git for the first time

```
git config --global user.name "Your Name Here"
```

* **git init**: Initializes a new Git repository. Until you run this command inside a repository or directory, it’s just a regular folder. Only after you input this does it accept further Git commands.

* **git add**: This does not add new files to your repository. Instead, it brings new files to Git’s attention. After you add files, they’re included in Git’s “snapshots” of the repository

* **git status**: Check the status of your repository. See which files are inside it, which changes still need to be committed, and which branch of the repository you’re currently working on

* **git commit**: After you make any sort of change, you input this in order to take a “snapshot” of the repository. Usually it goes git commit -m “Message here.” The -m indicates that the following section of the command should be read as a message

* **git branch**: Working with multiple collaborators and want to make changes on your own? This command will let you build a new branch, or timeline of commits, of changes and file additions that are completely your own.
* **git checkout**: Literally allows you to “check out” a repository that you are not currently inside. This is a navigational command that lets you move to the repository you want to check. You can use this command as git checkout master to look at the master branch. Un-modify a modified file by doing `git checkout -- <filename>`
* **git merge**: When you’re done working on a branch, you can merge your changes back to the master branch, which is visible to all collaborators.
* **git diff** to compare what is in your working directory with what is in your staging area
* **git push**: `git push  [remote-name] [branch-name]`  If you’re working on your local host, and want your commits to be visible online on GitHub as well, you “push” the changes up to GitHub with this command.
`git push -u origin master`
* **git pull**: If you’re working on your local computer and want the most up-to-date version of your repository to work with, you “pull” the changes down from GitHub with this command
it is a shorthand for git fetch followed by git merge FETCH_HEAD.

* **git fetch** : `git fetch origin`, get update from a remote server branch and download to local repository. Not doing a merge. This will fetch any work that has been pushed, and download it to local repository without merging with local work
* **git remote**: to work on the repositories: `git remote -v`: to get the list of remote repository/server part of the configuration. `get remote show origin` to get detail of the origin repo URL.

* `git log -10 --stat`: To see the last 10 commits done on master


## VS Code git plugin

Palette includes: git: clone, git... 

VS Code can initialize a folder as local git repository.

VS Code handles the pull and push Git operations when you synchronize your local repository to the remote repository.

The Source Control view compares your local repository with the corresponding remote repository. If there are commits to download from the remote repository, then the number of commits displays with a download arrow icon