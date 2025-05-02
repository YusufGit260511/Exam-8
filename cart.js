const logo = (document.getElementsByClassName('nav1_logo'))[0];
const nav1Button = document.getElementById('nav1_button');
const sectionEmptyButton = document.getElementById('section-empty_button');

logo.addEventListener("click", () => {
    window.location.href = "index.html";
})
nav1Button.addEventListener("click", () => {
    window.location.href = "cart.html";
})
sectionEmptyButton.addEventListener("click", () => {
    window.location.href = "index.html";
})

async function showCart() {
    try {
        const res = await fetch('http://localhost:3000/cart');
        const data = await res.json();

        const sectionPizzas = document.getElementsByClassName('section-cart')[0];
        sectionPizzas.innerHTML = '';

        data.forEach((element) => {
            let type = element.type === 'thin' ? 'тонкое тесто' : 'толстое тесто';
            let size = element.size === 'small' ? '25 см' : element.size === 'medium' ? '30 см' : '35 см';

            const box = document.createElement('div');
            box.className = 'cart-item';
            box.innerHTML = `
             <div class="cart-info">
                        <img src="${element.img}"
                            alt="pizza">
                        <div class="cart-details">
                            <strong>${element.name}</strong>
                            <span>${type}, ${size}</span>
                        </div>
                    </div>
                    <div class="cart-quantity">
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
                    </div>
                    <div class="cart-price">${element.price}</div>
                    <div class="cart-remove">×</div>
            `
            sectionPizzas.append(box);
        })

    } catch (error) {
        console.log(error);
    }
}

showCart();