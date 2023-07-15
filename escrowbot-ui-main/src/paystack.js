
function getcartref(){
    let data = window.sessionStorage.getItem("cart")
    data = JSON.parse(data)
    console.log("Cart ref ",data.cart_reference)
    return data.cart_reference
}

function payWithPaystack(method='cart',directdata="null") {
    return new Promise((resolve,reject) => {
        // do some async task
        let data;
        if (method === 'direct'){
            data = directdata
            console.log("Direct data ", data)

        }
        else{
            data = window.sessionStorage.getItem("paymentdata")
            data = JSON.parse(data)
            console.log("Payment data objectss ", data)

        }
        var handler = PaystackPop.setup({ 
            key: 'pk_test_61f9d0b56eef3ea3009d927bd82e71b57405957f', //put your public key here
            // key:'pk_live_8eed2192654877caff4f8679229f884e1b93c35f',
            email: data.email, //put your customer's email here
            amount: data.amount, //amount the customer is supposed to pay
            metadata: {
                custom_fields: [
                    {
                        display_name: "Mobile Number",
                        variable_name: "mobile_number",
                        value: data.phonenumber //customer's mobile number
                    }
                ]
            },
            callback: function (response) {
                //after the transaction have been completed
                //make post call  to the server with to verify payment 
                //using transaction reference as post data
                let cart_reference = "" 
                console.log(response)
                if (method !== 'direct'){
                    cart_reference = getcartref()
                }

                $.post("http://localhost:8000/api/v1/payment/verify", {reference:response.reference,orderRef: data.orderRef,cart_reference:cart_reference}, function(response){
                    if(response.status ){
                        //successful transaction
                        try{
                            if(response.method !== "direct"){
                                resolve(true);
                                return response
                            } 
                            console.log('Transaction was successful '+ response.message); //This line must be commented out since custom alerts will be used 

                        }

                        catch(err){alert("An error occured while verifying payment,this purchase was not successful")}
                        resolve(true);
                    }
                    else
                       alert("An error occured while verifying payment,this purchase was not successful ");
                        return false
                });
            },
            onClose: function () {
                alert('Transaction cancelled');
            }
        });
        handler.openIframe(); //open the paystack's payment modal
        // return true
     });
}