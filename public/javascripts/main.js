$(document).ready(function(){
  $('.toga').hide();
  $('button').click(function(){
      $('.toga').slideToggle("slow");
  });
});