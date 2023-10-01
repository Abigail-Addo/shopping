// localStorage.removeItem('customer_token')
// localStorage.removeItem('customer_id')

window.addEventListener('load', async () => {
    console.log('script.js is working');

    // Fetch product data and create HTML elements
    const result = await fetch('http://localhost:7070/shop/v1/products');
    const response = await result.json();
    console.log(response);

    const row = document.querySelector('.row');

    let contents = '';
    response.forEach(product => {
        contents += `
            <div class="col">
            <div class="card shadow-sm d-flex justify-content-center align-items-center" id=${product.id}>
                <img src="${product.image}" class="card-img-top w-50 h-25 pt-3" alt="hot deals">
                <div class="card-body py-0">
                    <div class="card-text text-justify">
                    <p class="fw-bold textTruncate d-block para">${product.name}</p>
                        <div class="para">
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star"></i>
                        </div>
                        <p class="price para">&cent; ${product.price} </p>
                        <p class="text-muted para lastChild">${product.stocks} items left</p>
                        <a href="" class="text-dark">
                            <i class="fa fa-shopping-cart addCart" aria-hidden="true" id=${product.id}></i> 
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
        row.innerHTML = contents;
    });




    // Add event listeners to the "Add to Cart" buttons
    const addToCartBtn = document.querySelectorAll('.addCart');

    addToCartBtn.forEach(btn => {

        // btn.style.border = '1px solid black';

        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Your "Add to Cart" button click logic here
            let product_id = btn.id;
            console.log('product id')
            console.log(product_id)
            console.log("customer_id")

            let customer_id = localStorage.getItem('customer_id');

            console.log(customer_id)
            console.log('product price')
            let mainEL = e.target.parentElement;
            let mainElement = mainEL.parentElement;
            const price = mainElement.querySelector('p.price')
            const priceVal = price.innerHTML;
            console.log(priceVal)


            // alert('attempting to add new item to shopping cart' + product_id)

            const newOrder = await fetch('http://localhost:7070/shop/v1/order', {
                method: 'POST',
                headers: {
                    "content-type": "application/json "
                },
                body: JSON.stringify({
                    product_id: Number(product_id),
                    customer_id: Number(customer_id)
                })
            })

            if (newOrder.status == 409) {
                let res = await newOrder.json();
                alert('Product has already been added to cart');
        
                return;
            }

            if (newOrder.status == 200 || newOrder.status == 201) {
                let res = await newOrder.json();
                console.log(res)
            }

            window.location.href = './index.html';

        });
    });





});

//self invoking function 
const createNewCustomerId = async () => {

    //get customer token
    let customer_token = localStorage.getItem('customer_token');

    if (!customer_token) {
        customer_token = Math.random() + new Date().toLocaleDateString()
        console.log("customer token")
        console.log(customer_token)
        //create new customer

        const url = 'http://localhost:7070/shop/v1/customer';
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: "Abigail Addo",
                city: "Accra",
                token: customer_token
            })
        })

        if (result.status == 200) {
            localStorage.setItem('customer_token', customer_token)
        }

    }
    console.log('customer already created')
}

createNewCustomerId();


const cartNumber = async (customer_token) => {
    console.log("getting cart items list")
    //get cart items number
    // setInterval(() => {
    const result = await fetch('http://localhost:7070/shop/v1/customer-with-token', {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            token: customer_token
        })
    })

    if (result.status == 200) {
        let response = await result.json();
        console.log(response)
        console.log("response id")
        const id = response[0].id;
        console.log(id)

        //store customer id in localstorage
        let customer_id = localStorage.getItem('customer_id');

        if (!customer_id) {
            localStorage.setItem('customer_id', id);
        }


        //get orders with customer id 
        const rs = await fetch('http://localhost:7070/shop/v1/orders-with-customerId', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                customer_id: id
            })

        });

        if (rs.status == 200) {
            let orders = await rs.json();
            console.log(orders)
            const { order } = orders;
            const orderCount = order.reduce((count, items) => {
                return count + 1;
            }, 0)

            console.log(orderCount)

            const cList = document.querySelector('#cart-number')
            cList.innerHTML = orderCount;
        }



    }


}


let customerToken = localStorage.getItem('customer_token')
cartNumber(customerToken);