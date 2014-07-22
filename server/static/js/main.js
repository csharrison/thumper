(function(){
	var song;
	$(document).ready(function(){
		setup();
	});

	function update(html){
		$("body").html(html);
	}

	function setup(){
		$("#done li").click(function(e){
			player.addSong($(this).text());
		});
	}

	$("#upload").submit(function(e){
		e.preventDefault();

		var formData = new FormData();
		var file = $("#upload")[0].file.files[0]

		if (! file) return;

		formData.append("file", file);

		$.ajax({
			url: "/upload",
			type: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: update,
			failure: function(res){
				debugger;
			}
		});
		return false;
	});
})();