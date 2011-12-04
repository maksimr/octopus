octopus.js
============

This plugin allow you manage git's commands
this commands will be distributed on all directory located in `barrel` directory,
full path (~/.pentadactyl/plugins/barrel) each of them should be under git.

If you want to use the command only for specific directories,
you must define option -directories shortcut -D and
select some directories

How it use
----------

[More information about git ...](http://git-scm.com/)

* Status
  * Show the working tree status
* Diff
  * Show changes between commits, commit and working tree, etc
* Fetch
  * Download objects and refs from another repository
* Merge
  * Join two or more development histories together
* Push
  * Update remote refs along with associated objects Updates remote refs using local refs, while sending objects necessary to complete the given refs.  You can make interesting things happen to a repository every time you push into it, by setting up hooks there.

----------

```git
  fetch [options] [repository [refspec…]]
  fetch [options] group
  fetch --multiple [options>] [(repository | group)…]
  fetch --all [options]
```

```git
  git merge [-n] [--stat] [--no-commit] [--squash] [-s strategy] [-X strategy-option] [--[no-]rerere-autoupdate] [-m msg] commit…
  git merge msg HEAD commit…
  git merge --abort
```

```vim
  "Execute command for all folders:
  :git status
  :git fetch origin master
```

```vim
  "Fetch only for directory octopus:
  :git -D octopus fetch origin master
```


Installation
------------

You must have git is installed on your system.
Then download this file and put it in pentadactyl's plugins or barrel folders

Windows

Define git on "Windows". You must download "Git" from http://git-scm.com/
and add in "Environment Variables" %PATH%
('System Properties' 'Environment Variables' 'System variables' 'Path') path to git
example C:\Program Files\Git\bin and restart computer.



(version: 0.6.1) maksimr
