#author: maksimr
#name: octopus-coffee
#version: 0.6.1

"use strict"

rootDir = io.getRuntimeDirectories('plugins/barrel').shift()

gitDirs = rootDir.readDirectory(true).filter (dir)->
  dir.child(".git").exists()

octopus =
  version: "0.6.1"
  directories: gitDirs
  execute: (args) ->
    dirs = args['-directories'] or args['-D']
    dirs = if dirs then @directories.filter (dir)-> (dirs.indexOf(dir.leafName) >=0) else @directories
    cmd = args.shift() or "status"
    fn = @_call.bind this, cmd

    dirs.forEach fn
  _call: (command, dir)->
    _cwd = io.cwd
    try
      io.cwd = dir.path
      output = io.system "git #{command}"
    catch error
      output = error
    dactyl.echomsg "OCTOPUS: #{dir.leafName.toUpperCase()} >> #{output}"
    io.cwd = _cwd

#define plugin
group.commands.add ["octopus", "git"], "Git Manager (version #{octopus.version})", (args)->
  octopus.execute(args)
,{
  literal: 0
  argCount: "*"
  options: [{
    names: ["-directories","-D"]
    description: "Select specific directories"
    type: CommandOption.LIST
    completer: octopus.directories.map (dir)-> [dir.leafName, dir.path]
  }]
}
