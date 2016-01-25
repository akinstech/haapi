// HAAPI (Home Automation API)
// AkinsTech 2015
//

// Get configuration
var config = require('./config.json');

var nVer = config.Version;
var listenerIP = config.listenerIP;
var listenerPort = config.listenerPort;
var scriptsDir = config.scriptsDir;
var fileLog = config.logfile;
var checkinThreshold = config.checkinThreshold;

var dirProcess = process.cwd();

const AWAY = 0;
const HOME = 1;
const UNKNOWN = -1;

var log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: fileLog, category: 'haapi' }
  ]
});

var logger = log4js.getLogger('haapi');
logger.setLevel('DEBUG');

// Use moment for date and timestamp functions
var moment = require('moment');

// Setup Home Status flags
var nhomeStatus = UNKNOWN;
var homeStatus = new Array(); 
homeStatus[AWAY] = "Away";
homeStatus[HOME] = "Home";
homeStatus[UNKNOWN] = "Unknown";
var lastCheckin = moment(0);

logger.info("HAAPI - Home Automation API v" + nVer + " [AkinsTech]");
logger.info("Process directory: " + dirProcess);

// Setup Devices
logger.debug("Setting up receiver");
lrReceiverIP = "192.168.1.192";
var onkyoReceiver = require("./classes/onkyoreceiver.js");
var lrReceiver = new onkyoReceiver(lrReceiverIP); 
lrReceiver.Name = "TX-NR609";

logger.debug("Setting up TV");
var vizioTV = require("./classes/viziotv.js");
var lrTV = new vizioTV(); 
lrTV.Name = "Vizio72"

// Require what we need
logger.info("Initializing web server");
var http = require("http");
var url = require('url');


// Build the server
var app = http.createServer(function(req, res) {
	
	var objURL = url.parse(req.url, true);
	logger.info("Pathname : " + objURL.pathname);
	logger.info("Query : " + objURL.query);
	
	switch(objURL.pathname)
	{
	
	// Homepage
	case "/":
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("HAAPI - Home Automation API v" + nVer + " [AkinsTech]");
		break;
	
	case "/lights/lr/on":
		cmdRun("heyu lr_on");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("on");
		break;
	
	case "/lights/lr/off":
		cmdRun("heyu lr_off");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("off");
		break;
	
	case "/lights/lr/dim":
		cmdRun("heyu lr_dim");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("dim");
		break;
	
	case "/lights/entry/on":
		cmdRun("heyu on entry");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("on");
		break;
	
	case "/lights/entry/off":
		cmdRun("heyu off entry");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("off");
		break;
	
	case "/lights/entry/dim":
		cmdRun("heyu entry_dim");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("dim");
		break;
		
	case "/lights/patio/on":
		cmdRun("heyu on patio");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("on");
		break;
	
	case "/lights/patio/off":
		cmdRun("heyu off patio");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("off");
		break;
	
	case "/lights/patio/dim":
		cmdRun("heyu patio_dim");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("dim");
		break;
	
	case "/activity/lr/watchtv":
		//cmdRun(scriptsDir+"watchtv");
		lrTV.PowerOn();
		
		
		lrReceiver.PowerOn();
		lrReceiver.SetInput("TV/CD");
		lrReceiver.SetListeningMode("TV LOGIC");
		lrReceiver.SetVolume(55);
		
		lrTV.SetInput("TV");
		
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("watchtv");
		break;
		
	case "/activity/lr/watchmovie":
		cmdRun(scriptsDir+"wakehtpc");
		
		lrTV.PowerOn();
		
		
		lrReceiver.PowerOn();
		lrReceiver.SetInput("PC");
		lrReceiver.SetListeningMode("THX Cinema");
		lrReceiver.SetVolume(55);
		
		cmdRun(scriptsDir+"apireq http://192.168.1.153:1337/api?Kodi-Start");
		cmdRun(scriptsDir+"apireq http://192.168.1.153:1337/api?Kodi-ShowMovies");
		
		lrTV.SetInput("HDMI1");
		
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("watchmovie");
		break;
		
	case "/activity/lr/pandora":
		lrTV.PowerOn();
		
		cmdRun(scriptsDir+"wakehtpc");
		lrReceiver.PowerOn();
		
		lrReceiver.SetInput("PC");
		lrReceiver.SetListeningMode("ALL CH STEREO");
		lrReceiver.SetVolume(55);
		cmdRun(scriptsDir+"apireq http://192.168.1.153:1337/api?Pandora-Start");
		
		lrTV.SetInput("HDMI1");
		
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("pandora");
		break;
	
	case "/activity/lr/pandorachill":
		lrTV.PowerOn();
		
		cmdRun(scriptsDir+"wakehtpc");
		lrReceiver.PowerOn();
		
				
		cmdRun("heyu lr_dim");				
		
		lrReceiver.SetInput("PC");
		lrReceiver.SetListeningMode("ALL CH STEREO");
		lrReceiver.SetVolume(55);
		cmdRun(scriptsDir+"apireq http://192.168.1.153:1337/api?Pandora-Start");
		
		lrTV.SetInput("HDMI1");
		
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("pandora");
		break;	
		
	case "/activity/lr/off":
		lrReceiver.SetVolume(25);
		lrReceiver.PowerOff();
		lrTV.PowerOff();
		cmdRun(scriptsDir+"apireq http://192.168.1.153:1337/api?System-Sleep");
		//cmdRun(scriptsDir+"apireq http://192.168.1.153:1337/api?Kodi-Stop");
		cmdRun("heyu lr_off");				
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("/activity/lroff");
		break;
		
	case "/lr/tv/off":
		cmdRun(scriptsDir+"tvoff");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("tvoff");
		break;
	
	case "/lr/tv/setchannel":
		var strChannel = objURL.query['ch'];
		logger.info("SetChannel to " + strChannel);
		
		lrTV.SetChannel(strChannel);
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("tvsetchannel");
		break;
	
	case "/lr/receiver/on": 
		lrReceiver.PowerOn();
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("/lr/receiver/on");
		break;
	
	case "/lr/receiver/off": 
		lrReceiver.PowerOff();
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("/lr/receiver/off");
		break;
	
	case "/wake/htpc": 
		cmdRun(scriptsDir+"wakehtpc");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("wakehtpc");
		break;
	
	case "/system/plex/updatemovies":
		cmdRun(scriptsDir+"apireq http://mediadog:32400/library/sections/3/refresh");
		break;
		
	case "/system/plex/updatetv":
		cmdRun(scriptsDir+"apireq http://mediadog:32400/library/sections/4/refresh");
		break;
	
	case "/system/plex/update":
		cmdRun(scriptsDir+"apireq http://mediadog:32400/library/sections/3/refresh");
		cmdRun(scriptsDir+"apireq http://mediadog:32400/library/sections/4/refresh");
		cmdRun(scriptsDir+"apireq http://mediadog:32400/library/sections/5/refresh");
		break;
	
	case "/system/plex/restart":
		cmdRun("ssh haapi@ubu14media.akinstech.home sudo service plexmediaserver restart");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("plex restart requested");
		break;
		
	case "/system/plex/reboot":
		cmdRun("ssh haapi@ubu14media.akinstech.home sudo reboot");
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end("plex server reboot requested");
		break;
		
	case "/homestatus/get": 
		res.writeHead(200, { "Content-Type": "text/html" });
		res.write("HomeStatus		: " + homeStatus[nhomeStatus]);
		res.write("Last Check-In	: " + lastCheckin.format());
		res.end();
		break;

	case "/homestatus/update": 
		res.writeHead(200, { "Content-Type": "text/html" });
		var secondsSince;
		secondsSince = moment().diff(lastCheckin, 'seconds');
		res.write("Time since checkin	: " + secondsSince);
		if ( secondsSince > checkinThreshold) {
			nhomeStatus = AWAY;
		}
		res.end();
		break;
		
	case "/homestatus/checkin": 
		nhomeStatus = HOME;
		lastCheckin = moment();
		res.end();
		break;
	
	case "/heartbeat": 
		logger.info("Heartbeat request from : " + req.connection.remoteAddress);
		res.write("HAAPI - Home Automation API v" + nVer + " [Heartbeat]");
		res.end();
		break;
		
		
	default:
		logger.error("Unknown Request");
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("HAPPI: Invalid API command");
  }
});

function cmdRun(cmd) {
	var sys = require('sys')
	var exec = require('child_process').exec;
	var child;

	
	child = exec(cmd, function (error, stdout, stderr) {
	  console.log('cmdRun: ' + cmd);
	  // console.log('stderr: ' + stderr);
	  if (error !== null) {
		console.log('exec error: ' + error);
	  }
	});
}

app.listen(listenerPort, listenerIP);
console.log("HAAPI listening at http://" + listenerIP + ":" + listenerPort);
