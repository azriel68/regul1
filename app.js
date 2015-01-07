

var TSpeciale={};
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
    	$('select.hour').append('<option value="'+i+'">'+pad_with_zeroes(i,2)+'h</option>');
    }  
    for(i=0;i<60;i++) {
    	$('select.minute').append('<option value="'+i+'">'+pad_with_zeroes(i,2)+'m</option>');
    	$('select.seconde').append('<option value="'+i+'">'+pad_with_zeroes(i,2)+'s</option>');
    }  
      
    $("#pointage_distance_km").change(function() {
    	$("#pointage_distance").val( $(this).val() * 1000 );
    	$("#pointage_distance").change();
    });
      
    $("#pointage_km_parcouru").change(function() {
    	
    	var m = $('input[name=pointage_distance]').val();
 		var t = parseInt($('select[name=pointage_heure_temps]').val() * 60) + parseInt($('select[name=pointage_minute_temps]').val()) + parseFloat($('select[name=pointage_seconde_temps]').val() / 60) ;
   
		var km = $(this).val();
		
		var coef = km / m;

    	var dCur = new Date();
    	
    	var dStart = new Date(dCur.getFullYear(),dCur.getMonth(), dCur.getDate() , $('select[name=pointage_heure_depart]').val(), $('select[name=pointage_minute_depart]').val(), $('select[name=pointage_seconde_depart]').val(), 0 );
		if( $("#pointage_demain").is(":checked") )dStart.setDate(dStart.getDate()+1);
		var dEnd = addMinutes(dStart, t);
		
		var dRest = new Date(dEnd.getTime() - dCur.getTime());
    	
		var dTarget = addMinutes( dStart, t * coef );    	
		var dDiffTarget = dCur.getTime() - dTarget.getTime();
    	
    	diff = dateDiff(dTarget,dCur);
		
		if(diff.min>0) {
			$('#pointage_etat_ar').html(diff.min+'min '+ diff.sec+'sec');
			$('#pointage_etat_ar').css({
				color:'red'
			});	
		}
		else{
			$('#pointage_etat_ar').html(diff.min+'min '+ Math.abs(diff.sec)+'sec');

			$('#pointage_etat_ar').css({
				color:'green'
			});	

		}
				    	
    }) ; 
      
    $("#etalonnage input[name=indice], #etalonnage input[name=zone], #etalonnage input[name=mesure]").change(function() {
    	
    	var i = $('#etalonnage input[name=indice]').val();
    	var z = $('#etalonnage input[name=zone]').val();
    	var m = $('#etalonnage input[name=mesure]').val();
   		
   		var coef = z / m;
   		
   		res = Math.round( i * coef * 100 ) / 100;
   		
   		$("#etalonnage_indice").html("Indice "+res); 	
    	
    }) ;
      
    $("#moyenne select.hour,#moyenne select.minute,#moyenne select.seconde").change(function(){
    	var t = parseInt($('select[name=moyenne_heure_temps]').val() * 60) + parseInt($('select[name=moyenne_minute_temps]').val()) + parseFloat($('select[name=moyenne_seconde_temps]').val() / 60) ;
    	var d = $('input[name=moyenne_distance]').val();
    	var m = $('input[name=moyenne_moyenne]').val();
    	
    	
    	
    });
      
    $('input[name=pointage_depart],#pointage select.hour,#pointage select.minute,#pointage select.seconde,input[name=pointage_temps],input[name=pointage_distance],#pointage_demain').change(function() {
    	
    	
    	var m = $('input[name=pointage_distance]').val();
    	$("#pointage_distance_km").val( m / 1000 );
    	
		var hDepart = $('input[name=pointage_depart]').val();
    	var THDepart = hDepart.split(":");

		var temps = $('input[name=pointage_temps]').val();
    	var TTemps  = temps.split(":");

    	var t = parseInt(TTemps[0] ) * 60 + parseInt(TTemps[1]) + parseFloat(TTemps[2])/ 60 ;
    	
    	var dCur = new Date();
    	
    	var dStart = new Date(dCur.getFullYear(),dCur.getMonth(), dCur.getDate() , THDepart[0], THDepart[1], THDepart[2], 0 );
		if( $("#pointage_demain").is(":checked") )dStart.setDate(dStart.getDate()+1);
		var dEnd = addMinutes(dStart, t);
		
		var moyenne = getMoyenne(m, t);
    	
    	var dRest = new Date(dEnd.getTime() - dCur.getTime());
    	
	
    	$('#pointage_temps_restant,#pointage_temps_restant2').countdown('destroy');
    	$('#pointage_temps_restant').countdown({
    		until: dStart
    		, compact: true
    		, description: ' avant le départ'
    	});
    	
    	$('#pointage_temps_restant2').countdown({
    		until: dEnd
    		, compact: true
    		, description: ' avant arrivée'
    	});
    	
    	$('#pointage_moyenne').html('Moyenne '+moyenne+'km/h');
    	$('#pointage_heure_arrivee,#pointage_heure_arrivee2').html("Arrivée "+dEnd.toString().substr(16,8) );
		
	
    	
    	//$('#pointage_temps_restant').html("Temps restant "+dRest.toString().substr(16,8) );
  
  		regul.indexedDB.getAll('speciale', TSpeciale, 'loadListeSpeciale');  	
    	;
    });   
});

function loadListeSpeciale() {
	
	$('#thirdparty-list ul li.speciale').remove();
	$.each(TThirdParty,function(i, item) {
		$('ul#listeSpeciale').prepend('<li><a href="#speciale" itemid="'+item.id+'">'+item.label+'</a></li>');	
	});
	
	if ($('ul#listeSpeciale').hasClass('ui-listview')) {
		    $('ul#listeSpeciale').listview('refresh');
	} else {
	    $('ul#listeSpeciale').listview();
	}
	
	
	
}

function dateDiff(date1, date2){
    var diff = {};                           // Initialisation du retour
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
 
    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;
     
    return diff;
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

