$(document).ready(function(){

    $(document).on("shown.bs.modal", "#new-detail-modal", function() {

    	var items_suggested = new Bloodhound({
    	  datumTokenizer: Bloodhound.tokenizers.obj.whitespace("description"),
    	  queryTokenizer: Bloodhound.tokenizers.whitespace,
          prefetch: window.location.origin + '/items_suggestion',
    	  remote: {
            url: window.location.origin + '/items_suggestion?query=%QUERY',
        	wildcard: '%QUERY'
    	  }
    	});

    	$('#sale_details_item').typeahead({
    		  hint: true,
    		  highlight: true,
    		  minLength: 1
    	},
    	{
    	  displayKey: 'description',
    	  source: items_suggested,
          templates: {
            suggestion: function (item) {
                return '<p>' + item.description + '</p>';
            }
          }
    	});

        $('#sale_details_item').focus();

    	$('#sale_details_item').typeahead('val', $('#sale_details_item_description').val() );

    	$('#sale_details_item').on('typeahead:select', function(object, datum){
            $('#sale_details_item').val(datum.id);
            $('#sale_details_qty').focus();
            subtotal();
        });

        $('#sale_details_item').on('typeahead:change', function(event, data){
            $('#sale_details_item').val(data);
        });

        $('#sale_details_item').on('blur', function() {

        	data = $('#sale_details_item').val();
        	url = '/validate_suggested_item';
            $('#sale_details_price_id').html('');
        	$.ajax({
        		url: url,
        		data: { item_description: data },
        		success: function(res){
        			if (res["0"].valid == false){
        				// Item no válido
        				    $('#sale_details_item').css('border-color', 'red');
                           $('#sale_details_item_id').val('');
                           document.getElementById('stock_current').innerHTML = '';
                           $('#sale_details_item_id').val('');
                           $('#sale_details_price').val('');
                           $('#sale_details_discount').val('');
                           $('#sale_details_price_id').val('');
                           $('#sale_details_subtotal').val('');
                            document.getElementById('stock_current').innerHTML = '';
                           if (data == '') {
                           }else{
                            alert(res["0"].notice);
                        }
        			}else{
        				// Item correcto
                        $('#sale_details_item_id').val(res["0"].id.toString());
                        $('#sale_details_price').val(res["0"].price.toString());
                        $('#sale_details_discount').val(res["0"].discount.toString());
                        $('#sale_details_price_id').val(res["0"].my_prices);
                        document.getElementById('stock_current').innerHTML = res["0"].stock_current;
                       a =  $('#price_list_id_').val();                     
                       var bar = JSON.parse( res["0"].my_prices  );
                            
                       for (var i = 0; i < bar.length; i++) {
                        if ( parseInt(a) == parseInt(bar[i].price_list_id)) {
                             $("#sale_details_price_id").append('<option selected value='+bar[i].id+' >'+bar[i].name+'</option>');
                        }else{
                            $("#sale_details_price_id").append('<option value='+bar[i].id+' >'+bar[i].name+'</option>');
                             }                                                    
                        }                                             
        				        $('#sale_details_item').css('border-color', '#ccc');                       
                        update_price();
                         subtotal();
        			}
        		}
        	});
        });

    $('#sale_details_price_id').on('blur', function() {
        update_price();             

    });
    function subtotal() {
        $('#sale_details_subtotal').val(get_subtotal() - discount_subtotal());
     };

     $('#sale_details_qty').blur(function(){
        if ($('#sale_details_qty').val() > 0) {      

            data = $('#sale_details_item_id').val();
              // alert(data);
             data_qty = $('#sale_details_qty').val();
            url = '/stocks_validate_qty';
            $.ajax({
                url: url,
                data: { item_id: data, qty_item_sale: data_qty },
                success: function(res){
                  // aqui debemos escrivir el script para controlar el redito y precio
                    if (res['0'].valid) {
                      $('#sale_details_qty').css('border-color', '#ccc');  
                        subtotal();

                    }else{
                          toastr.error('¡No hay la cantidad que solicita!');
                         $('#sale_details_qty').css('border-color', 'red');
                         $('#sale_details_qty').val('');
                    }                
                }
            });
        }else{
              $('#sale_details_qty').css('border-color', 'red');              
              toastr.error('El valor '+$('#sale_details_qty').val()+' '+'No es aseptable')
              $('#sale_details_qty').val('');
        }

        });

        $('#sale_details_price').blur(function(){
             subtotal();
        });
          $('#sale_details_discount').blur(function(){
             subtotal();
        });
        function discount_subtotal() {
                return ((get_subtotal()*$('#sale_details_discount').val())/100);
            }
        function get_subtotal(){
            return ($('#sale_details_qty').val() * $('#sale_details_price').val());
        }
        function update_price(){
            var select = document.getElementById("sale_details_price_id");
            data = select.value.toString();
            url = '/prices_select';
            $.ajax({
                url: url,
                data: { price_id: data },
                success: function(res){
                    
                     $('#sale_details_price').val(res['0'].price_sale);
                      subtotal()
                 }
              });
        }
    });
});


