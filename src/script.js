const nameInput = document.getElementById('input-name');
const form = document.getElementById('form');
const ul = document.getElementById('product-list');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    nameInput.classList.remove('is-invalid');

    const productName = nameInput.value;
    const success = await addProduct(productName);
    if (success) {
        nameInput.value = '';
        ul.innerHTML = '';
        const productList = await getProducts();
        addProductsToList(productList);
    } else {
        nameInput.classList.add('is-invalid');
    }
});

getProducts()
        .then(productList => addProductsToList(productList))
        .catch(console.error);

async function addProduct(product) {
    try {
        const formData = new FormData();
        formData.append('name', product);

        const response = await fetch('/products.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success && response.ok) {
            console.log('Produkt został dodany');
            return true;
        } else {
            console.warn('Produkt nie został dodany:', response.status, data.message);
        }
    } catch (e) {
        console.error('Wystąpił błąd podczas dodawania produktu:', e);
    }

    return false;
}

async function getProducts() {
    try {
        const response = await fetch('/products.php');
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.warn('Nie udało się pobrać produktów:', response.status, data.message);
        }
    } catch (e) {
        console.error('Wystąpił błąd podczas pobierania produktów:', e);
    }

    return [];
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`/products.php?id=${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (data.success && response.ok) {
            console.log('Produkt został usunięty');
            return true;
        } else {
            console.warn('Produkt nie został usunięty:', response.status, data.message);
        }
    } catch (e) {
        console.error('Wystąpił błąd podczas usuwania produktu:', e);
    }

    return false;
}

function addProductsToList(productList) {
    productList.forEach(product => {
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.htmlFor = `product-${product.id}`;
        label.textContent = product.name;

        const checkbox = document.createElement('input');
        checkbox.classList.add('form-check-input', 'me-1');
        checkbox.type = 'checkbox';
        checkbox.id = `product-${product.id}`;

        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.appendChild(checkbox);
        li.appendChild(label);

        ul.appendChild(li);

        addListenerToCheckbox(checkbox, label, li);
    });
}

function addListenerToCheckbox(checkbox, label, li) {
    checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
            label.classList.add('text-decoration-line-through');
        }
        else {
            label.classList.remove('text-decoration-line-through');
        }
    });
}
