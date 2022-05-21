$(document).ready(
    function() {  
	$('#form').on(
	    'submit',
	    function(event){
		$.ajax(
		    {
			data :
			{
			    source_text : $('#source_text').val(),
			},
			type : 'POST',
			url : '/translate'
		    }
		).done(
		    function(data){
			$('#output').text(data["output"]).show();
		    }
		);
		event.preventDefault();
	    }
	);
    }
)
