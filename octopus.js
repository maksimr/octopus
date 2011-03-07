/* AUTHOR:  Maksim Ryzhikov
 * NAME:    octopus
 * VERSION: 0.1
 *
 * This plugin allow you manage git's commands
 * this commands will be distributed on all direcotry located in *barrel* directory,
 * full path (~/.pentadactyl/plugins/barrel)
 * each of them should be under git.
 *
 */

var app = dactyl.plugins.app;
var cmd = "status";

commands.add(["octo[pus]"], "Git Mannager", function (args) {
	//check on input command by user
	if (args['-command']) {
		cmd = args['-command'];
	}
	var dir = app.ccDir();//Get home directory
	app.append(dir, ".pentadactyl", "plugins", "barrel");//Git plugins path
	var array = app.ls(dir); //get plugins directory
	for (var i = 0; i < array.length; i++) {
		var file = array[i].clone();
		app.append(file, ".git");
		if (file.exists()) { //check on git init
			var path = array[i].path;
			/*
			 * constructed git command
			 */
			var git_dir_path = ((path.search(/\\/) != -1) ? path + "\\": path + "/") + ".git";
			var st = "git --git-dir=" + git_dir_path + " --work-tree=" + path + " " + cmd;
			var result = dactyl.modules.io.system(st);
			dactyl.echomsg("OCTOPUS:»» " + result);
		}
	}
},
{
	options: [[["-command"], commands.OPTION_STRING]]
});
