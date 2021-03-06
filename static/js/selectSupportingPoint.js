    
	function selectPoint(pointUrl, parentPointUrl){
	  	$.ajaxSetup({
			url: "/linkPoint",
			global: false,
			type: "POST",
		 	data: {
				'supportingPointURL': pointUrl,
				'parentPointURL': parentPointUrl
				},
			success: function(data){ 
			  obj = JSON.parse(data);
			  if (obj.result == true) {
				window.location.href="/point/" + parentPointURL;							  
			  } else {
			  	if (obj.error) {
			    	alert(obj.error);
			    } else {
			    	alert("There was an error");
			    }
			  }
			}
		});
		$.ajax();
	}
								      
	function addPoint(){
		var ed = tinyMCE.get('editor_createSupportingPoint');
    var text = tinyMCE.activeEditor.getBody().textContent;
		$.ajaxSetup({
			url: "/addSupportingPoint",
			global: false,
			type: "POST",
			data: {
				'content': ed.getContent(),
        'plainText': text.substring(0,500),
				'title': $('#title_createSupportingPoint').val(),
				'pointUrl': parentPointURL,
				'imageURL':$('#link_createSupportingPoint').val(),
        'imageAuthor':$('#author_createSupportingPoint').val(),
        'imageDescription': $('#description_createSupportingPoint').val()
			},
			success: function(data){
				obj = JSON.parse(data);
				if (obj.result == true) { 					
					window.location.href="/point/" + parentPointURL;
				} else {
					if (obj.error) {
			    		alert(obj.error);
			    	} else {
			    		alert("There was an error");
			    	}
				}				
 			}
		});
		$.ajax();
	}

$(document).ready(function() {
  if (!loggedIn) {
    $( "#addSupportingPoint" ).attr('href',"#loginDialog");
    $( "#addSupportingPoint" ).attr('data-toggle',"modal");        
  } else {				
    $( "#addSupportingPoint" ).attr('href',"#createSupportingPoint");
    $( "#addSupportingPoint" ).attr('data-toggle',"modal");
  
    $("#submit_createSupportingPoint").on('click', function(e) {
		   addPoint();
		});
  }
  
	$(".searchBox", $(".searchColumn")).keyup(function(event){
		if(event.keyCode == 13){
			$.ajaxSetup({
				url: "/ajaxSearch",
				global: false,
				type: "POST",
				data: {
					'searchTerms': $(".searchBox").val(),
					'exclude' : parentPointURL
				},
				success: function(data){
					$("[id^=searchPoint]",$(".searchColumn")).remove();
					obj = JSON.parse(data);
					if (obj.result == true) { 
						appendAfter = $(".searchColumn");
						for(var i=0; i < obj.searchResults.length; i++){
							var oneResult = obj.searchResults[i];
							newDiv = jQuery('<div/>', {
								class: "boxedElement",
								id: "searchPoint_" +  oneResult['url']
								});
							if (oneResult['voteTotal'] >= thresholdGreen ) {
								spanClass = 'greenScore';
							} else if  (oneResult['voteTotal'] <= thresholdRed) {
								spanClass = 'redScore';
							} else {
								spanClass = 'yellowScore';
							}
												
							newDiv.html(
								'<span class="' + spanClass + '">' +  
								oneResult['voteTotal'] + '</span> - <a href="/point/'+ oneResult['url'] + '">' + oneResult['title'] + 
								'</a> <button id="selectSearchPoint_' + oneResult['url'] +
								'" onClick="javascript:selectPoint(\'' + oneResult['url'] + '\', \'' +
								parentPointURL + '\');"> USE </button>'			
							);
							appendAfter.append(newDiv);
							newDiv.show();
							/* set the text, including link
							// set the button event handler
							// call the .button
							// append it last
							// make it visible			        
					        oneResult['title']
					        oneResult['url']
					        oneResult['voteTotal']*/
			        	}
			        	$( "[id^=selectSearchPoint]" ).button();
						$( "[id^=selectSearchPoint]" ).css("float","right");
					} else {
						alert('There were no results for: ' + $(".searchBox").val() + ' or that is already a supporting point');
					}
	 			}
			});
			$.ajax();
	  }
	});
});