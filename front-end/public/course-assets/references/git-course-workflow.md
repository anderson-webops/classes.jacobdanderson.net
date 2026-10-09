# Git and GitHub for Course Projects

Use this optional walkthrough after a small project runs. Work in a personal
practice copy. Keep the learner attempt and complete reference in separate
folders; a reference is a comparison aid after an attempted explanation.

## Find the correct files

A repository contains files and their change history. Git records that history
locally; GitHub hosts repositories for sharing and review. A course link may
point to the whole repository, a folder or one file. Read the path and README
before opening it. Select `starter/` for the learner task and `solution/` for the
reference. Some lessons supply only a reference; do not assume every folder is
an unfinished assignment. [GitHub glossary](https://docs.github.com/en/get-started/learning-about-github/github-glossary).

For a simple download, use **Code > Download ZIP** on the repository page,
extract it and find the linked folder. The ZIP has no Git history. To practice
history, use **Code** to copy the repository's clone URL, then run `git clone`
with that URL in the terminal. Open the resulting folder, not the ZIP itself.
The website's **Start in IDE** action imports supported project files after
confirmation; it creates an editable project, not a local Git clone.

## Save one deliberate checkpoint

In a cloned practice repository, edit one learner file and run its checks.
For this demonstration, choose a file named `main.py`; substitute the actual
relative filename for another project. Read the result after each command:

```sh
git status
git diff -- main.py
git add -- main.py
git diff --cached -- main.py
git commit -m "Correct score reset"
git status
```

`status` lists pending changes; `diff` shows the edit. `add` selects the file's
current content for the next checkpoint. The cached diff checks that selection.
A commit records the selected changes in local history. If more edits follow
staging, inspect and stage the intended version again. This example records no
remote publication. [Pro Git checkpoint walkthrough](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository).

## Sharing and forks

A fork is a repository copy under another GitHub owner, useful for independent
changes and proposed contributions. Clone the fork when a lesson asks for one.
Publishing commits with `git push` requires access to the destination. Confirm
the account, destination, visibility and chosen changes before publishing.

Public visibility allows viewing; it does not by itself supply a general reuse
license. Read the repository's license and course sharing rules before reusing
or publishing material. Keep personal details, credentials and private class
records out of practice repositories. [GitHub licensing reference](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

## Reading and instructor checkpoints

Identify the source folder and the learner task. Predict one small change,
make it, run it and inspect the diff. Save a local checkpoint. Explain the
difference between a ZIP, an IDE import, a clone, a commit and a push. Reopen
the saved files and confirm that they contain the tested change. An instructor
can pause at each step and ask for the prediction before showing the result.
