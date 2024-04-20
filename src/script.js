const xIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n' +
        '  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>\n' +
        '</svg>';

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
        await refreshList();
    } else {
        nameInput.classList.add('is-invalid');
    }
});

refreshList().catch(console.error);

function addProductsToList(productList) {
    productList.forEach(product => {
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.htmlFor = `product-${product.id}`;
        label.textContent = product.name;
        if (product.disabled) {
            label.classList.add('text-decoration-line-through');
        }

        const checkbox = document.createElement('input');
        checkbox.classList.add('form-check-input', 'me-2');
        checkbox.type = 'checkbox';
        checkbox.id = `product-${product.id}`;
        if (product.disabled) {
            checkbox.checked = true;
        }

        const div = document.createElement('div');
        div.classList.add('form-check');
        div.appendChild(checkbox);
        div.appendChild(label);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.innerHTML = xIcon;

        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.appendChild(div);
        li.appendChild(deleteButton);

        ul.appendChild(li);

        addListenerToCheckbox(product.id, checkbox, label);
        addListenerToDeleteButton(product.id, deleteButton);
    });
}

function addListenerToCheckbox(id, checkbox, label) {
    checkbox.addEventListener('change', async () => {
        const success = await disableProduct(id, checkbox.checked);
        if (success) {
            if (checkbox.checked) {
                label.classList.add('text-decoration-line-through');
            } else {
                label.classList.remove('text-decoration-line-through');
            }
        } else {
            checkbox.checked = !checkbox.checked;
        }
    });
}

function addListenerToDeleteButton(id, deleteButton) {
    deleteButton.addEventListener('click', async () => {
        const success = await deleteProduct(id);
        if (success) {
            await refreshList();
        }
    });
}

async function refreshList() {
    const productList = await getProducts();
    ul.innerHTML = '';
    addProductsToList(productList);
}

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

async function disableProduct(id, disabled) {
    try {
        const response = await fetch(`/products.php?id=${encodeURIComponent(id)}&disabled=${disabled ? '1' : '0'}`, {
            method: 'PUT'
        });
        const data = await response.json();

        if (data.success && response.ok) {
            console.log('Stan produktu został zmieniony');
            return true;
        } else {
            console.warn('Stan produktu nie został zmieniony:', response.status, data.message);
        }
    } catch (e) {
        console.error('Wystąpił błąd podczas zmiany stanu produktu:', e);
    }

    return false;
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
