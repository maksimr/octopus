/* AUTHOR:  Maksim Ryzhikov
 * NAME:    octopus
 * VERSION: 0.2
 */
//INFORMATION {{{
var INFO =
<plugin name="octopus" version="0.2"
    href="https://github.com/maksimr/octopus"
    summary="Octopus: gives you the ability to manage folders under git"
    xmlns={NS}>
    <author email="rv.maksim@gmail.com">Ryzhikov Maksim</author>
    <license href="http://www.gnu.org/licenses/gpl.html">GPL</license>
    <project name="Pentadactyl" minVersion="1.0"/>
    <p>
			This plugin allow you manage git's commands
			this commands will be distributed on all directory located in *barrel* directory,
			full path (~/.pentadactyl/plugins/barrel)
			each of them should be under git.
    </p>
    <p>
			If you want to use the command only for one directory,
			you must define option -directory or shortcut -D and 
			select the directory
    </p>
    <p>
      NOTE: Define git on "Windows". You must download "Git" from <a> http://git-scm.com/ </a>  
      and add in "Environment Variables" %PATH% 
      (System Properties>Environment Variables>System variables>Path) path to git 
      example C:\Program Files\Git\bin and restart computer.
    </p>
    <p>
			BUGS: Yet not possible to use the command "pull",
			you may use combination commands "fetch" and "merge" instead of "pull"
    </p>

		<p>Some available actions.
		More information on <a>http://git-scm.com/</a>
		</p>
		<dl>
			<dt>status</dt> <dd>Show the working tree status</dd>
			<dt>diff</dt> <dd>Show changes between commits, commit and working tree, etc</dd>
			<dt>fetch</dt> <dd>Download objects and refs from another repository</dd>
			<dt>merge</dt> <dd>Join two or more development histories together</dd>
			<dt>push</dt> 
			<dd>
				Update remote refs along with associated objects
				Updates remote refs using local refs, while sending objects necessary to complete the given refs.
				You can make interesting things happen to a repository every time you push into it, by setting up hooks there.
			</dd>
		</dl>
		<p>FETCH</p>
		<dl>
			<dt>fetch</dt><dd>[options] [repository [refspec…]]</dd>
			<dt>fetch</dt><dd>[options] group</dd>
			<dt>fetch</dt><dd>--multiple [options>] [(repository | group)…]</dd>
			<dt>fetch</dt><dd>--all [options]</dd>
		</dl>
		<p>MERGE</p>
		<dl>
			<dt>merge</dt><dd>git merge [-n] [--stat] [--no-commit] [--squash] [-s strategy] [-X strategy-option] [--[no-]rerere-autoupdate] [-m msg] commit… </dd>
			<dt>merge</dt><dd>git merge msg HEAD commit… </dd>
			<dt>merge</dt><dd>git merge --abort</dd>
		</dl>

		<p>Execute command for all folders:</p>
		<example>git status</example>
		<example>git fetch origin master</example>
		<p>Fetch only for directory octopus:</p>
		<example>git -D octopus fetch origin master</example>

    <item>
        <tags>'octopus' 'git'</tags>
        <spec>:git status</spec>
        <description>
					The default action for the <ex>:git</ex> command is
				 	check status plugin.
        </description>
    </item>
</plugin>;
//}}}

var app = dactyl.plugins.app;

var OCTOPUS = {
	command: "status",
	rootPath: function(homeDir){
		var dir = homeDir||app.ccDir(); //Get home directory
    var rootPlugin = (navigator.platform.toLowerCase().indexOf("win"))? ".pentadactyl":"pentadactyl";//check on platform util.OS.isWindows ?
		app.append(dir, rootPlugin, "plugins", "barrel"); //Git plugins path
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
		var st = "git --git-dir='"+ git_dir_path + "' --work-tree='" + path + "' " + this.command; //constructed git command
		try{
			result = dactyl.modules.io.system(st);//exec command
		}catch(e){ 
			result = e;
		}
		dactyl.echomsg("OCTOPUS:" + dir.leafName.toUpperCase() + " »» " + result);
}};

group.commands.add(["octopus","git"], "Git Mannager", function (args) {
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

// vim: set fdm=marker sw=2 ts=2 sts=2 et:
