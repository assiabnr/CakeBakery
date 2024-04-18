// Fonction pour initialiser le panier
function initCart() {
    // Récupérer le panier depuis le stockage local s'il existe, sinon initialiser un nouveau panier
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mettre à jour l'affichage du panier
    updateCart(cart);
    
    // Mettre à jour le numéro sur le panier
    updateCartNumber(cart.length);
}

// Fonction pour mettre à jour le numéro sur le panier
function updateCartNumber(quantity) {
    var cartNumberElement = document.getElementById('cart-number');
    if (cartNumberElement) {
        cartNumberElement.textContent = quantity.toString();
    }
}

// Fonction pour calculer la totalité des quantités des produits dans le panier
function calculateTotalQuantity(cart) {
    var totalQuantity = 0;
    cart.forEach(function(item) {
        totalQuantity += item.quantity;
    });
    return totalQuantity;
}

// Fonction pour mettre à jour l'affichage du panier
function updateCart(cart) {
    // Récupérer l'élément du corps du tableau du panier
    var cartTableBody = document.getElementById('cart-table-body');
    // Récupérer l'élément pour le sous-total du panier
    var subTotalElement = document.getElementById('sub-total');

    // Vérifier si l'élément existe avant de le mettre à jour
    if (cartTableBody && subTotalElement) {
        // Réinitialiser le contenu du corps du tableau du panier
        cartTableBody.innerHTML = '';

        // Mettre à jour le contenu du corps du tableau du panier avec les produits du panier
        cart.forEach(function(item, index) {
            if (item && item.image && item.name && item.price && item.quantity ) {
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="img/cake-feature/${item.image}" alt="${item.name}" class="cart-thumb"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><input type="number" class="quantity-input" value="${item.quantity}" data-index="${index}"></td>
                    <td class="total-price">$${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="remove-from-cart" data-name="${item.name}" data-index="${index}">Remove</button></td>
                `;
                cartTableBody.appendChild(row);
            }
        });

        // Mettre à jour les événements pour la modification de la quantité
        var quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(function(input) {
            input.addEventListener('change', function(event) {
                var index = parseInt(event.target.dataset.index);
                var newQuantity = parseInt(event.target.value);

                // Mettre à jour la quantité dans le panier
                cart[index].quantity = newQuantity;

                // Mettre à jour le prix total du produit
                var totalCell = input.parentNode.nextElementSibling;
                var productTotal = cart[index].price * newQuantity;
                totalCell.textContent = `$${productTotal.toFixed(2)}`;

                // Mettre à jour le sous-total du panier
                var subTotal = calculateSubTotal(cart);
                subTotalElement.textContent = `$${subTotal.toFixed(2)}`;

                // Mettre à jour le total du panier
                var cartTotalElement = document.getElementById('cart-total');
                if (cartTotalElement) {
                    var cartTotal = calculateTotal(cart);
                    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
                }

                // Mettre à jour le panier dans le stockage local
                localStorage.setItem('cart', JSON.stringify(cart));

                updateCartNumber(cart.length);

            });
        });

        // Mettre à jour les événements pour supprimer un produit du panier
        var removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
        removeFromCartButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                var indexToRemove = parseInt(button.dataset.index);
                // Supprimer le produit du panier
                cart.splice(indexToRemove, 1);
                // Mettre à jour l'affichage du panier
                updateCart(cart);
                // Mettre à jour le panier dans le stockage local
                localStorage.setItem('cart', JSON.stringify(cart));
            });
        });

        // Mettre à jour le sous-total du panier
        var subTotal = calculateSubTotal(cart);
        subTotalElement.textContent = `$${subTotal.toFixed(2)}`;

        // Mettre à jour le total du panier
        var cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            var cartTotal = calculateTotal(cart);
            cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
        }
    }
}


// Fonction pour calculer le sous-total du panier
function calculateSubTotal(cart) {
    return cart.reduce(function(total, item) {
        return total + (item.price * item.quantity);
    }, 0);
}

// Fonction pour calculer le total du panier
function calculateTotal(cart) {
    // Ici, vous pouvez ajouter le calcul de la taxe, des frais de livraison, etc.
    return calculateSubTotal(cart);
}

// Fonction pour afficher une animation de bulle lorsqu'un produit est ajouté au panier
function showBubbleAnimation() {
    // Créer un conteneur pour la bulle
    var container = document.createElement('div');
    container.classList.add('bubble-container');
    document.body.appendChild(container);

    // Créer la bulle
    var bubble = document.createElement('div');
    bubble.classList.add('bubble-animation');
    bubble.textContent = 'Produit ajouté !';

    // Ajouter la bulle au conteneur
    container.appendChild(bubble);

    // Animer la bulle
    setTimeout(function() {
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(-100%)';
    }, 6000); // Durée de l'animation en millisecondes

    // Supprimer la bulle et le conteneur après l'animation
    setTimeout(function() {
        container.remove();
    }, 6500); // Durée de l'animation + temps de suppression
}





// Fonction pour ajouter un produit au panier
function addToCart(product) {
    // Récupérer le panier depuis le stockage local s'il existe, sinon initialiser un nouveau panier
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Vérifier si le produit est déjà dans le panier
    var existingProductIndex = cart.findIndex(function(item) {
        return item.name === product.name;
    });

    if (existingProductIndex !== -1) {
        // Si le produit existe déjà dans le panier, augmenter la quantité
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Sinon, ajouter le produit au panier
        cart.push(product);
    }

    // Mettre à jour le panier dans le stockage local
    localStorage.setItem('cart', JSON.stringify(cart));
    // Afficher l'animation de bulle
    showBubbleAnimation();

    // Mettre à jour l'affichage du panier
    updateCart(cart);
    
    
}

// Fonction pour initialiser les événements
function initEvents() {
    // Ajouter un gestionnaire d'événements à l'élément de quantité
    var quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function(event) {
            var newQuantity = parseInt(event.target.value); // Récupérer la nouvelle quantité
            updateCartQuantity(newQuantity); // Mettre à jour la quantité dans le panier
        });
    }

    // Ajouter un événement clic à chaque bouton "Ajouter au panier"
    var addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Empêcher le comportement par défaut du bouton

            // Récupérer les détails du produit à partir du bouton cliqué
            var product = {
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                quantity: 1,
                image: button.dataset.image // Ajout de la récupération de l'image du produit
            };

            // Ajouter le produit au panier
            addToCart(product);

            // Rediriger vers la page du panier
            window.location.href = './cart.html';
        });
    });

    // Ajouter un événement clic à chaque bouton "Supprimer"
    var removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
    removeFromCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Récupérer le nom du produit à supprimer
            var name = button.dataset.name;

            // Supprimer le produit du panier
            removeFromCart(name);
        });
    });
    
}

// Fonction pour mettre à jour la quantité dans le panier
function updateCartQuantity(newQuantity) {
    // Récupérer le panier depuis le stockage local s'il existe, sinon initialiser un nouveau panier
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Mettre à jour la quantité du premier produit dans le panier
    if (cart.length > 0) {
        cart[0].quantity = newQuantity;
    }

    // Mettre à jour le panier dans le stockage local
    localStorage.setItem('cart', JSON.stringify(cart));

    // Mettre à jour l'affichage du panier
    updateCart(cart);
}

// Fonction pour initialiser le panier et les détails du produit
function initCartAndProductDetails() {
    // Récupérer le panier depuis le stockage local s'il existe, sinon initialiser un nouveau panier
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mettre à jour l'affichage du panier
    updateCart(cart);
    
    // Mettre à jour les détails du produit
    updateProductDetails(cart);

    // Mettre à jour le numéro sur le panier
    updateCartNumber(cart.length);
}

// Fonction pour mettre à jour les détails du produit
function updateProductDetails(cart) {
    // Récupérer l'élément d'entrée de quantité
    var quantityInput = document.getElementById('quantity');

    // Vérifier si l'élément existe avant de tenter d'accéder à sa propriété 'value'
    if (quantityInput) {
        // Mettre à jour la valeur de l'élément d'entrée de quantité avec la quantité du premier produit dans le panier
        if (cart.length > 0) {
            quantityInput.value = cart[0].quantity;
        }
    }
}
// Fonction pour mettre à jour le prix total dans la section de détails de facturation
function updateBillingTotal(cart) {
    // Récupérer le sous-total du panier
    var subTotal = calculateSubTotal(cart);

    // Mettre à jour le prix total dans la section de détails de facturation
    var orderTotalElement = document.getElementById('order-total');
    if (orderTotalElement) {
        orderTotalElement.textContent = '$' + subTotal.toFixed(2);
    }

    // Mettre à jour le sous-total dans la section de détails de facturation
    var orderSubtotalElement = document.getElementById('order-subtotal');
    if (orderSubtotalElement) {
        orderSubtotalElement.textContent = '$' + subTotal.toFixed(2);
    }
}

// Fonction principale
function main() {
    // Récupérer le panier depuis le stockage local s'il existe, sinon initialiser un nouveau panier
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Mettre à jour le prix total dans la section de détails de facturation
    updateBillingTotal(cart);

  
    
    // Mettre à jour les détails du panier dans la section de détails de facturation
    var cartDetailsElement = document.getElementById('cart-details');
    if (cartDetailsElement) {
        cartDetailsElement.innerHTML = '';

        cart.forEach(function(item) {
            var itemTotal = item.price * item.quantity;
            var itemHTML = `
                <h5>${item.name} x ${item.quantity} <span>$${itemTotal.toFixed(2)}</span></h5>
            `;
            cartDetailsElement.innerHTML += itemHTML;
        });
    } 
     // Appeler les autres fonctions d'initialisation
    initCart();
    initEvents();
    updateCart(cart);
    updateCartNumber(cart.length);
    updateProductDetails(cart);
}

// Appeler la fonction principale au chargement de la page
document.addEventListener('DOMContentLoaded', main);
