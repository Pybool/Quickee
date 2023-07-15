
function myfunction(){
    let cart = window.sessionStorage.getItem('cart')
    var navshoppingcartcount_span;
    navshoppingcartcount_span = document.getElementById('cartcount')
    console.log("=======>>>[Called js file from typescript] ", cart==null, navshoppingcartcount_span)
    try{
        
        cart = JSON.parse(cart)
        cart = cart.cartitems
        let cartitems_count = Object.keys(cart).length
        console.log(cart, Object.keys(cart), cartitems_count)
        console.log("Cart count span ", navshoppingcartcount_span, cartitems_count)
        navshoppingcartcount_span.style.visibility = "visible";
        navshoppingcartcount_span.style.backgroundColor ="green"
        navshoppingcartcount_span.textContent=`${cartitems_count}`
        navshoppingcartcount_span.style.paddingLeft= "7px"
        if (cart == null){
            navshoppingcartcount_span.style.backgroundColor ="transparent"
            navshoppingcartcount_span.style.visibility = "hidden";
            return null
        }
        
    }
    catch(err){
        if (cart == null){
            navshoppingcartcount_span.style.backgroundColor ="transparent"
            navshoppingcartcount_span.style.visibility = "hidden";
            return null
        }

    }
    
}