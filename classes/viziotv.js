// Vizio TV Class
//
// Requires lirc irsend utility
//
function vizioTV() {
    this.Name = "";
}
// vizio72_discrete KEY_INPUT_TV

vizioTV.prototype.SendCommand = function(params) { 
	var sys = require('sys')
	var exec = require('child_process').exec;
	var child;
	child = exec("irsend SEND_ONCE " + params);
	};

vizioTV.prototype.PowerOn = function() { 
	this.SendCommand("vizio72_discrete KEY_POWERON");
};

vizioTV.prototype.PowerOff = function() {
	this.SendCommand("vizio72_discrete KEY_POWEROFF");
};

vizioTV.prototype.SetInput = function(strInput) { 
	var aInputs = new Array(); 
	aInputs["TV"] = "KEY_INPUT_TV";
	aInputs["HDMI1"] = "KEY_INPUT_HDMI1";
	aInputs["HDMI2"] = "KEY_INPUT_HDMI2";
	aInputs["HDMI3"] = "KEY_INPUT_HDMI3";
	aInputs["HDMI4"] = "KEY_INPUT_HDMI4";
	aInputs["COMPONENT"] = "KEY_INPUT_COMPONENT";
	aInputs["COMPONENT1"] = "KEY_INPUT_COMPONENT1";
		
	this.SendCommand("vizio72_discrete " + aInputs[strInput]);
};

vizioTV.prototype.SetChannel = function(strChannel) { 
	for (var i = 0, len = strChannel.length; i < len; i++) {
		var strKey = "KEY_" + strChannel[i];
		this.SendCommand("vizio72 " + strKey);
	}
	this.SendCommand("vizio72 KEY_OK");
};

module.exports = vizioTV;