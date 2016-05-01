$(document).ready(function() {

  $('.deleteitem').click(function() {
  	var _this = $(this);
    bootbox.confirm("Vols eliminar aquets registre?", function(result) {
      if(result){

      		$.ajax({
    			url: '/category/' + _this.attr("data-type") + '/' + _this.attr("data-id"),
    			type: 'DELETE',
    			success: function(result) {
       				if(result.success){
       					$.alert('Element eliminat correctament', {withTime: true, type: 'success', closeTime: 3000, position: ['top-left', [-0.42, 0]]});
       				} else {
       					$.alert('Error no s\'ha pogut eliminar el registre',{withTime: true, type: 'danger',closeTime: 3000, position: ['top-left', [-0.42, 0]]});

       				}
    			}
			});
      }
    });
  });


});

/*

    $(document).ready(function() {
            $( "#searchmodule" ).on( "click", function() {
                var d = BootstrapDialog.confirm('Vols eliminar aquets registre?', 'sss');

                */