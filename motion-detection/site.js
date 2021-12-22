var $motionBox = $('.motion-box');
var $glug = $('img');

var scale = 10;	
var isActivated = false;
var isTargetInSight = false;
var isKnockedOver = false;
var lostTimeout;

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

function startComplete() {
	setTimeout(activate, 500);
}

function activate() {
	isActivated = true;
	play('activated');
}

function capture(payload) {
	if (!isActivated || isKnockedOver) {
		return;
	}

	var box = payload.motionBox;
	if (box) {
		var right = box.x.min * scale + 1;
		var top = box.y.min * scale + 1;
		var width = (box.x.max - box.x.min) * scale;
		var height = (box.y.max - box.y.min) * scale;

		$motionBox.css({
			display: 'block',
			right: right,
			top: top,
			width: width,
			height: height
		});

		if (!isTargetInSight) {
			isTargetInSight = true;
			play('i-see-you');
		} else {
			play('fire');
			MotionDetected();
		}
		clearTimeout(lostTimeout);
		lostTimeout = setTimeout(declareLost, 2000);
	}
}

function knockOver() {
	isKnockedOver = true;
	clearTimeout(lostTimeout);
	$motionBox.hide();
	play('ow');
}

function declareLost() {
	isTargetInSight = false;
	play('target-lost');
	MotionNotDetected();
}

function MotionDetected(){
	document.getElementById('status').innerHTML = 'Motion Detected';
}

function MotionNotDetected(){
	document.getElementById('status').innerHTML = 'Motion Not Detected';
}

function play(audioId) {
	$('#audio-' + audioId)[0].play();
}

DiffCamEngine.init({
	video: document.getElementById('video'),
	captureIntervalTime: 50,
	includeMotionBox: true,
	includeMotionPixels: true,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	startCompleteCallback: startComplete,
	captureCallback: capture
});
