/* AUTHOR:  Maksim Ryzhikov
 * NAME:    octopus
 * VERSION: 0.5
 * NOTE: Experimental version
 */

(function () {
	var barrel = io.getRuntimeDirectories('plugins/barrel').shift(),

	OCTOPUS = {
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
			cmd = args.shift();

			exDirs.forEach((function (dir) {
				this.run( cmd || 'status', dir);
			}).bind(this));
		},
		run: function (command, dir) {
			var result, st = "git --git-dir='" + dir.child(".git").path + "' --work-tree='" + dir.path + "' " + command;
			try {
				result = dactyl.modules.io.system(st);
			} catch(e) {
				result = e;
			}
			dactyl.echomsg("OCTOPUS:" + dir.leafName.toUpperCase() + " »» " + result);
		}
	};

	group.commands.add(["octopus", "git"], "Git Mannager", function (args) {
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
