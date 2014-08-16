//(function(){
	var MUSIC = "/static/music/";
	var LED = "/static/LED/";

	var $audio = $("audio");
	var audio = $audio[0];
	var $progress = $("progress");

	function updateTime(){
		var c = audio.currentTime;
		var d = audio.duration;

		if (isNaN(d) || !d) {
			return ;
		}
		var progress = (c * 100) / d;
		$progress.val(progress);

		var nextBeat = player.LED[player.loc];
		while(nextBeat !== undefined) {
			var nextBeatTime = nextBeat.time;
			if(nextBeatTime < c){
				// no point we merely fucked up
			} else if (nextBeatTime - c < 1) {
				setTimeout((function(f){
					return function(){ window.vizualize(f); }
				})(nextBeat.freq_mag),  (nextBeatTime - c) * 1000);

			} else if (nextBeatTime - c >= 1) {
				break;
			}
			player.loc += 1;
			nextBeat = player.LED[player.loc];
		}
	}

	function getLED(file, success){
		$.ajax({
			url: LED + file + ".LED",
			method: "GET",
			dataType:"json",
			success: success
		});
	}

	function addSong(file){
		audio.pause();
		player.file = file;
		player.name = file.split(".").slice(0,-1).join(".");

		getLED(player.name, function(json){
			player.loc = 0;
			player.LED = json;
			audio.src = MUSIC + file;


			$progress.val(0);
			$audio.unbind('canplay').bind('canplay', function() {
				$audio.unbind('timeupdate').bind('timeupdate', updateTime);
				audio.play();
			});

		});


	}
	var pause = true;
	$("#pause").click(function(e){
		if (pause) {
			audio.pause();
		} else {
			audio.play();
		}
		pause = !pause;
	})
	window.player = {
		name: "",
		file: "",
		addSong : addSong,
		LED: [],
		loc: 0
	};
//})();