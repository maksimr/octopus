(function() {
  "use strict";
  var gitDirs, octopus, rootDir;
  rootDir = io.getRuntimeDirectories('plugins/barrel').shift();
  gitDirs = rootDir.readDirectory(true).filter(function(dir) {
    return dir.child(".git").exists();
  });
  octopus = {
    version: "0.6.1",
    directories: gitDirs,
    execute: function(args) {
      var cmd, dirs, fn;
      dirs = args['-directories'] || args['-D'];
      dirs = dirs ? this.directories.filter(function(dir) {
        return dirs.indexOf(dir.leafName) >= 0;
      }) : this.directories;
      cmd = ("" + args) || "status";
      fn = this._call.bind(this, cmd);
      return dirs.forEach(fn);
    },
    _call: function(command, dir) {
      var output, _cwd;
      _cwd = io.cwd;
      try {
        io.cwd = dir.path;
        output = io.system("git " + command);
      } catch (error) {
        output = error;
      }
      dactyl.echomsg("OCTOPUS: " + (dir.leafName.toUpperCase()) + " >> " + output);
      return io.cwd = _cwd;
    }
  };
  group.commands.add(["octopus", "git"], "Git Manager (version " + octopus.version + ")", function(args) {
    return octopus.execute(args);
  }, {
    literal: 0,
    options: [
      {
        names: ["-directories", "-D"],
        description: "Select specific directories",
        type: CommandOption.LIST,
        completer: octopus.directories.map(function(dir) {
          return [dir.leafName, dir.path];
        })
      }
    ]
  });
}).call(this);
