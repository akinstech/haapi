// Onkyo Receiver Class
//
// Requires onkyo-iscp utility
//
function onkyoReceiver(IP) {
    this.Name = "";
	this.IP = IP;
}

onkyoReceiver.prototype.SendCommand = function(params) { 
	var sys = require('sys')
	var exec = require('child_process').exec;
	var child;
	child = exec("/home/pi/haapi/utils/onkyo-iscp " + this.IP + " " + params);
	};

onkyoReceiver.prototype.PowerOn = function() { 
	this.SendCommand("PWR 01");
};

onkyoReceiver.prototype.PowerOff = function() {
	this.SendCommand("PWR 00");
};

onkyoReceiver.prototype.SetVolume = function(nLevel) { 
	hexVolume = nLevel.toString(16);
	this.SendCommand("MVL " + hexVolume);
};

onkyoReceiver.prototype.SetInput = function(strInput) { 
	var aInputs = new Array(); 
	aInputs["VCR/DVR"] = "00";
	aInputs["CBL/SAT"] = "01";
	aInputs["GAME"] = "02";
	aInputs["AUX"] = "03";
	aInputs["PC"] = "05";
	aInputs["BD/DVD"] = "10";
	aInputs["TV/CD"] = "23";
	aInputs["FM"] = "24";
	aInputs["AM"] = "25";
	aInputs["TUNER"] = "26";
		
	this.SendCommand("SLI " + aInputs[strInput]);
};

onkyoReceiver.prototype.SetListeningMode = function(strMode) { 
	var aModes = new Array(); 

	aModes["STEREO"] = "00";
	aModes["DIRECT"] = "01"; 
	aModes["SURROUND"] = "02";
	aModes["FILM"] = "03";              
	aModes["THX"] = "04";
	aModes["ACTION"] = "05";            
	aModes["MUSICAL"] = "06";           
	aModes["ORCHESTRA"] = "08";
	aModes["UNPLUGGED"] = "09";
	aModes["STUDIO-MIX"] = "0A";
	aModes["TV LOGIC"] = "0B";
	aModes["ALL CH STEREO"] = "0C";
	aModes["THEATER-DIMENSIONAL"] = "0D"; 
	aModes["MONO"] = "0F"; 
	aModes["FULL MONO"] = "13";
	aModes["THX Cinema"] = "42";
	aModes["THX Surround EX"] = "43";
	aModes["THX Music"] = "44";
	aModes["THX Games"] = "45";
	aModes["PLIIx Movie"] = "80";
	aModes["PLIIx Music"] = "81";
		
	this.SendCommand("LMD " + aModes[strMode]);
};

module.exports = onkyoReceiver;



