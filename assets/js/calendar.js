/**
 * Created by max on 10.06.16.
 */
function showError(Message)
{
   Materialize.toast("Fehler: "+Message, 1000, 'toastErrorClass');
}
function showSuccess(Message)
{
    Materialize.toast(Message, 1000, 'toastSuccessClass');
}
function showDebug(Message)
{
	//Materialize.toast("DEBUG:"+Message, 1000, 'toastDebugClass');
	console.log("DEBUG:"+Message);
}
function sortJSONDate(data, key) 
{
    return data.sort(function (a, b) {
		var y = parseTimeString(a[key]);
		var x = parseTimeString(b[key]);
		return new Date(x[2],x[1],x[0],x[3],x[4]).getTime() - new Date(y[2],y[1],y[0],y[3],y[4]).getTime();
    });
}
function getAllEntriesFromServer()
{
	ajaxQuery("get_events");
}
function showLoadingAnimation(onoff)
{
	var html = '<div class="progress" id="MyLoader">' +
				'<div class="indeterminate"></div>' +
				'</div>';
	if(onoff == true)
	{
		$("div.navbar-fixed").append(html);
	}else{
		$("#MyLoader").remove();
	}
}
function localToggleAllday(eventID)
{
	if(document.getElementById(eventID+'_body_allday').checked == true)
	{
		$('#'+eventID+'_body_start_time').val("00:00");
		$('#'+eventID+'_body_start_time').prop('disabled', true);
		$('#'+eventID+'_body_end_time').val("23:59");
		$('#'+eventID+'_body_end_time').prop('disabled', true);
	}else{
		$('#'+eventID+'_body_start_time').val("00:00");
		$('#'+eventID+'_body_start_time').prop('disabled', false);
		$('#'+eventID+'_body_end_time').val("23:59");
		$('#'+eventID+'_body_end_time').prop('disabled', false);
	}
	
}
function localMakeNavbarBig()
{
	$('div.nav-wrapper, nav').addClass("kopfzeileBig");
	$('#secondNavRow').removeClass("hide");
	$('#navbarSendNew').attr("onclick","localCreateNewEntry( $('#navbarTitleNew').val(), $('#navbarStartDateNew').val()+' ' + $('#navbarStartTimeNew').val(), $('#navbarEndDateNew').val() + ' ' + $('#navbarEndTimeNew').val(), $('#navbarOrganizerNew').val());")
}
function localMakeNavbarSmall()
{
	$('div.nav-wrapper, nav').removeClass("kopfzeileBig");
	$('#secondNavRow').addClass("hide");
	$('#navbarSendNew').attr("onclick","localMakeNavbarBig();")
	//um die Bildbox zu aktivieren, wenn in den Body geklickt wird.
	$('.materialboxed').materialbox();
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
	showDebug("Parse Time: "+time+" in style "+order);
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
function localCreateNewEntry(eventID)
{
	var titleElem = $('#navbarTitleNew');
	var startDateElem = $('#navbarStartDateNew');
	var startTimeElem = $('#navbarStartTimeNew');
	var endDateElem = $('#navbarEndDateNew');
	var endTimeElem = $('#navbarEndTimeNew');
	var organizerElem = $('#navbarOrganizerNew');
	if($('#navbarNewEntryForm').get(0).checkValidity() == true)
	{
		var title = titleElem.val();
		var start = startDateElem.val()+" "+startTimeElem.val();
		var end = endDateElem.val()+" "+endTimeElem.val();
		var organizer = organizerElem.val();
		start = parseTimeString(start);
		start = start[2]+"-"+start[1]+"-"+start[0]+"T"+start[3]+":"+start[4];
		end = parseTimeString(end);
		end = end[2]+"-"+end[1]+"-"+end[0]+"T"+end[3]+":"+end[4];
		createAjaxQueryEntry(title, start, end, "", organizer, "Busy");
	}else{
		showError("Das Formular enthält Fehler");
		if(titleElem.get(0).checkValidity() == false){
			showError("Titel darf nicht leer sein.");
			titleElem.addClass("invalid");
		}
		if(startDateElem.get(0).value == ""){
			showError("Startdatum muss ein gültiges Datum sein.");
			startDateElem.addClass("invalid");
		}
		if(startTimeElem.get(0).checkValidity() == false){
			showError("Startzeit muss eine gültige Uhrzeit sein.");
			startTimeElem.addClass("invalid");
		}
		if(endDateElem.get(0).value == ""){
			showError("Enddatum muss ein gültiges Datum sein.");
			endDateElem.addClass("invalid");
		}
		if(endTimeElem.get(0).checkValidity() == false){
			showError("Endzeit muss eine gültige Uhrzeit sein.");
			endTimeElem.addClass("invalid");
		}
		if(organizerElem.get(0).checkValidity() == false){
			showError("Veranstalter muss eine gültige E-Mail Adresse sein");
			organizerElem.addClass("invalid");
		}		
	}
}
function localCreateEntry(eventID, start)
{
	var template = '<li id="e'+eventID+'" class="">' +
				'<div class="collapsible-header calendar_list" id="e'+eventID+'_head">' +
                    '<div class="row">' +
                        '<div class="col l2 s4" id="e'+eventID+'_head_start">' +
							''+start+'' +
                        '</div>' +
                        '<div class="col l8 s5 center" id="e'+eventID+'_head_title">' +
                            'Dummy' +
                        '</div>' +
                        '<div class="m2 l3" id="e'+eventID+'_head_buttons">' +
                            '<i class="material-icons" onclick="localDisableFormular(\'#e'+eventID+'\',false);" id="e'+eventID+'_edit">mode_edit</i>' +
                            '<i class="material-icons" onclick="localRemoveEntry(\''+eventID+'\');" id="e'+eventID+'_delete">delete</i>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
				'<div class="collapsible-body" id="e'+eventID+'_body">' +
					'<div class="container">' +
						'<div class="row">' +
							'<form class="col s12" id="e'+eventID+'_body_form">' +
								'<div class="row">' +
									'<div class="input-field col s12">' +
										'<input placeholder="Titel" id="e'+eventID+'_body_title" type="text" class="validate" required>' +
										'<label for="e'+eventID+'_body_title">Titel</label>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="input-field col s3">' +
										'<input id="e'+eventID+'_body_start" type="date" class="datepicker validate" pattern="(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}" required>' +
										'<label for="e'+eventID+'_body_start">Start</label>' +
									'</div>' +
									'<div class="input-field col s3">' +
										'<input id="e'+eventID+'_body_start_time" type="date" class="timepicker validate" pattern="[0-2][0-9]:[0-5][0-9]" required>' +
										'<label for="e'+eventID+'_body_start_time">Start</label>' +
									'</div>' +
									'<div class="input-field col s3">' +
										'<input	id="e'+eventID+'_body_end" type="date" class="datepicker validate" pattern="(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}" required>' +
										'<label for="e'+eventID+'_body_end">Ende</label>' +
									'</div>' +
									'<div class="input-field col s3">' +
										'<input	id="e'+eventID+'_body_end_time" type="date" class="timepicker validate" pattern="[0-2][0-9]:[0-5][0-9]" required>' +
										'<label for="e'+eventID+'_body_end_time">Ende</label>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="col m8 s12">' +
										'<div class="row">' +
											'<div class="input-field col s12">' +
												'<input id="e'+eventID+'_body_organizer" class="validate" type="email" class="validate" required>' +
												'<label for="e'+eventID+'_body_organizer">Organisator</label>' +
											'</div>' +
										'</div>' +
										'<div class="row">' +
											'<div class="input-field col s12">' +
												'<input id="e'+eventID+'_body_location" class="validate" type="text" class="validate">' +
												'<label for="e'+eventID+'_body_location">Ort</label>' +
											'</div>' +
										'</div>' +
									'</div>' +
									'<div class="col m4 s12" id="imageblock">' +
										'<div class="card">' +
											'<div class="card-image">' +
												'<img class="responsive-img materialboxed" src="assets/images/Placeholder.png" alt="Bild des Kalendereintrags" id="e'+eventID+'_body_image">'+
											'</div>' +
											'<div class="card-action">' +
												'<div class="file-field input-field">' +
														'<input type="button" class="btn uploadBtn" value="Upload">' +
														'<input type="file" accept="image/*" id="e'+eventID+'_body_new_image">' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="input-field col s4">' +
										'<input type="checkbox" onclick="localToggleAllday(\'e'+eventID+'\')" class="validate" id="e'+eventID+'_body_allday" />' +
										'<label for="e'+eventID+'_body_allday">Ganztägig</label>' +
									'</div>' +
									'<div class="input-field col s8">' +
										'<select id="e'+eventID+'_body_status">' +
											'<option value="Busy" selected>Beschäftigt</option>' +
											'<option value="Free">Verfügbar</option>' +
											'<option value="Tentative">Ausstehend</option>' +
										'</select>' +
										'<label>Status</label>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="input-field col s12">' +
										'<input id="e'+eventID+'_body_webpage" type="url" class="validate">' +
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
	var alleEintraege = liste.querySelectorAll("li");
	var einfuegenNach = -1;
	var dateString = parseTimeString(start);
	var entryDate =  new Date(dateString[2],dateString[1],dateString[0],dateString[3],dateString[4]);
	if(alleEintraege.length >= 1)
	{
		einfuegenNach = 0;
		for(let eintrag of alleEintraege)
		{
			if(eintrag.id == "")
			{
				continue;
			}
			showDebug("Eintrag:"+eintrag.id);
			dateString =  parseTimeString(localGetEntryValue(eintrag, "head_start"));
			var tmpDate = new Date(dateString[2],dateString[1],dateString[0],dateString[3],dateString[4]);
			showDebug(tmpDate.getTime() +"<"+ entryDate.getTime());
			if(tmpDate.getTime() <= entryDate.getTime())
			{
				einfuegenNach = eintrag.id;
			}
			if(tmpDate.getTime() > entryDate.getTime())
			{
				break;
			}
		}
	}
	showDebug(einfuegenNach);
	if(einfuegenNach == -1)
	{
	$(liste).append(template);
	}else if(einfuegenNach == 0){
		$(template).insertBefore("#"+liste.id+" > :first-child");
	}else{
		$(template).insertAfter("#"+einfuegenNach)
	}
	var newElement = localGetEntryElement(eventID);
	localDisableFormular(newElement, true);
	return newElement;
}

function localResetForm(eventID)
{
	getAllEntriesFromServer();
	localDisableFormular("#e"+eventID, true)
}
function localResetNavbarForm()
{
	$('#navbarNewEntryForm').get(0).reset();
}
function localSaveForm(eventID)
{
	showDebug("Save Form with EventID:"+eventID);
	var titleElem = $("#e"+eventID+"_body_title");
	var locationElem = $("#e"+eventID+"_body_location");
	var startDateElem = $("#e"+eventID+"_body_start");
	var startTimeElem = $("#e"+eventID+"_body_start_time");
	var endDateElem = $("#e"+eventID+"_body_end");
	var endTimeElem = $("#e"+eventID+"_body_end_time");
	var organizerElem = $("#e"+eventID+"_body_organizer");
	var statusElem = $("#e"+eventID+"_body_status");
	var alldayElem = $("#e"+eventID+"_body_allday");
	var webpageElem = $("#e"+eventID+"_body_webpage");
	
	if($('#e'+eventID+'_body_form').get(0).checkValidity() == true)
	{
		var title = titleElem.val();
		var location =locationElem.val();
		var organizer = $("#e"+eventID+"_body_organizer").val();
		var start = startDateElem.val() + " " + startTimeElem.val();
		start = parseTimeString(start);
		start = start[2]+"-"+start[1]+"-"+start[0]+"T"+start[3]+":"+start[4];
		var end = endDateElem.val() + " " + endTimeElem.val();
		end = parseTimeString(end);
		end = end[2]+"-"+end[1]+"-"+end[0]+"T"+end[3]+":"+end[4];
		var status = statusElem.val();
		var allday = alldayElem.get(0).checked;
		if(allday == true)
		{
			allday = 1;
		}else{
			allday = 0;
		}
		var webpage = webpageElem.val();
		localDisableFormular("#e"+eventID, true);
		createAjaxQueryEntry(title, start, end, location, organizer, status, allday, webpage, eventID);
		if(document.getElementById("e"+eventID+"_body_new_image").files.length != 0)
		{
			var newPic = document.getElementById("e"+eventID+"_body_new_image").files[0];
			if((newPic.size/1024) > 500)
			{
				showError("Bild zu groß");
			}else{
				if(newPic.type == "image/jpeg" || newPic.type == "image/png"  || newPic.type == "image/jpg")
				{
					createAjaxQueryAddImage(eventID, newPic);
				}else{
					showError("Falsches Dateiformat des Bildes");
				}
			}
		}
	}else{
		showError("Das Formular enthält Fehler");
		if(titleElem.get(0).checkValidity() == false){
			showError("Titel darf nicht leer sein.");
			titleElem.addClass("invalid");
		}
		if(startDateElem.get(0).value == ""){
			showError("Startdatum muss ein gültiges Datum sein.");
			startDateElem.addClass("invalid");
		}
		if(startTimeElem.get(0).checkValidity() == false){
			showError("Startzeit muss eine gültige Uhrzeit sein.");
			startTimeElem.addClass("invalid");
		}
		if(endDateElem.get(0).value == ""){
			showError("Enddatum muss ein gültiges Datum sein.");
			endDateElem.addClass("invalid");
		}
		if(endTimeElem.get(0).checkValidity() == false){
			showError("Endzeit muss eine gültige Uhrzeit sein.");
			endTimeElem.addClass("invalid");
		}
		if(organizerElem.get(0).checkValidity() == false){
			showError("Veranstalter muss eine gültige E-Mail Adresse sein");
			organizerElem.addClass("invalid");
		}
		if(locationElem.get(0).checkValidity() == false){
			showError("Der Ort muss ein Text sein.");
			locationElem.addClass("invalid");
		}
		if(statusElem.get(0).checkValidity() == false){
			showError("Es sind beim Status die Werte Verfügbar Beschäftigt und Ausstehend möglich.");
			statusElem.addClass("invalid");
		}	
		if(alldayElem.get(0).checkValidity() == false){
			showError("Ganztags kann nur Ja oder Nein sein.");
			alldayElem.addClass("invalid");
		}
		if(webpageElem.get(0).checkValidity() == false){
			showError("Es muss eine gültige URL im Format http(s)://url.tld eingegeben werden.");
			webpageElem.addClass("invalid");
		}
	}
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
		$(listenEintrag).focus();
		listenEintrag.scrollIntoView('{block: "end"}');
		window.scrollBy(0, -100);
		$(listenEintrag).eq(0).addClass("newEntry");
	}
	localMakeNavbarSmall();
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
	localDisableFormular(listenEintrag, false);
	localDisableFormular(listenEintrag, true);
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
function localSetImage(eventID, imageURL)
{
	if(imageURL != "")
	{
		$('#e'+eventID+'_body_image').prop("src", imageURL);
	}
}
function localSetEntryValue(objEntry, item, value)
{
	showDebug("Set "+item+" to "+value);
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
function createAjaxQueryAddImage(eventID, fileObject)
{
	showDebug("Picture Filename: "+fileObject.name);
	var reader = new FileReader();
    reader.onload = function() {
		var jsondata = { "data": reader.result };
		showDebug("Picture JSONData: "+JSON.stringify(jsondata));
		ajaxQuery("set_image", jsondata, eventID);
    };
    reader.readAsDataURL(fileObject);
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
		//showDebug(JSON.stringify(jsondata));
		if(optEventID != null && optEventID != "" && optEventID != NaN){
			showDebug("EventID: "+optEventID);
			ajaxQuery("change_event",jsondata,optEventID);
		}else{
			ajaxQuery("set_event", jsondata);
		}
}
function ajaxError(response)
{
	showLoadingAnimation(false);
	if(response.responseText == null)
	{
		showError("Abrufen fehlgeschlagen. Keine Verbindung.");
		return;
	}
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
	showLoadingAnimation(false);
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
			showSuccess("Bild erfolgreich angelegt");
			ajaxQuery("get_events");
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
function ajaxQuery(action, queryText, optParam)
{
	showLoadingAnimation(true);
    showDebug('Create Ajax Query{"action":"'+action+'","queryText":"'+queryText+'","optParam":"'+optParam+'"}');
	var userid = "it15002";
    var actionURL = "";
    var type = "";
	var JSONData = queryText;
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
            actionURL = "images/"+optParam;
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
	showDebug('Send the following Data{"url":"'+url+'","type":"'+type+'","data":"'+JSON.stringify(JSONData)+'"}');
    $.ajax({
        url: url,
        type: type,
		contentType: "application/json",
        dataType: "json",
		//cache: false, //produziert, warum auch immer Fehler...
        data: JSON.stringify(JSONData),
        error: function(jqXHR, textStatus, errorThrown){ ajaxError(jqXHR); },
        success: function(data, textStatus, jqXHR){ ajaxSuccess(jqXHR, action); }
    });


}
function onAjaxSuccessUpdateEvents(jsonData)
{
	$("li").removeClass("updated");
	//$("li").remove();
	showDebug(jsonData);
    var data = jQuery.parseJSON(jsonData);
	data = sortJSONDate(data, "start");
	for(let element of data)
	{
		localSetEntry(element.title, element.location, element.organizer, element.start, element.end, element.status, element.allday, element.webpage, element.id);
		$("#e"+element.id).addClass("updated");
		showDebug("ImageURL: "+element.imageurl);
		localSetImage(element.id, element.imageurl);
	}
	$("li").not(".updated").remove();
	localResetNavbarForm();
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
    //$('.button-collapse').sideNav();
    $('.collapsible').collapsible({
      accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  }); // end of document ready
})(jQuery); // end of jQuery name space