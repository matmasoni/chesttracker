cookie = {
  create: function(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
  },
  erase: function(name) {
    cookie.create(name,"",-1);
  },
  read: function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
}


function locate(haystack){
	//reset haystack to initial state
	$('.haystack').html(haystack);
		
	//then find needle and add wrappers
	var needle = $('.needle').html().toLowerCase().replace(/ ui-sortable-handle/g, '');
	console.log(needle.replace(' ui-sortable-handle', ''));
	var re = new RegExp('('+needle+')','gi');
	var text = $('.haystack').html();
	text = text.replace(re, '<em>$1</em>');
	$('.haystack').html(text);
	
	next_chance();
	
	cookie.create('chests', needle);
}

function next_chance(){
	var chance = {total:"0", silver:"0", gold:"0", giant:"0", magic:"0"};
	$('.haystack em').each(function(){
		var next_item = $(this).next('span').text();
		switch (next_item) {
			case 'Silver':
				chance.silver++;
				break;
			case 'Gold':
				chance.gold++;
				break;
			case 'Giant':
				chance.giant++;
				break;
			case 'Magic':
				chance.magic++;
				break;
		}
		chance.total++;
	})
	console.log(chance);
	var comingup = "";
	if(chance.total > 0){
		for(var thing in chance){
			if(thing == 'total'){
				comingup += chance.total+" matches found. "
			} else {
				var perc = Math.round(1000*chance[thing] / chance.total)/10;
				if (perc > 0){
					comingup += perc+"% chance your next chest will be "+thing+". "
				}
			}
		}
	} else {
		comingup = "hmmm... no match was found for the order you entered. are you sure it's right?"
	}
	$('#comingup').html('<p>'+comingup+'</p>');
}

$(document).ready(function () {
	
	// pull needle from cookie
	if(cookie.read('chests')){
		$('.needle').html(cookie.read('chests'));
	}
	
	//grab haystack variable before highlighting is applied
	var haystack = $('.haystack').html();
	
	locate(haystack);

	//initiate needle management
	$('.needle').sortable({
		connectWith: ".trash",
		update: function(event, ui) {
			locate(haystack)
		}
	});
	$('.trash').sortable({
		update: function(event, ui) {
			locate(haystack)
		}
	});
	$('.source').on('click', 'span', function(){
		var chest = $(this).clone()
		$('.needle').append(chest);
		locate(haystack);
	});
});