'use strict';
//variables
//accessing shopping cart btn
const cartBtn = document.querySelector('.cart-icon');
//accessing close cart button
const closeCartBtn = document.querySelector('.close-cart');
//acccessing clear cart btn
const clearCartBtn = document.querySelector('.btn-danger');
// accessing the cart Content
const cartDOM = document.querySelector('.cart');
//accessing the order items button
const purchaseBtn = document.querySelector('.shopping button');
//accesing the cart window
const cartOverlay = document.querySelector('.cart-overlay');
//accessing the cart count or the items count
const cartItems = document.querySelector('.badge');
//accessing the total cost of the items
const cartTotal = document.querySelector('.cart-total');
//accessing the cart items or the selected items
const cartCover = document.querySelector('.cart-content');
//accessing the products from json 
const productDOM = document.querySelector('.products');
//cart
let cart = [];
//buttons
let ButtonsDOM = [];
//getting products from json
class Products {
async getProducts(){
    try{ 
    let result = await  fetch("goods.json");
    let data = await result.json();
    let product = data.items;
    product = product.map(item => {
        const {title,price} = item.fields;
        const{id} = item.sys;
        const image = item.fields.image.url;
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
<article>
            <img src="${item.image}" width="220" height="220" alt="Sorry! Image missing">
           <h5> ${item.title}</h5>
            <h5>$${item.price}</h5> 
        <h6><button class="btn cartBtnV" data-id="${item.id}">ADD TO CART</button>
            </h6>
            </article> `;
        });
        productDOM.innerHTML = result;
    }
    getAddToCartBtns(){
        const addToCartBtns = [...document.querySelectorAll('.btn')];
        ButtonsDOM = addToCartBtns;
       addToCartBtns.forEach(button => {
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
                   let cartItem = { ...localStore.getProduct(id), amount:1};
                   //adding items to cart
                   cart = [ ...cart,cartItem];
                   //save cart in the local storage
                   localStore.saveCart(cart);
                   //set cart items number
                   this.setCartNumbers(cart)
                   //display cart items
                   this.addCartItem(cartItem);
                   //show cart
                   this.showCart();
                });  
       });
    }
setCartNumbers(cart) {
let amtTotal = 0;
let itemsTotal = 0;
cart.map(item => {
    amtTotal += item.price * item.amount;
    itemsTotal += item.amount;
});
cartTotal.innerText = parseFloat(amtTotal.toFixed(2));
cartItems.innerText =itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML =`<img src=${item.image} alt="product 1" height="80" width="120">
        <div>
            <h4>${item.title}</h4>
            <h4>$${item.price}</h4>
            <span class="remove-item" data-id=${item.id}>Remove</span>
        </div>
        <div>
            <i class="fa fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fa fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartCover.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    // APPsetup(){
    //     cart = localStore.getCart();
    //     this.setCartNumbers(cart);
    //     this.populateCart(cart);
    //     this.cartBtn.addEventListener('click', this.showCart);
    //     this.closeCartBtn.addEventListener('click', this.hideCart);
    // }
    // populateCart(cart){
    //     cart.forEach(item => this.addCartItem(item));
    // }
    // hideCart(){
    //     cartOverlay.classList.remove('transparentBcg');
    //     cartDOM.classList.remove('showCart');
    // }
}

// local storage
class localStore{
    static saveProduct(product){
    localStorage.setItem("product",JSON.stringify(product))
    }
    static getProduct(id){
        let product = JSON.parse(localStorage.getItem('product'));
        return product.find(product => product.id === id);
    
    }
    static saveCart(cart) {
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}








document.addEventListener("DOMContentLoaded", () => {
const ui = new UI();
const product = new Products();
//Application setup
// ui.APPsetup();
//getting products
product.getProducts().then(product =>  {
    ui.displayProducts(product);
    localStore.saveProduct(product);
    }).then(() => {
        ui.getAddToCartBtns();
    });
});
 