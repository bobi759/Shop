let cart_id = null;


$(document).ready(() => {
    getCartId();
});

function getCartId() {
    $.ajax({
        method: "GET",
        url: `http://localhost:8000/api/current-user/`,
        success: (data) => {
            cart_id = data["cart_id"];
            getAllBookNames();
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function getAllBookNames() {
    $.ajax({
        method: "GET",
        url: `http://localhost:8000/api/cart/${cart_id}/`,
        success: (cart) => {
            const books = cart["items"];
            const cartItemsContainer = $("#cart-items");
            cartItemsContainer.empty();

            if (books.length === 0) {
                $("#cart-empty-message").show();
            } else {
                $("#cart-empty-message").hide();
                books.forEach(item => {
                    addEmptyCard(item);
                });
            }

            $(".order-summary-subtotal").text(`$${cart.grand_total}`);
            $(".order-summary-total").text(`$${cart.grand_total}`);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

function addEmptyCard(item) {
    let cardHTML = `
            <div class="card border shadow-none">
                <div class="card-body" id="cart-item-${item.id}">
                    <div class="d-flex align-items-start border-bottom pb-3">
                        <div class="me-4">
                            <img src="${item.product.image}" alt="Product Image" class="avatar-lg rounded">
                        </div>
                        <div class="flex-grow-1 align-self-center overflow-hidden">
                            <h5 class="text-truncate font-size-18">
                                <a href="#" class="text-dark">${item.product.title}</a>
                            </h5>
                            <p class="text-muted mb-0">
                                <i class="bx bxs-star text-warning"></i><i class="bx bxs-star text-warning"></i>
                                <i class="bx bxs-star text-warning"></i><i class="bx bxs-star text-warning"></i>
                                <i class="bx bxs-star-half text-warning"></i>
                            </p>
                            <p class="mb-0 mt-1">Genre : <span class="fw-medium">${item.product.genre.name}</span></p>
                            <p class="mb-0 mt-1">Quantity : <span class="fw-medium">${item.quantity}</span></p>
                        </div>
                        <div class="flex-shrink-0 ms-2">
                            <ul class="list-inline mb-0 font-size-16">
                                <li class="list-inline-item delete-obj">
                                    <a href="#" class="text-muted px-1" onclick="deleteItem(${item.id})">
                                        <i class="mdi mdi-trash-can-outline"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row align-items-center mt-3 px-3">
                        <div class="col">
                            <label class="form-label">Price</label>
                            <h5>$${item.product.price}</h5>
                        </div>
                        <div class="col text-end">
                            <label class="form-label">Total</label>
                            <h5 id="total-price-${item.id}">$${item.subtotal.toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
            </div>
        `;
    $("#cart-items").append(cardHTML);
}


function deleteItem(item_id) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    $.ajax({
        method: "DELETE",
        url: `http://localhost:8000/api/cart/${cart_id}/items/${item_id}/`,
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
        },
        success: (data) => {
            $(`#cart-item-${item_id}`).parent().remove();
            $(".order-summary-subtotal").text(`$${data.new_total_price}`);
            $(".order-summary-total").text(`$${data.new_total_price}`);

            if ($("#cart-items").children().length === 0) {
                $("#cart-empty-message").show();
            }
            showToastNow("✅ Product was deleted successfully!");
        },
        error: (error) => {
            showErrorToast(error);
        }
    });
}

function confirmOrder() {
    const hasItems = $("#cart-items").children().length > 0;

    if (!hasItems) {
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open").css("padding-right", "");

        const modalEl = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();

        showErrorToast("🛒 Your cart is empty. Please add some books first.");

        return;
    }

    $.ajax({
        method: "POST",
        url: `http://localhost:8000/api/order/`,
        contentType: "application/json",
        data: JSON.stringify({ "cart_id": cart_id }),
        success: () => {
            showToastAfterRedirect("✅ Your order was placed successfully!");
            window.location.href = homeUrl;
        },
        error: (xhr) => {
            try {
                const message = xhr.responseJSON?.detail || "An unexpected error occurred.";
                showErrorToast(message);
            } catch (e) {
                showErrorToast("An unexpected error occurred.");
            }
        }
    });
}

