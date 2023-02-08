$(document).ready(function () {
  let productsList = $(".products-section .products");
  $.getJSON("json/config.json", function (data) {

    $.each( data, function( key, val ) {
      var priceFormat = digitFormat(val.price);
      let showdata=`<div class="product">
      <img src="`+ val.imageUrl +`" alt="product-image" height="100"/>
      <p class="product-name">` + val.name + `</p>
      <p class="product-sku"><span class="bold">SKU: </span>` + val.sku + `</p>
      <p class="product-price">₹` + priceFormat + `</p>
      <button class="addcart-btn">Add to Cart</button></div>
      
      `;
      productsList.append(showdata);
    });
  
 });

$(document).on("click",".filter-section .filters", function() {
     $(".filter-container").toggleClass("show-filter-container")   
  });

 //Add to cart
 $(document).on("click",".product .addcart-btn", function() {
   $(".products-section .cart-section").show();
    var name = $(this).siblings(".product-name").text();
    var price = $(this).siblings(".product-price").text();
    var summaryData = $(".mycart-summary .product-data .productName");
    var summaryPrice = $(".mycart-summary .product-data .productPrice");
    var summaryHiddenPrice = $(".mycart-summary .product-data .productHiddenPrice");

    summaryData.append('<li>'+ name +'</li>');
    summaryPrice.append('<li class=>'+ price +'</li>');
    summaryHiddenPrice.append('<li class=>'+ numberFormat(price) +'</li>');

    //total

    function getTotal() {
      var totalPrice = 0;
      $('.productHiddenPrice').children().each(function(index, value) {
        totalPrice += parseInt(value.innerHTML.trim(), 10);
      });
      return totalPrice;
    }
    var totalData = getTotal();
    $(".total .total-amount").text('₹'+ totalData +'');

    //service tax
    var totalAmount = totalData;
    var serviceTax = parseFloat(((totalAmount/100)*21).toFixed(2));
    var totalTaxAndPrice = totalAmount - serviceTax;
    $(".sub-total .tax-amount").text('₹'+ serviceTax +'');
     $(".sub-total .total-price").text('₹'+totalTaxAndPrice+'');

    //discount code

    $(document).on("click",".discount .add-btn", function() {
      $.ajax({
          type: "Get",
          url: "json/discount.json",
          dataType: "json",
          success: function(result) {

            var inputVal = $(".discount .discount-input").val();
            
            tmpJson = result.filter(function (key, val){
            
                return key.discountCupon == inputVal;
            });
  
             $.each( tmpJson, function( i ) {
               $(".error").hide();
               var total = getTotal();
                var promoval = parseFloat(((total/100)*tmpJson[i].discountPercentage).toFixed(2));
                var totalPrice= (total - promoval).toFixed(2);

                var discountSummary = `<li class="product-data"><p class="dis-code">Discount code applied `+tmpJson[i].discountCupon+` (`+tmpJson[i].discountPercentage+`%)</p>
                <p class="dis-amount">-₹`+promoval+`</p></li>`;

                  $(".mycart-summary .discount-section").append(discountSummary);
            
                let discountdata =`<li class="d-flex"><p id="` + tmpJson[i].discountCupon+ `">Discount</p>
                <p >-₹`+promoval+`</p>
                </li>`;
                  $(".sub-total .total-discount").append(discountdata);
                  $(".total .total-amount").text('₹'+ totalPrice +'');
                  total = totalPrice;
                  $(".discount .discount-input").val('');
                 
             });

              if(inputVal == '') {
              $(".error").show().text("Please Enter Discount Code");
            }
            else if(tmpJson.length == 0) {
              $(".error").show().text("Please Enter Valid Code");
            }
            
          },
          error: function(){
              alert("json not found");
          }
      });
    
    }); 
  });

//Price slider 

 $("#price-range").slider({
    step: 500,
    range: true, 
    min: 0, 
    max: 80000, 
    values: [0, 80000], 
    slide: function(event, val)
    {$("#priceRange").val(val.values[0] + " - " + val.values[1]);}
  });
  $("#priceRange").val($("#price-range").slider("values", 0) + " - " + $("#price-range").slider("values", 1));

  //Filter by name

  

// function callings

  function digitFormat(num) {
        var digit= num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        return digit;
    }
    function numberFormat(num) {
        var number= num.replace(/,/g, '').replace(/₹/g, '');
        return number;
    }
});