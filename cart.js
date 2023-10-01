

window.addEventListener('load', async () => {

    //fetch all cart items for this customer
    let customerId = localStorage.getItem('customer_id')
    console.log("customer id")
    console.log(customerId)


    if (customerId > 0) {
        // fetch all orders
        let rs = await fetch('http://localhost:7070/shop/v1/orderWithCustomerId', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ customer_id: customerId })
        })
        if (rs.status == 200) {

            const cartContainer = document.querySelector('.cart-container');

            const orders = await rs.json()
            console.log(orders)

            let item = '';
            //create item list
            orders.forEach(order => {

                item += `
            <div class="d-sm-flex justify-content-between my-4 order-container">
            <div class="d-block d-sm-flex text-center text-sm-left">
                <a class="cart-item-thumb mr-sm-4" href="#"><img src="${order.products.image}" class="w-100 h-100"
                        alt="Product"></a>
                <div class="media-body pt-3">
                    <h3 class="product-card-title fw-bold border-0 pb-0 px-2">${order.products.name}</h3>
                    <div class="font-size-sm">${order.products.description}</div>
                    <div class="font-size-lg pt-2"> <p class="Itemprice">&cent; ${order.products.price}</p> </div>
                </div>
            </div>
            <div class="pt-2 pt-sm-0 pl-sm-3 mx-auto mx-sm-0 text-center text-sm-left"
                style="max-width: 10rem;">
                <div class="form-group mb-2">
                <label for="quantity4">Quantity</label>
                <input class="form-control form-control-sm" type="number" id="quantity4" value="1">
            </div>
                <button class="btn btn-outline-secondary btn-sm btn-block mb-2" type="button" class:"update">
                <i class="bi bi-arrow-clockwise"></i>Update cart</button>
                <button class="btn btn-outline-danger btn-sm btn-block mb-2" type="button" id=${order.products.id}>
                    <i class="bi bi-trash"></i>Remove</button>
            </div>
        </div>
            `
                cartContainer.innerHTML = item;

            })

        }

    }
    // total price


    const totalPrices = document.querySelectorAll('.totalPrice');
    const Itemprices = document.querySelectorAll('.Itemprice');
    console.log(Itemprices);

    // Initialize an array to store the prices
    const prices = [];

    // Loop through each price element and extract the price
    Itemprices.forEach(priceEach => {
        const priceText = priceEach.textContent;
        const numericPart = priceText.split(/[^0-9.]+/).join(''); // Extract numeric part
        prices.push(numericPart);
    });

    console.log(prices); // This will give you an array of prices

    // Calculate the total price using reduce
    for (const Itemprice of Itemprices) {
        const totalPrice = Array.from(Itemprices).reduce((add, priceEach) => {
            const priceText = priceEach.textContent.trim();
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            return add + price;
        }, 0);
        console.log(totalPrice); // This will give you the total price


        // Now, update each totalPrice element with the calculated total
        totalPrices.forEach(totalPrices => {
            totalPrices.textContent = 'GH' + '\u00A2' + ' ' + totalPrice; 
        });


    }





    const deleteOrder = document.querySelectorAll('.btn-outline-danger');
    deleteOrder.forEach(deleted => {
        deleted.addEventListener('click', async (e) => {
            e.preventDefault();
            const orderId = deleted.getAttribute('id');
            console.log(orderId);
            try {
                const confirmed = confirm("Are you sure you want to delete this order");
                if (confirmed) {
                    const result = await fetch(`http://localhost:7070/shop/v1/order/${orderId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    if (result.status === 200 || result.status === 201) {
                        const response = await result.json();
                        console.log(response.status)
                        console.log("Deleted successfully");

                        // const orderContainer = document.querySelector('.order-container');
                        // transition
                        const orderContainer = e.target.parentElement.parentElement;
                        const user = orderContainer.parentElement;
                        user.classList.add('remove-deleted');
                        user.addEventListener('transitionend', () => {
                            user.remove();
                        })
                        console.log("order deleted successfully");
                    }
                }
            } catch (error) {
                console.error(error);
            }

        })
    })

})