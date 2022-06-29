/*============= Navigation ============= */
const navOpen = document.querySelector(".nav_hamburger");
const navClose = document.querySelector(".close_toggle");
const menu = document.querySelector(".nav_menu");
const scrollLink = document.querySelectorAll(".scroll-link");
const navContainer = document.querySelector(".nav_menu");
var popupBox = document.querySelector('.popup_box')

navOpen.addEventListener("click", () => {
    menu.classList.add("open");
    document.body.classList.add("active");
    // navContainer.style.width = "20rem";
    navContainer.style.left = "0";
});

navClose.addEventListener("click", () => {
    menu.classList.remove("open");
    document.body.classList.remove("active");
    navContainer.style.left = "-20rem";
    // navContainer.style.width = "0";
});



/*=============Fixed Navigation============= */

const navBar = document.querySelector(".navigation");
const gotoTop = document.querySelector(".goto-top");

// Fix NavBar

window.addEventListener("scroll", e => {
    const scrollHeight = window.pageYOffset;
    const navHeight = navBar.getBoundingClientRect().height;
    if (scrollHeight > navHeight) {
        navBar.classList.add("fix__nav");
    } else {
        navBar.classList.remove("fix__nav");
    }

    if (scrollHeight > 300) {
        gotoTop.classList.add("show-top");
    } else {
        gotoTop.classList.remove("show-top");
    }
});

/* ============= PopUp ============= */
const popup = document.querySelector(".popup");
const closePopup = document.querySelector(".popup__close");

if (popup) {
    closePopup.addEventListener("click", () => {
        popup.classList.add("hide__popup");
    });

    window.addEventListener("load", () => {
        setTimeout(() => {
            popup.classList.remove("hide__popup");
        }, 500);
    });
}

/* ==================== Search ==================== */
const search = document.querySelector('.search');
const btn = document.querySelector('.btn-search');
const input = document.querySelector('.input');
btn.addEventListener('click', () => {
    search.classList.toggle('active');
    input.focus();
});

/* ================== Cart =================*/

const cart_trigger = document.getElementById("cart-trigger");
const lateral_cart = document.getElementById("cd-cart");
const shadow_layer = document.getElementById('cd-shadow-layer');
const nav_icons = document.getElementById('nav_icons');

const cartList = document.getElementById('cart__list')
const totalEl = document.getElementById('cart__total')
const burger = document.getElementById('burger');
const dismissBtn = document.getElementById("dismiss-popup-btn")
var body = document.body
var cartlabel = document.getElementById('cart__label')
cart_trigger.addEventListener("click", openCart);
burger.addEventListener("click", closeCart)

shadow_layer.addEventListener('click', (e) => {
    shadow_layer.classList.remove('is-visible')
    if (body.classList.contains('active_cart')) {
        lateral_cart.classList.remove("active");
        cart_trigger.classList.remove("active");
        nav_icons.classList.remove("active");
        body.classList.remove('active_cart');
    }
    if (search.classList.contains('active')) {
        search.classList.remove('active')
    }
})

function openCart(e) {
    e.preventDefault();
    e.stopPropagation();
    lateral_cart.classList.add("active");
    cart_trigger.classList.add("active");
    nav_icons.classList.add("active");
    body.classList.add('active_cart');
    shadow_layer.classList.add('is-visible')

    if (search.classList.contains('active')) {
        search.classList.remove('active')
    }
    getItems('/api/cart/list')
}

function closeCart(e) {
    // e.preventDefault();
    e.stopPropagation();
    lateral_cart.classList.remove("active");
    cart_trigger.classList.remove("active");
    nav_icons.classList.remove("active");
    body.classList.remove('active_cart');
    shadow_layer.classList.remove('is-visible')
        // cartList.innerHTML = ''
        // totalEl.innerHTML = ''
    if (search.classList.contains('active')) {
        search.classList.remove('active')
    }
}

function scrollToForm() {
    document.querySelector('#header').scrollIntoView({ behavior: 'smooth' });
}

/* ============= Get cart list ============= */
getItems('/api/cart/list')

function getItems(url) {
    $.ajax({
            url,
            type: 'GET',
            contentType: "application/json",
            success: function(res) {
                if (res.success) {
                    return showItems(res.viewCart);
                }
            },
            error: function(res) {
                console.log(res)
            }
        })
        // const resp = await fetch(url);
        // const respData = await resp.json();
        // return showItems(respData);
}

/* ============= Show cart ============= */
function showItems(result) {
    if (typeof result.data === 'undefined' || result.data.length < 1) {

        cartlabel.innerHTML = 'Not products in the cart'
            // var node = document.createElement("h3"); // Create a <li> node
            // node.innerHTML = 'Not products in the cart'
            // lateral_cart.appendChild(node)
        cartList.innerText = ''
        totalEl.innerText = ''
    } else {
        // const cartList = document.createElement("ul")
        // cartList.setAttribute("id", "jsddm");
        // cartList.classList.add('cd-cart-items')

        // const cartList = document.getElementById('cart__list')
        if (typeof result.data !== 'undefined' && result.data.length > 0) {
            cartlabel.innerText = ''
            let content = result.data.map((item) => {
                return '<li class="box">' +
                    '<img src="' + item.url + '" alt="" />' +
                    '<div class="content-cart"><h3>' + item.proName + '</h3>' +
                    '<span class="reduce-btn" onclick=minus_to_cart("' + item._id + '")> ❮ </span><span id="qty__item" class="quantity">' +
                    item.qty + '</span>' +
                    ' <span class="add-btn" onclick=add_to_cart("' + item._id + '")> ❯ </span><span class="price"> x ' +
                    (item.newPrice / 22765.00).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) +
                    '</span>' +
                    // '<a href="/cart/delete/' + item._id + '"><i class="fas fa-trash"></i></a>' +
                    // onclick='deleteItem("'+ pd._id +'")'
                    // ("' + item._id + '") deleteItem("' + id + '")

                    '<a class="click" role="button" onclick=' + 'delete_item("' + item._id + '") ><i class="fas fa-trash"></i></a>' +
                    '</div>' +
                    '</li>'
            })
            cartList.innerHTML = content.join('')
            let total = result.total
                // const totalEl = document.createElement("div");
                // totalEl.classList.add("cd-cart-total");

            // const totalEl = document.getElementById('cart__total')
            totalEl.innerHTML = `
                <p>
                    Total
                    <span>
                        ${(total/22765.00).toLocaleString('en-US',{ style: 'currency',currency: 'USD'})}
                    </span>
                </p>
                <a class='checkout-btn' href='/cart/check-out'> Checkout</a>
                <p class='cd-go-to-cart'>
                    <a href='/cart/list'> Go to cart page 
                        <i class="fas fa-arrow-right"></i>
                    </a></p>
            `
                //- $('#cd-cart').append(cartList,totalEl)
            lateral_cart.append(cartList, totalEl)
        }
    }
}

var clickBtn = document.querySelector('.click')

var btn1 = document.querySelector('.btn1')
var btn2 = document.querySelector('.btn2')

function delete_item(id) {
    popupBox.style.display = "block"
    body.classList.add('popup_cart');
    btn1.addEventListener('click', () => {
        popupBox.style.display = "none"
        body.classList.remove('popup_cart');
    })
    btn2.addEventListener("click", () => {
        popupBox.style.display = "none"
        body.classList.remove('popup_cart');
        if (lateral_cart.classList.contains('active')) {
            lateral_cart.classList.remove('active')
        }
        // window.location.href = `/cart/delete/${id}`
        $.post('/api/cart/delete', { idProduct: id }, function(res) {
            if (res.success) {
                $("#numItems").html(res.numItems)
                return resetCart(res)
            } else {
                alert(res.message)
                window.location.href = '/cart/list'
                $("#numItems").html(res.numItems)
            }
        })
    })
}

function deleteItem(id) {
    popupBox.style.display = "block"
    body.classList.add('popup_cart');
    btn1.addEventListener('click', () => {
        popupBox.style.display = "none"
        body.classList.remove('popup_cart');
    })
    btn2.addEventListener("click", () => {
        popupBox.style.display = "none"
        body.classList.remove('popup_cart');
        if (lateral_cart.classList.contains('active')) {
            lateral_cart.classList.remove('active')
        }
        window.location.href = `/cart/delete/${id}`

        // return $.post('/cart/delete', { idProduct: id }, function(res) {
        //     if (!res.success) {
        //         alert(res.message)
        //         window.location.href = '/cart/list'
        //         $("#numItems").html(res.numItems)
        //     } else {
        //         $("#numItems").html(res.numItems)
        //         return resetCart(res)
        //     }
        // })
    })
}

function removeCoupon(code) {
    $.getJSON('/api/cart/coupon?code=' + code, function(res) {
        if (res.success) {
            $('#order-summary').load(window.location.href + " #order-summary")
        }
    })
}

function resetCart(res) {
    $('.popup_alert').addClass("active");
    $('.description').html(res.message)
    body.classList.add('active_cart');
    // if ($('#table_cart').length) {
    //     $('#table_cart').load(window.location.href + ' #table_cart')
    // }
    dismissBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        document.getElementsByClassName("popup_alert")[0].classList.remove("active");
        // if ($("#item__list").length) {
        //     $("#item__list").load(window.location.href + " #item__list")
        // }

        if (lateral_cart.classList.contains('active')) {
            lateral_cart.classList.remove('active')
        }
        if (body.classList.contains('active_cart')) {
            body.classList.remove('active_cart')
        }
    });
    if (shadow_layer.classList.contains('is-visible')) {
        shadow_layer.classList.remove('is-visible')
    }
    // $('#order-summary').load(window.location.href + " #order-summary ")

    getItems('/api/cart/list')
}

function addItem(id, numb) {
    if (parseInt(numb) > 0) {
        // window.location.href = `/cart/add/${id}`
        // $.getJSON(`/api/cart/add/${id}`, function(res) {
        $.post('/api/cart/add/', { idProduct: id }, function(res) {
            if (res.success) {
                // getItems('/api/cart/list')
                $("#numItems").html(res.numItems)
                return resetCart(res)
            }
        })
    } else {
        alert('Sorry, this product is unavailable. Please choose a different combination.')
    }
}

function add_to_cart(id) {
    $.post('/api/cart/add/', { idProduct: id }, function(res) {
        if (res.success) {
            if ($('#table_cart').length) {
                $('#table_cart').load(window.location.href + ' #table_cart')
            }
            return resetCart(res)
        }
    })
}


function minus_to_cart(id) {
    $.post('/api/cart/minus', { idProduct: id }, function(res) {
        if (res.success) {
            if ($('#table_cart').length) {
                $('#table_cart').load(window.location.href + ' #table_cart')
            }
            return resetCart(res)
        }
    })
}

const sendBtn = document.getElementById("send-btn")
sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    sendContact()
})

function sendContact() {
    $.ajax({
        url: '/api/user/contact',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            inputSend: document.getElementById("input__send").value
        }),
        success: function(res) {
            // console.log(res)
            $('#contact_mess').html(res.message)
            setTimeout(() => {
                $('#contact_mess').html('')
            }, 3000)
        },
        error: function(res) {
            console.log(res.responseJSON)
        }
    })
}
/*============ Loader ============== */
// if ($('.loader-wrapper').length) {
$(window).on("load", function() {
    setTimeout(function() {
        $(".loader-wrapper").fadeOut("slow");
    }, 1000)
});
// }

function cancleOrder(id) {
    $.post('/cart/delete-order', { idOrder: id }, function(res) {
        if (res.success) {
            $('#table_orders').load(window.location.href + ' #table_orders')
            $('.popup_alert').addClass("active");
            body.classList.add('active_cart');
            $('.description').html(res.message)
            dismissBtn.addEventListener("click", function() {
                document.getElementsByClassName("popup_alert")[0].classList.remove("active");
                if (body.classList.contains('active_cart')) {
                    body.classList.remove('active_cart')
                }
            });

        }
    })
}
AOS.init();