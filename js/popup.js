$(function() {
    $('#toggle-event').change(function() {      
      if($(this).prop('checked')) $('#contain').addClass('active');                
      else $('#contain').removeClass('active');
    })
});