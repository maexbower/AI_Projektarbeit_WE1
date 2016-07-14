/**
 * Created by max on 10.06.16.
 */

function showError(Message)
{
   Materialize.toast("Fehler: "+Message, 5000, 'toastErrorClass');
}
function showSuccess(Message)
{
    Materialize.toast(Message, 5000, 'toastSuccessClass');
}
function showDebug(Message)
{
	//Materialize.toast("DEBUG:"+Message, 1000, 'toastDebugClass');
}
function sortJSONDate(data, key) 
{
    return data.sort(function (a, b) {
		var x = parseTimeString(a[key]);
		var y = parseTimeString(b[key]);
		return new Date(x[2],x[1],x[0],x[3],x[4]).getTime() - new Date(y[2],y[1],y[0],y[3],y[4]).getTime();
    });
}
function getAllEntriesFromServer()
{
	ajaxQuery("get_events");
}
function localMakeNavbarBig()
{
	$('div.nav-wrapper, nav').addClass("kopfzeileBig");
	$('#secondNavRow').removeClass("hide");
}
function localMakeNavbarSmall()
{
	$('div.nav-wrapper, nav').removeClass("kopfzeileBig");
	$('#secondNavRow').addClass("hide");
}
function localGetEntryElement(eventID)
{
	var entry = document.getElementById("e"+eventID);
	if(entry == null)
	{
		showDebug("Eintrag für Event "+eventID+" nicht gefunden");
	}
	return entry;
}
function parseTimeString(time, order)
{
	var myregexp = new RegExp(/([0-9]{2,4})/gm); 
	var dateString = time;
	var returnArr = new Array;
	returnArr = Array(0,0,0,0,0);
	dateString = dateString.match(myregexp);
	if(dateString == null)
	{
		showDebug("keine Zeit als Parameter übergeben");
		return returnArr;
	}
	switch(order){
		case "us":
			returnArr[0] = dateString[2]; //Tag
			returnArr[1] = dateString[1]; //Monat
			returnArr[2] = dateString[0]; //Jahr
			returnArr[3] = dateString[3]; //Stunden
			returnArr[4] = dateString[4]; //Minuten
			break;
		case "de":	
		default:
			returnArr[0] = dateString[0]; //Tag
			returnArr[1] = dateString[1]; //Monat
			returnArr[2] = dateString[2]; //Jahr
			returnArr[3] = dateString[3]; //Stunden
			returnArr[4] = dateString[4]; //Minuten
			break;
	}
	return returnArr;
}
function localCreateNewEntry(title, start, end, organizer)
{
	start = parseTimeString(start);
	start = start[2]+"-"+start[1]+"-"+start[0]+"T"+start[3]+":"+start[4];
	end = parseTimeString(end);
	end = end[2]+"-"+end[1]+"-"+end[0]+"T"+end[3]+":"+end[4];
	createAjaxQueryEntry(title, start, end, "", organizer, "Busy");
}
function localCreateEntry(eventID, start)
{
	var template = '<li id="e'+eventID+'" class="">' +
				'<div class="collapsible-header calendar_list" id="e'+eventID+'_head">' +
                    '<div class="row">' +
                        '<div class="col s2" id="e'+eventID+'_head_start">' +
							''+start+'' +
                        '</div>' +
                        '<div class="col s8" id="e'+eventID+'_head_title">' +
                            'Dummy' +
                        '</div>' +
                        '<div class="s2" id="e'+eventID+'_head_buttons">' +
                            '<i class="material-icons" onclick="localDisableFormular(\'#e'+eventID+'\',false);" id="e'+eventID+'_edit">mode_edit</i>' +
                            '<i class="material-icons" onclick="localRemoveEntry(\''+eventID+'\');" id="e'+eventID+'_delete">delete</i>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
				'<div class="collapsible-body" id="e'+eventID+'_body">' +
					'<div class="row">' +
						'<form class="col s12" id="e'+eventID+'_body_form">' +
							'<div class="row">' +
								'<div class="input-field col s12">' +
									'<input placeholder="Titel" id="e'+eventID+'_body_title" type="text" class="validate">' +
									'<label for="e'+eventID+'_body_title">Titel</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="input-field col s3">' +
									'<input id="e'+eventID+'_body_start" type="date" class="datepicker">' +
									'<label for="e'+eventID+'_body_start">Start</label>' +
								'</div>' +
								'<div class="input-field col s3">' +
									'<input id="e'+eventID+'_body_start_time" type="date" class="timepicker">' +
									'<label for="e'+eventID+'_body_start_time">Start</label>' +
								'</div>' +
								'<div class="input-field col s3">' +
									'<input	id="e'+eventID+'_body_end" type="date" class="datepicker">' +
									'<label for="e'+eventID+'_body_end">Ende</label>' +
								'</div>' +
								'<div class="input-field col s3">' +
									'<input	id="e'+eventID+'_body_end_time" type="date" class="timepicker">' +
									'<label for="e'+eventID+'_body_end_time">Ende</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="input-field col s12">' +
									'<input id="e'+eventID+'_body_organizer" type="email" class="validate">' +
									'<label for="e'+eventID+'_body_organizer">Organisator</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="input-field col s12">' +
									'<input id="e'+eventID+'_body_location" type="text" class="validate">' +
									'<label for="e'+eventID+'_body_location">Ort</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="input-field col s4">' +
									'<input type="checkbox" id="e'+eventID+'_body_allday" />' +
									'<label for="e'+eventID+'_body_allday">Ganztägig</label>' +
								'</div>' +
								'<div class="input-field col s8">' +
									'<select id="e'+eventID+'_body_status">' +
										'<option value="Busy" selected>Beschäftigt</option>' +
										'<option value="Free">Verfügbar</option>' +
									'</select>' +
									'<label>Status</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="input-field col s12">' +
									'<input id="e'+eventID+'_body_webpage" type="text" class="validate">' +
									'<label for="e'+eventID+'_body_webpage">Website</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="input-field col s6">' +
									'<input id="e'+eventID+'_save" onclick="localSaveForm(\''+eventID+'\');" type="button" class="btn" value="Speichern">' +
								'</div>' +
								'<div class="input-field col s6">' +
									'<input id="e'+eventID+'_body_cancel" type="button" onclick="localResetForm(\''+eventID+'\');" class="btn" value="Abbrechen">' +
								'</div>' +
							'</div>' +
						'</form>' +
					'</div>' +
				'</div>' +
			'</li>';
	//suche zuerst die passende Stelle für das Event
	var liste = document.getElementById("calendar_entries");
	if(liste == null)
	{
		showDebug("Kalenderliste nicht gefunden");
		showError("Anlegen fehlgeschlagen");
		return;
	}
	var test = document.getElementById("e"+eventID);
	if(test != null)
	{
		showDebug("Eintrag schon vorhanden. Kann nicht erneut angelegt werden.");
		showError("Anlegen fehlgeschlagen");
		return;
	}
	//var alleEintraege = liste.querySelectorAll("li");
	var einfuegenNach = -1;
	//var dateString = parseTimeString(start);
	//var entryDate =  new Date(dateString[2],dateString[1],dateString[0],dateString[3],dateString[4]);
	//if(alleEintraege.length >= 1)
	//{
		//einfuegenNach = 0;
		//for(let eintrag of alleEintraege)
		//{
			//if(eintrag.id == "")
			//{
			//	continue;
			//}
			//showDebug("Eintrag:"+eintrag.id);
			//dateString =  parseTimeString(localGetEntryValue(eintrag, "head_start"));
			//var tmpDate = new Date(dateString[2],dateString[1],dateString[0],dateString[3],dateString[4]);
			//showDebug(tmpDate.getTime() +"<"+ entryDate.getTime());
			//if(tmpDate.getTime() <= entryDate.getTime())
			//{
			//	einfuegenNach = eintrag.id;
			//}
			//if(tmpDate.getTime() > entryDate.getTime())
			//{
			//	break;
			//}
		//}
	//}
	//showDebug(einfuegenNach);
	//if(einfuegenNach == -1)
	//{
	$(liste).append(template);
	//}else if(einfuegenNach == 0){
	//	$(template).insertBefore("#"+liste.id+" > :first-child");
	//}else{
	//	$(template).insertAfter("#"+einfuegenNach)
	//}
	var newElement = localGetEntryElement(eventID);
	localDisableFormular(newElement, true);
	return newElement;
}
function localResetForm(eventID)
{
	getAllEntriesFromServer();
	localDisableFormular("#e"+eventID, true)
}
function localSaveForm(eventID)
{
	showDebug("EventID:"+eventID);
	var title = $("#e"+eventID+"_body_title").val();
	var location = $("#e"+eventID+"_body_location").val();
	var organizer = $("#e"+eventID+"_body_organizer").val();
	var start = $("#e"+eventID+"_body_start").val() + " " + $("#e"+eventID+"_body_start_time").val();
	start = parseTimeString(start);
	start = start[2]+"-"+start[1]+"-"+start[0]+"T"+start[3]+":"+start[4];
	var end = $("#e"+eventID+"_body_end").val() + " " + $("#e"+eventID+"_body_end_time").val();
	end = parseTimeString(end);
	end = end[2]+"-"+end[1]+"-"+end[0]+"T"+end[3]+":"+end[4];
	var status = $("#e"+eventID+"_body_status").val();
	var allday = document.getElementById("e"+eventID+"_body_allday").checked;
	if(allday == true)
	{
		allday = 1;
	}else{
		allday = 0;
	}
	var webpage = $("#e"+eventID+"_body_webpage").val();
	createAjaxQueryEntry(title, start, end, location, organizer, status, allday, webpage, eventID);
}
function localRemoveEntry(eventID)
{
	var abfrage = false;
	abfrage = window.confirm("Sind Sie sicher, dass der Eintrag \'"+$("#e"+eventID+"_body_title").val()+"\' gelöscht werden soll?");
	if(abfrage == true)
	{
		createAjaxQueryDel_entry(eventID);
	}
}	
function localDisableFormular(element, onoff)
{
	$(element).find('input').prop('disabled', onoff);
	$(element).find('select').prop('disabled', onoff);
	if(onoff == false)
	{
		init();
	}
}
function localSetEntry(title, location, organizer, start, end, status, allday, webpage, eventID)
{
	var tmpDate = parseTimeString(start,"us");
	var start_date = tmpDate[0]+"."+tmpDate[1]+"."+tmpDate[2];
	var start_time = tmpDate[3]+":"+tmpDate[4];
	var tmpDate = parseTimeString(end,"us");
	var end_date = tmpDate[0]+"."+tmpDate[1]+"."+tmpDate[2];
	var end_time = tmpDate[3]+":"+tmpDate[4];
	var listenEintrag = localGetEntryElement(eventID);
	if(listenEintrag == null)
	{
		listenEintrag = localCreateEntry(eventID, start_date+" "+start_time);
	}
	localSetEntryValue(listenEintrag, "head_title", title);
	localSetEntryValue(listenEintrag, "head_start", start_date+" "+start_time);
	localSetEntryValue(listenEintrag, "body_title", title);
	localSetEntryValue(listenEintrag, "body_start", start_date);
	localSetEntryValue(listenEintrag, "body_start_time", start_time);
	localSetEntryValue(listenEintrag, "body_end", end_date);
	localSetEntryValue(listenEintrag, "body_end_time", end_time);
	localSetEntryValue(listenEintrag, "body_organizer", organizer);
	localSetEntryValue(listenEintrag, "body_location", location);
	localSetEntryValue(listenEintrag, "body_status", status);
	localSetEntryValue(listenEintrag, "body_allday", allday);
	localSetEntryValue(listenEintrag, "body_webpage", webpage);
}
function localGetEntryValue(objEntry, value)
{
	var tmpElem;
	tmpElem = document.getElementById(objEntry.id + "_" + value);
	if(tmpElem == null)
	{
		showDebug("Eintrag "+value+" für Event "+objEntry.id+" nicht gefunden(get_val)");
		//showError("Fehler beim aktualisieren");
		return null;
	}
	var val = null;
	if(value.indexOf("head") == -1)
	{
		val = tmpElem.value;
	}else{
		val = tmpElem.textContent.trim();
	}
	if(val == null)
	{
		showDebug("Eintrag "+value+" für Event "+objEntry.id+" nicht gefunden");
		showError("Fehler beim aktualisieren");
	}
	
	return val;
}
function localSetEntryValue(objEntry, item, value)
{
	var tmpElem;
	tmpElem = document.getElementById(objEntry.id + "_" + item);
	if(tmpElem == null)
	{
		showDebug("Eintrag "+item+" für Event "+objEntry.id+" nicht gefunden(set_val)");
		showError("Fehler beim aktualisieren");
		return null;
	}
	var val = null;
	if(item.indexOf("head") == -1)
	{
		switch(item){
			case "body_allday":
				val = value;
				if(value == 1)
				{
					tmpElem.checked = true;
				}else{
					tmpElem.checked = false;
				}
				break;
			default:
				val = tmpElem.value = value;
				break;
		}
		
	}else{
		val = tmpElem.innerHTML = value;
	}
	if($(tmpElem).val().length > 0) {
		$(tmpElem).siblings('label, i').addClass('active');
	}
	if(val == null)
	{
		showDebug("Eintrag "+item+"für Event "+objEntry.id+" nicht gefunden");
		showError("Fehler beim aktualisieren");
	}
	//init();
	return val;
}
function createAjaxQueryDel_entry(eventID)
{
	ajaxQuery("del_event", "", eventID);
}
function createAjaxQueryDel_categorie(categorieID)
{
	ajaxQuery("del_categories", "", categorieID);
}
function createAjaxQueryDel_picture(eventID)
{
	ajaxQuery("del_image", "", eventID);
}
function createAjaxQueryAddCategorieZuEvent(eventID, categorieID)
{
	ajaxQuery("set_cat-event", "", categorieID+"/"+eventID);
}
function createAjaxQueryAddImage(eventID)
{
	showDebug("ToDo");
	//ajaxQuery("set_image", "", eventID);
}
function createAjaxQueryRemoveCategorieVonEvent(eventID, categorieID)
{
	ajaxQuery("del_cat-event", "", categorieID+"/"+eventID);
}
function createAjaxQueryCategorie(name)
{
	var jsondata = {
		"name": name
	};
	ajaxQuery("set_categories", jsondata);
}
function createAjaxQueryEntry(title, start, end, location, organizer, status, allday, webpage, optEventID)
{
	//Wenn der Parameter für die Event ID mitgegeben wird, dann wird der bestehende Eintrag geändert.
	var jsondata = {
        "title": title,
        "location": location,
        "organizer": organizer,
        "start": start,
        "end": end,
        "status": status,
        "allday": allday, 
        "webpage": webpage
        };
		showDebug(JSON.stringify(jsondata));
		if(optEventID != null && optEventID != "" && optEventID != NaN){
			showDebug("EventID: "+optEventID);
			ajaxQuery("change_event",jsondata,optEventID);
		}else{
			ajaxQuery("set_event",jsondata);
		}
}
function ajaxError(response)
{
	var data = jQuery.parseJSON(response.responseText);
	switch(data.code){
		case 1:
			showError("Interner Fehler: Keine Aktion übergeben.");
			break;
		case 2:
			showError("Interner Fehler: Keine User übergeben.");
			break;
		case 3:
			showError("Interner Fehler: Unerlaubte Aktion übergeben.");
			break;
		case 4:
			showError("Interner Fehler: System nicht verfügbar.");
			break;
	
	}
    showError(data.description);

}
function ajaxSuccess(response, action)
{
    showDebug("ajaxSuccess: Action="+action);
    showDebug("Response="+response.responseText);
    switch(action){
        //Einträge Anlegen
        case "set_event":
			showSuccess("Eintrag erfolgreich angelegt");
			ajaxQuery("get_events");
            break;
        case "set_categories":
			showSuccess("Kategorie erfolgreich angelegt");
            break;
        case "set_image":
			
            break;
        case "set_cat-event":
			showSuccess("Kategorie erfolgreich hinzugefügt");
			ajaxQuery("get_events");
            break;
        //Einträge abrufen
        case "get_events":
			onAjaxSuccessUpdateEvents(response.responseText);
            break;
        case "get_categories":
			onAjaxSuccessUpdateCategories(response.responseText);
            break;
        //Einträge Löschen
        case "del_image":
			showSuccess("Bild erfolgreich gelöscht");
			ajaxQuery("get_events");
            break;
        case "del_categories":
			showSuccess("Kategorie erfolgreich gelöscht");
			ajaxQuery("get_events");
            break;
        case "del_cat-event":
			showSuccess("Kategorie erfolgreich gelöscht");
			ajaxQuery("get_events");
            break;
		case "del_event":
            showSuccess("Eintrag erfolgreich gelöscht");
			ajaxQuery("get_events");
            break;
        //Einträge Ändern
        case "change_event":
			showSuccess("Eintrag erfolgreich geändert");
			ajaxQuery("get_events");
            break;
        default:
            showError("interner Fehler, falsche Action ID:"+action);
            return;
            break;
    }
}
function ajaxQuery(action, optQueryText, optParam)
{
    var userid = "it15002";
    var actionURL = "";
    var queryText = optQueryText;
    var type = "";
    switch(action){
        //Einträge Anlegen
        case "set_event":
            actionURL = "events";
            type = "POST";
            break;
        case "set_categories":
            actionURL = "categories";
            type = "POST";
            break;
        case "set_image":
            actionURL = "images";
            type = "POST";
            break;
        case "set_cat-event":
            actionURL = "category-assignment/"+optParam;
            type = "POST";
            break;
        //Einträge abrufen
        case "get_events":
            actionURL = "events";
            type = "GET";
            break;
        case "get_categories":
            actionURL = "categories";
            type = "GET";
            break;
        //Einträge Löschen
        case "del_image":
            actionURL = "images/"+optParam;
            type = "DELETE";
            break;
        case "del_categories":
            actionURL = "categories/"+optParam;
            type = "DELETE";
            break;
        case "del_cat-event":
            actionURL = "category-assignment/"+optParam;
            type = "DELETE";
            break;
		case "del_event":
            actionURL = "events/"+optParam;
            type = "DELETE";
            break;
        //Einträge Ändern
        case "change_event":
            actionURL = "events/"+optParam;
            type = "PUT";
            break;
        default:
            showError("interner Fehler, falsche Action ID:"+action);
            return;
            break;
    }

    var url="http://dhbw.ramonbisswanger.de/calendar/" + userid + "/" + actionURL;
    var result= $.ajax({
        url: url,
        data: JSON.stringify(queryText),
        error: function(jqXHR, textStatus, errorThrown)
            {
                ajaxError(jqXHR);
                showError(textStatus);
                showError(errorThrown);
            },
        dataType: 'json',
        success: function(data, textStatus, jqXHR)
            {
                ajaxSuccess(jqXHR, action);
            },
        type: type,
    });


}
function onAjaxSuccessUpdateEvents(jsonData)
{
	//$("li").removeClass("updated");
	$("li").remove();
    var data = jQuery.parseJSON(jsonData);
	data = sortJSONDate(data, "start");
	for(let element of data)
	{
		localSetEntry(element.title, element.location, element.organizer, element.start, element.end, element.status, element.allday, element.webpage, element.id);
		$("#e"+element.id).addClass("updated");
		//createAjaxQueryDel_entry(element.id);
	}
	//init();
}
function onAjaxSuccessUpdateCategories(jsonData)
{
    var data = jQuery.parseJSON(jsonData);
}
function init()
{
	$('.datepicker').pickadate({
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 15, // Creates a dropdown of 15 years to control year
		firstDay: 1,
		format: 'dd.mm.yyyy',
		formatSubmit: 'dd.mm.yyyy'
	});
	$('select').material_select();
}
(function($){

  $(function(){
	getAllEntriesFromServer();
	init();
	
    $('.button-collapse').sideNav();
    $('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space