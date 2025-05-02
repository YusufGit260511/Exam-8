const nav2SortUlLi1 = document.getElementById("nav2-sortUl_li1");
const nav2SortUlLi = document.querySelectorAll(".nav2-sortUl_li");
const nav2SortImg = document.getElementById("nav2-sort_img");
const nav2SortUlDivP = document.getElementById("nav2-sortUlDiv_p");
const nav2SortUl = document.getElementById('nav2-sortUl');

const sectionH1 = document.getElementById('section_h1');
const categoryAll = document.getElementById('category-all');
const nav2CategoriesUlLi = document.querySelectorAll(".nav2-categoriesUl_li");

const sectionPizzas = document.getElementsByClassName('section-pizzas')[0];
const logo = document.getElementsByClassName('nav1_logo')[0];
const nav1Button = document.getElementById('nav1_button');
const nav1ButtonLi1 = document.getElementById('nav1_button_li1');
const nav1ButtonLi2 = document.getElementById('nav1_button_li2');

let nav2SortUlLiState = false;

let activeSortTextContent = document.querySelector(".activeSort");
nav2SortUlDivP.textContent = activeSortTextContent.textContent;

async function clearCart() {
    try {
        console.log(1)
        const res = await fetch('http://localhost:3000/cart');
        const data = await res.json();
        data.forEach((element) => {
            fetch(`http://localhost:3000/cart/${element.id}`, { method: 'DELETE' });
        })
    } catch (error) {
        console.log(error);
    }
}
clearCart();

nav2SortUlDivP.addEventListener("click", () => {
    if (nav2SortUlLiState == false) {
        nav2SortUlLi.forEach((li) => {
            li.style.display = "block";
            nav2SortUl.style.display = "block";
        });
        nav2SortImg.style.transform = "rotate(0)";
        nav2SortUlLiState = true;
    } else {
        nav2SortUlLi.forEach((li) => {
            li.style.display = "none";
            nav2SortUl.style.display = "none";
        });
        nav2SortImg.style.transform = "rotate(180deg)";
        nav2SortUlLiState = false;
    }
});

document.addEventListener("click", (e) => {
    if (
        nav2SortUlLiState === true &&
        !nav2SortUl.contains(e.target) &&
        !nav2SortUlDivP.contains(e.target)
    ) {
        nav2SortUlLi.forEach((li) => {
            li.style.display = "none";
        });
        nav2SortUl.style.display = "none";
        nav2SortImg.style.transform = "rotate(180deg)";
        nav2SortUlLiState = false;
    }
});

nav2SortUlLi.forEach((li) => {
    li.addEventListener("click", () => {
        const sortClassActive = document.querySelector(".activeSort");
        sortClassActive.classList.remove('activeSort');
        li.classList.add('activeSort');
        nav2SortUlDivP.textContent = li.textContent;

        showPizzas();
    });
});

nav2CategoriesUlLi.forEach((li) => {
    li.addEventListener("click", () => {
        const sortClassActive = document.querySelector(".activeCategory");
        sortClassActive.classList.remove('activeCategory');
        li.classList.add('activeCategory');
        sectionH1.textContent = li.textContent + ' пиццы';

        showPizzas();
    });
});

async function showPizzas() {
    try {
        console.log(2)
        const res = await fetch('https://run.mocky.io/v3/371babe1-8bff-47c3-9c21-10b99348bc94');
        let data = await res.json();

        console.log(data);

        const activeCategory = document.getElementsByClassName('activeCategory')[0];
        const activeCategoryId = activeCategory.getAttribute('id');

        if (activeCategoryId !== 'category-all') {
            data = data.filter(filtered => filtered.category === activeCategoryId.replace('category-', ''));
        }

        const activeSort = document.getElementsByClassName('activeSort')[0];
        const activeSortValue = activeSort.getAttribute('value');

        if (activeSortValue === 'sort-popularity') {
            data.sort((a, b) => a.popularity - b.popularity);
        } else if (activeSortValue === 'sort-price') {
            data.sort((a, b) => parseFloat(a.price.thin['25sm']) - parseFloat(b.price.thin['25sm']));
        } else if (activeSortValue === 'sort-name') {
            data.sort((a, b) => a.name.localeCompare(b.name));
        }

        sectionPizzas.innerHTML = '';
        data.forEach((element) => {
            const box = document.createElement('div');
            box.className = 'section-pizzas-pizza';

            box.innerHTML = `
                <img src="${element.img}" alt="" class="section-pizzas-pizza_img">
                <h3 class="section-pizzas-pizza_name">${element.name}</h3>
                <div class="section-pizzas-pizza-div">
                    <div class="section-pizzas-pizza-div-type">
                        <div class="section-pizzas-pizza-div-type typee thin activeType" value="thin">тонкое</div>
                        <div class="section-pizzas-pizza-div-type typee traditional" value="traditional">традиционное</div>
                    </div>
                    <div class="section-pizzas-pizza-div-size">
                        <div class="section-pizzas-pizza-div-size sizee small activeSize" value="small">25 см.</div>
                        <div class="section-pizzas-pizza-div-size sizee medium" value="medium">30 см.</div>
                        <div class="section-pizzas-pizza-div-size sizee large" value="large">35 см.</div>
                    </div>
                </div>
                <div class="section-pizzas-pizza-quickInfo">
                    <h4 class="section-pizzas-pizza-quickInfo-price">${element.price.thin["25sm"]}</h4>
                    <button type="button" class="section-pizzas-pizza-quickInfo-add">
                        <img src="img/addToCart.png" alt="" class="addToCart-img">
                        Добавить
                    </button>
                </div>
            `;

            sectionPizzas.appendChild(box);

            // === ПОДКЛЮЧЕНИЕ ЛОГИКИ ОБНОВЛЕНИЯ ЦЕН ===
            const types = box.querySelectorAll('.typee');
            const sizes = box.querySelectorAll('.sizee');
            const priceTag = box.querySelector('.section-pizzas-pizza-quickInfo-price');

            function updatePrice() {
                const activeType = box.querySelector('.activeType').getAttribute('value');
                const activeSize = box.querySelector('.activeSize').getAttribute('value');
                let sizeKey = activeSize === 'small' ? '25sm' : activeSize === 'medium' ? '30sm' : '35sm';
                priceTag.textContent = element.price[activeType][sizeKey];
            }

            types.forEach(type => {
                type.addEventListener('click', () => {
                    types.forEach(t => t.classList.remove('activeType'));
                    type.classList.add('activeType');
                    updatePrice();
                });
            });

            sizes.forEach(size => {
                size.addEventListener('click', () => {
                    sizes.forEach(s => s.classList.remove('activeSize'));
                    size.classList.add('activeSize');
                    updatePrice();
                });
            });

            const addPizzaToCartButton = box.querySelector('.section-pizzas-pizza-quickInfo-add');
            addPizzaToCartButton.addEventListener("click", (e) => {
                e.preventDefault(); // Перенесено сюда
                const activeType = box.querySelector('.activeType').getAttribute('value');
                const activeSize = box.querySelector('.activeSize').getAttribute('value');
                const sizeKey = activeSize === 'small' ? '25sm' : activeSize === 'medium' ? '30sm' : '35sm';
            
                let i = 0;
                const pizza = {
                    id: Date.now(),
                    name: element.name,
                    img: element.img,
                    price: element.price[activeType][sizeKey],
                    quantity: 1,
                    type: activeType,
                    size: activeSize,
                };
            
                async function addToCart() { // Убрал параметр e, так как он больше не нужен
                    try {
                        const response = await fetch('http://localhost:3000/cart', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(pizza)
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            
                const pizzaPrice = priceTag.textContent;
                let currentTotal = parseFloat(nav1ButtonLi1.textContent || "0");
                let newPrice = parseFloat(pizzaPrice);
                nav1ButtonLi1.textContent = currentTotal + newPrice + ' ₽';
            
                addToCart(); // Теперь вызываем без параметра e
            });

        });
    } catch (error) {
        console.log(error);
    }
}

showPizzas()

async function updateCartTotal() {
    try {
        const response = await fetch('http://localhost:3000/cart');
        const cartItems = await response.json();
        
        // Считаем общую сумму
        let total = 0;
        cartItems.forEach(item => {
            total += parseFloat(item.price) * item.quantity;
        });
        
        // Обновляем отображение суммы
        nav1ButtonLi1.textContent = total + ' ₽';

        // Обновляем отображение количества пицц
        nav1ButtonLi2.innerHTML = `
            <img src="img/cart.svg" alt="">
            ${cartItems.length}
        `;
        
        // Можно также вернуть сумму для использования в других местах
        return total;
    } catch (error) {
        console.error('Ошибка при обновлении суммы корзины:', error);
        nav1ButtonLi1.textContent = '0 ₽';
        return 0;
    }
}
updateCartTotal()


logo.addEventListener("click", () => {
    window.location.href = "index.html";
});
nav1Button.addEventListener("click", () => {
    window.location.href = "cart.html";
});
