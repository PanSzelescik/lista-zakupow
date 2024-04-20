//addProduct('Testowy produkt');
//getProducts();
//deleteProduct('6623e3ba2c5c0');

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
            method: 'DELETE',
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
