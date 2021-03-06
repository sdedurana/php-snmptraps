/**
 *
 * Javascript / jQuery functions
 *
 *
 */
$(document).ready(function () {

/* @general functions */

/*loading spinner functions */
function showSpinner() { $('div.loading').show(); }
function hideSpinner() { $('div.loading').fadeOut('fast'); }

/*	Login redirect function if success
****************************************/
function loginRedirect() {
	var base = $('.iebase').html();
	window.location=base;
}


//tooltip2
$('.tooltip2').tooltip({
    track: true,
    delay: 0,
    showURL: false,
    showBody: " - ",
    extraClass: "tooltip2",
    fixPNG: true,
    opacity: 0.95,
    left: 0
});

/* hide error div if jquery loads ok
*********************************************/
$('div.jqueryError').hide();

//disabled links
$('.disabled a').click(function() {
	return false;
});


// interval var
var interval;
var isPaused = false;
var modal_paused = false;

// reload page progress bar
var interval = setInterval(function() {
    if (isPaused==false && window.location.href.indexOf("settings") == -1 && window.location.href.indexOf("live") == -1) {
        // get reload value
        var reload_at = $('div.progress-bar-reload').html();
        // get current value
        var old_state = $('div.progress-bar').attr('aria-valuenow');
        var new_state = parseInt(old_state)+2;
        // calculate bar percentage
        var new_percentage = Math.round(new_state/reload_at *100);

        // if same or more reload page
        if (new_percentage>100) {
            window.location.reload();
        }
        else {
            // write new percentage till reload
            $('div.progress-bar').attr('aria-valuenow', new_state);
            $('div.progress-bar').html(new_percentage+"%");
            $('div.progress-bar').attr("style", "width:"+new_percentage+"%");
            // change seconds
            $('.pbar_percentage').html(reload_at-new_state);
        }
    }
}, 2000);

// timer functions
function stop_timer () {
    isPaused = true;
    $('.fa-toggle-timer').removeClass('fa-pause').addClass('fa-play');
}
function resume_timer () {
    isPaused = false;
    $('.fa-toggle-timer').removeClass('fa-play').addClass('fa-pause');
}
function toggle_timer () {
    if (isPaused)   resume_timer ();
    else            stop_timer ();
}

// stop on btn click in footer
$('.fa-toggle-timer').click(function() {
    toggle_timer ();
});


//prevent loading for disabled buttons
$('a.disabled, button.disabled').click(function() { return false; });

// load modal
$(document).on("click", '.load-modal', function() {
    // load
    $('#modal1 .modal-content').load($(this).attr('href'));
    // show
    $('#modal1').modal('show');
    // paused by modal
    if (isPaused==false)        modal_paused = true;
    // stop timer
    stop_timer ();
    // dont reload
    return false;
});
$(document).on("click", '.load-modal-big', function() {
    // load
    $('#modal2 .modal-content').load($(this).attr('href'));
    // show
    $('#modal2').modal('show');
    // paused by modal
    if (isPaused==false)        modal_paused = true;
    // stop timer
    stop_timer ();
    // dont reload
    return false;
});
// hide modal - resume timer
$('#modal1, #modal2').on('hidden.bs.modal', function () {
    // if hidden by modal start
    if(modal_paused) {
        modal_paused = false;
        resume_timer ();
    }
})

/* @cookies */
function createCookie(name,value,days) {
    var date;
    var expires;

    if (typeof days === 'undefined') {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else {
	    var expires = "";
    }

    document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


$('th.header-full_screen i').click(function() {
   // toggle fullscreen class
   $(this).closest('div.container-fluid').toggleClass('full_screen full_screen_live');
   $('nav.navbar, .search-wrapper, .footer, .hosts-wrapper, .message-wrapper').toggleClass('hidden');
});




/*	submit login
*********************/
$('form#login').submit(function() {
	//show spinner
	showSpinner();
    //stop all active animations
    $('div#loginCheck').stop(true,true);

    var logindata = $(this).serialize();

    $('div#loginCheck').hide();
    //post to check form
    $.post('app/login/login_check.php', logindata, function(data) {
        $('div#loginCheck').html(data).fadeIn('fast');
        //reload after 2 seconds if succeeded!
        if(data.search("alert alert-success") != -1) {
            showSpinner();
            //search for redirect
            if($('form#login input#phptrapredirect').length > 0) { setTimeout(function (){window.location=$('form#login input#phptrapredirect').val();}, 1000); }
            else 												 { setTimeout(loginRedirect, 1000);	}
        }
        else {
	        hideSpinner();
        }
    });
    return false;
});





//default row count
if(readCookie('table-page-size')==null) { def_size = 25; }
else                                    { def_size = readCookie('table-page-size'); }
// table
$('table.sorted').bdt({
   pageRowCount: def_size,
   searchFormClass: 'form-inline pull-right',
   divClass: 'text-right'
});
$('table.sorted-left').bdt({
   pageRowCount: def_size,
   searchFormClass: 'form-inline pull-left clearfix',
   divClass: 'text-left clearfix'
});
$('table.sorted').stickyTableHeaders();
$("li.disabled a").click(function () {
   return false;
});
$('form.search-form').submit(function() {
   return false;
})


return false;
});
