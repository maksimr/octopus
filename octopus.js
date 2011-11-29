/* AUTHOR:  Maksim Ryzhikov
 * NAME:    octopus
 * VERSION: 0.6
 */

(function () {
	"use strict";
	var barrel = io.getRuntimeDirectories('plugins/barrel').shift(),

	OCTOPUS = {
    version: "0.6",
		availabelDirectories: (function () {
			return barrel.readDirectory(true).filter(function (dir) {
				return dir.child(".git").exists();
			});
		} ()),
		execute: function (args) {
			var dirs = args['-directories'] || args['-D'],
			exDirs = (dirs ? this.availabelDirectories.filter(function (dir) {
				return dirs.indexOf(dir.leafName) >= 0;
			}) : this.availabelDirectories),
			cmd = (args.shift() || 'status'),
      fn = this.run.bind(this,cmd);

			exDirs.forEach(fn);
		},
		run: function (command, dir) {
			var result, _cwd = io.cwd,
			st = "git " + command;
			try {
				io.cwd = dir.path;
				result = io.system(st);
			} catch(e) {
				result = e;
			}
			dactyl.echomsg("OCTOPUS:" + dir.leafName.toUpperCase() + " »» " + result);
			io.cwd = _cwd;
		}
	};

	group.commands.add(["octopus", "git"], "Git Mannager (version "+OCTOPUS.version+")", function (args) {
		OCTOPUS.execute(args);
	},
	{
		literal: 0,
		argCount: "*",
		options: [{
			names: ["-directories", "-D"],
			description: "Select specific directories",
			type: CommandOption.LIST,
			completer: (function () {
				return OCTOPUS.availabelDirectories.map(function (dir) {
					return [dir.leafName, dir.path];
				});
			} ())
		}]
	});

} ());
