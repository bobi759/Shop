let user_id = null;
let cart_id = null;


$(document).ready(function () {
    takeBook();
    loadReviews();
    getCartId();
});

function takeBook() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8000/api/book/${book_id}`,
        success: (book) => {
            console.log(book)
            loadBookDetails(book)
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText);
        }
    })
}

function loadReviews() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8000/api/book/${book_id}/reviews/`,
        success: (reviews) => {
            console.log(reviews)
            const container = $('#reviews-carousel-inner');
            container.empty();

            if (reviews.length === 0) {
                container.append(`
        <div class="carousel-item active">
            <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
                <div>
                    <p class="text-muted fs-4 fw-semibold text-center mb-0">
                        No reviews yet. Be the first to share your thoughts!
                    </p>
                </div>
            </div>
        </div>
    `);
                $('.carousel-control-prev, .carousel-control-next').hide();
                return;
            }

            if (reviews.length === 1) {
                $('.carousel-control-prev, .carousel-control-next').hide();
            } else {
                $('.carousel-control-prev, .carousel-control-next').show();
            }

            reviews.forEach((review, index) => {
                const isActive = index === 0 ? 'active' : '';
                const img = review.user.profile.profile_picture;

                const html = `
                        <div class="carousel-item ${isActive}">
                            <img class="rounded-circle shadow-1-strong mb-4"
                                 src="${img}"
                                 alt="avatar" style="width: 150px; height: 150px; object-fit: cover;"  />
                            <div class="row d-flex justify-content-center">
                                <div class="col-lg-8">
                                    <h5 class="mb-3">${review.user.profile.first_name} ${review.user.profile.last_name}</h5>
                                    <p>${review.title}</p>
                                    <p class="text-muted">
                                        <i class="fas fa-quote-left pe-2"></i>
                                        ${review.description}
                                    </p>
                                </div>
                            </div>
                        </div>`;
                container.append(html);
            });
        },
        error: function (xhr) {
            console.error("Error loading reviews:", xhr.responseText);
        }
    });
}


function getCartId() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8000/api/current-user/",
        success: (data) => {
            cart_id = data["cart_id"];
            user_id = data["id"]
        },
        error: (error) => {
            console.log(error);
        }
    });
}


function loadBookDetails(book) {
    let bookDetails = `
        <div class="col-md-5">
            <img src="${book.image}" class="book-image rounded" alt="${book.title}">
        </div>
        <div class="col-md-7">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="${bookDetailsPatters.home}">Home</a></li>
                    <li class="breadcrumb-item"><a href="${bookDetailsPatters.allBooks}">All books</a></li>
                    <li class="breadcrumb-item"><a href="${bookDetailsPatters.genreBase}${encodeURIComponent(book.genre.name)}">${book.genre.name}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${book.title}</li>
                </ol>
            </nav>
            <h1 class="fw-bold">${book.title}</h1>
            <p class="text-muted">by <strong>${book.author}</strong></p>
            <h3 class="text-primary">$${book.price}</h3>
            <form id="add-to-cart-form">
                <label for="quantity" class="form-label">Quantity</label>
                <input type="number" id="quantity" class="form-control w-25" name="quantity" value="1" min="1">
                <button type="submit" class="btn btn-warning mt-3 px-4 py-2">Add To Cart</button>
            </form>
            <h4 class="mt-4">Book Details</h4>
            <p>${book.description}</p>
        </div>`;
    $("#book-details-row").html(bookDetails);
}


$(document).on('submit', '#add-to-cart-form', function (e) {
    e.preventDefault();
    const quantity = document.getElementById("quantity").value;

    $.ajax({
        type: "POST",
        url: `http://localhost:8000/api/cart/${cart_id}/items/`,
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            "product_id": book_id,
            "quantity": quantity,
        }),
        success: function () {
            console.log(`Posted on ${cart_id}`);
            localStorage.setItem("toastMessage", "✅ Your product was added to cart successfully!");
            window.location.href = bookDetailsPatters.allBooks;
        },
        error: function (xhr) {
            console.error("Error:", xhr.responseText);
        }
    });
});

function postReview() {
    const title = document.getElementById("review-title").value.trim();
    const description = document.getElementById("review-description").value.trim();

    if (!title || !description) {
        const reviewModalEl = document.getElementById('reviewModal');
        const reviewModalInstance = bootstrap.Modal.getInstance(reviewModalEl);
        if (reviewModalInstance) {
            reviewModalInstance.hide();
        }

        reviewModalEl.addEventListener('hidden.bs.modal', function cleanup() {
            $('body').removeClass('modal-open').css('padding-right', '');
            $('.modal-backdrop').remove();
            $('#reviewModal').removeClass('show'); // in case it's stuck

            showErrorToast("⚠️ Please fill in both the title and description of your review.");

            reviewModalEl.removeEventListener('hidden.bs.modal', cleanup);
        });

        return;
    }

    $.ajax({
        method: "POST",
        url: `http://localhost:8000/api/book/${book_id}/reviews/`,
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            title: title,
            description: description,
            book: book_id,
            user: user_id
        }),
        success: function () {
            const reviewModalEl = document.getElementById('reviewModal');
            const modalInstance = bootstrap.Modal.getInstance(reviewModalEl);
            modalInstance.hide();

            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

            loadReviews();
            document.getElementById("review-form").reset();
            showToastNow("✅ Book review was posted successfully!")

        },
        error: function (xhr) {
        }
    });
}
