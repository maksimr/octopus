/* AUTHOR:  Maksim Ryzhikov
 * NAME:    octopus
 * VERSION: 0.2
 *
 * This plugin allow you manage git's commands
 * this commands will be distributed on all directory located in *barrel* directory,
 * full path (~/.pentadactyl/plugins/barrel)
 * each of them should be under git.
 *
 * OPTIONS: directory
 *
 */

var app = dactyl.plugins.app;

var OCTOPUS = {
	command: "status",
	rootPath: function(homeDir){
		var dir = homeDir||app.ccDir(); //Get home directory
		app.append(dir, ".pentadactyl", "plugins", "barrel"); //Git plugins path
		return dir;//nsIFile
	},
	directory: function () {
	 return app.ls(this.rootPath()); //get plugins directory
	},
	initialize: function (dirs) {//dirs is arrays nsIFile
		var d = dirs||this.directory();
		app.forEach(d,function(f){
			var file = f.clone();
			app.append(file, ".git");
			if (file.exists()) { //check on git init
				this.exec(f);
			}
		},this);
	},
	exec: function(dir){//dir is nsIFile
		var path = dir.path,result;//path for dir
		var git_dir_path = ((path.search(/\\/) != -1) ? path + "\\": path + "/") + ".git";//complete git path
		var st = "git --git-dir=" + git_dir_path + " --work-tree=" + path + " " + this.command; //constructed git command
		try{
			result = dactyl.modules.io.system(st);//exec command
		}catch(e){ 
			result = e;
		}
		dactyl.echomsg("OCTOPUS:" + dir.leafName.toUpperCase() + " »» " + result);
}};

group.commands.add(["octo[pus]"], "Git Mannager", function (args) {
	var dirs = null;
	if (args['-directory']||args['-D']) {
		var dirname = args['-directory']||args['-D'], root = OCTOPUS.rootPath();
		app.append(root,dirname);
		dirs = [root];
	}
	OCTOPUS.command = args.join(' ')||"status";
	OCTOPUS.initialize(dirs);
},
{
	options: [{
		names: ["-directory", "-D"],
		description: "Select specific directory",
		type: commands.OPTION_STRING,
		completer: function (context) {
		var array = OCTOPUS.directory(),
	 	compl=[];
		app.forEach(array,function(dir){
			compl.push(dir.leafName);
		},this);
		context.completions = [[dir,''] for each (dir in compl)];
	}}]
});
