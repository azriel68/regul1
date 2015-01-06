


var regul = {};

$(document).ready(function() {
	
	
	
    regul.indexedDB.db = null;
    regul.indexedDB.open();
  
 	$('#config').page({
		create:function(event,ui) {
			if(localStorage.interface_url) {  $('#interface_url').val(localStorage.interface_url); }
	
		}
	});
	
    for(i=0;i<24;i++) {
    	$('select[name=pointage_heure_depart]').append('<option value="'+i+'">'+pad_with_zeroes(i,2)+'h</option>');
    }  
    for(i=0;i<60;i++) {
    	$('select[name=pointage_minute_depart]').append('<option value="'+i+'">'+pad_with_zeroes(i,2)+'m</option>');
    	$('select[name=pointage_seconde_depart]').append('<option value="'+i+'">'+pad_with_zeroes(i,2)+'s</option>');
    }  
      
    $('select[name=pointage_heure_depart],select[name=pointage_minute_depart],select[name=pointage_seconde_depart],input[name=pointage_temps],input[name=pointage_distance]').change(function() {
    	
    	var m = $('input[name=pointage_distance]').val();
    	var t = $('input[name=pointage_temps]').val();
    	
    	var dCur = new Date();
    	
    	var dStart = new Date(dCur.getFullYear(),dCur.getMonth(), dCur.getDate() , $('select[name=pointage_heure_depart]').val(), $('select[name=pointage_minute_depart]').val(), $('select[name=pointage_seconde_depart]').val(), 0 );

		if(dStart<dCur)dStart.setDate(dStart.getDate()+1);

		var dEnd = addMinutes(dStart, t);
		
		var moyenne = getMoyenne(m, t);
    	
    	var dRest = new Date(dEnd.getTime() - dCur.getTime());
    	
	
    	$('#pointage_temps_restant').countdown('destroy');
    	$('#pointage_temps_restant').countdown({
    		until: dStart
    		, compact: true
    		, description: ' avant le départ'
    	});
    	
    	$('#pointage_moyenne').html('Moyenne '+moyenne+'km/h');
    	$('#pointage_heure_arrivee').html("Heure d'arrivée "+dEnd.toString().substr(16,8) );
		
	
    	
    	//$('#pointage_temps_restant').html("Temps restant "+dRest.toString().substr(16,8) );
    	
    });   
});

function tempsRestantDecompte() {
	
}

function getMoyenne(distance, duree) {
	// distance en mètre, durée en minute
	
	km = distance / 1000;
	h = duree / 60;
	moy = km / h;
	
	return Math.round( moy * 100 ) / 100;
	
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}


function saveConfig() {
	
	localStorage.interface_url = $('#interface_url').val();	
	
	$.ajax({
			url:localStorage.interface_url
			
			,data : {
  				get:'check'
  				,jsonp: 1
  			}
  	,dataType:'jsonp'
  	,async : true
	}).done(function() { alert('Configuration saved !'); }).fail(function() { alert('Configuration saved... But i think it\'s wrong.'); });
	
	
}

function setItemInHTML($container, item) {
	
	for(x in item) {
		
		value = item[x];
		
		$container.find('[rel='+x+']').html(value);
		
	}
	
}

