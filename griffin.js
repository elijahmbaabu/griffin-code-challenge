'use strict';
//variables
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.cart-close');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const purcaseBtn = document.querySelector('.buy-goods');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products');


//cart
let cart = [];
let ButtonsDOM =[];
//getting products from json
class Products {
async getProducts(){
    try{ 
    let result = await  fetch("goods.json");
    let data = await result.json();
    let product = data.items;
    product = product.map(item =>{
        const {title,price} = item.fields;
        const{id} = item.sys;
        const{image} = item.fields.image.url;
        return {title,price,id,image}
    });
    return product;
} catch(error){
    console.log(error);
        }
    }
}
// display product
    class UI{
    displayProducts(product){
        let result = '';
        product.forEach(item => {
result +=`
<h2>
            <img src="${item.image}" width="100" height="100" alt="Sorry! Image missing">
           <p> ${item.title}</p>
            <p>$${item.price}</p> 
        <p><button class="btn" data-id=${item.id}>ADD TO CART</button>
            </p>
            </h2> `;
        });
        productDOM.innerHTML = result;
    }
    getAddToCartBtns(){
        const cartBtns =[ ...document.querySelectorAll('.btn')];
        ButtonsDOM = cartBtns;
       cartBtns.forEach(button => {
           let id = button.dataset.id;
           let inCart = cart.find(item => item.id === id);
           if (inCart) {
               button.innerText = "Added to cart";
               button.disabled = true;
           } 
               button.addEventListener('click', (event) => {
                   event.target.innerText = "Added to cart";
                   event.target.disabled = true;
                   //getting items from products class
                   let cartItem = { ...Store.getProduct(id), amount:1};
                   
                   //adding items to cart
                   cart = [ ...cart,cartItem];
                   //save cart in the local storage
                   Store.saveCart(cart);
                   //set cart items number
                   //display cart items
                   //show cart
                })   
       });
    }
    
}

// local storage
class Store{
    static saveItem(product){
    localStorage.setItem("poduct",JSON.stringify(product))
    }
    static getProduct(id){
        let product = JSON.parse(localStorage.getItem('product'));
        return product.find(product => product.id === id);
    
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.tringify(cart));
    }
}








document.addEventListener("DOMContentLoaded", () => {
const ui = new UI();
const product = new Products();
//getting products
product.getProducts().then(product =>  {
    ui.displayProducts(product);
    Store.saveItem(product);
    }).then(() => {
        ui.getAddToCartBtns();
    });
});
