let accessToken = localStorage.getItem("accessToken") || "";

/* =========================
   PAGE AUTHENTICATION GUARD
========================= */

async function checkAuthentication() {
  const protectedPages = ["dashboard.html", "profile.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (!protectedPages.includes(currentPage)) {
    return;
  }

  if (!accessToken) {
    window.location.replace("index.html");
    return;
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      clearAccessToken();
      window.location.replace("index.html");
      return;
    }

    // Authentication successful → show page
    document.body.classList.add("authenticated");

  } catch (error) {
    clearAccessToken();
    window.location.replace("index.html");
  }
}

checkAuthentication();


/* =========================
   HELPERS
========================= */

function saveAccessToken(token) {
  accessToken = token;
  localStorage.setItem("accessToken", token);
}

function clearAccessToken() {
  accessToken = "";
  localStorage.removeItem("accessToken");
}

/* =========================
   HELPERS
========================= */

function saveAccessToken(token) {
  accessToken = token;
  localStorage.setItem("accessToken", token);
}

function clearAccessToken() {
  accessToken = "";
  localStorage.removeItem("accessToken");
}

function getErrorMessage(result) {
  if (result.message) {
    return result.message;
  }

  if (result.errors) {
    if (Array.isArray(result.errors)) {
      return result.errors
        .map((error) => error.msg || error.message)
        .join(", ");
    }

    return JSON.stringify(result.errors);
  }

  return "Something went wrong";
}

/* =========================
   REGISTER
========================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("registerMessage");

    const password = document.getElementById("registerPassword").value;
    const confirmPassword =
      document.getElementById("registerConfirmPassword").value;

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    const data = {
      name: document.getElementById("registerName").value,
      email: document.getElementById("registerEmail").value,
      password,
      confirmPassword
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        message.textContent =
          result.message || "Registration successful.";

        registerForm.reset();

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        message.textContent = getErrorMessage(result);
      }
    } catch (error) {
      message.textContent = "Unable to connect to the server.";
    }
  });
}

/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("loginMessage");

    const data = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        saveAccessToken(result.accessToken);

        message.textContent = "Login successful.";

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 500);
      } else {
        message.textContent = getErrorMessage(result);
      }
    } catch (error) {
      message.textContent = "Unable to connect to the server.";
    }
  });
}

/* =========================
   PRODUCTS
========================= */

const productForm = document.getElementById("productForm");

if (productForm) {
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = document.getElementById("productMessage");

    if (!accessToken) {
      message.textContent = "Please login first.";
      return;
    }

    const data = {
      name: document.getElementById("productName").value,
      price: Number(document.getElementById("productPrice").value),
      stock: Number(document.getElementById("productStock").value)
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        productForm.reset();
        loadProducts();
      } else {
        message.textContent = getErrorMessage(result);
      }
    } catch (error) {
      message.textContent = "Unable to connect to the server.";
    }
  });

  loadProducts();
}

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {
  const container = document.getElementById("products");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="empty-products">
      Loading products...
    </div>
  `;

  try {
    const response = await fetch("/api/products", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const products = await response.json();

    if (!response.ok) {
      container.innerHTML = `
        <div class="empty-products">
          ${getErrorMessage(products)}
        </div>
      `;
      return;
    }

    container.innerHTML = "";

    const count = document.getElementById("productCount");

    if (count) {
      count.textContent =
        `${products.length} ${products.length === 1 ? "product" : "products"}`;
    }

    if (products.length === 0) {
      container.innerHTML = `
        <div class="empty-products">
          <h3>No products yet</h3>
          <p>Add your first product using the form above.</p>
        </div>
      `;
      return;
    }

    products.forEach((product) => {
      const div = document.createElement("div");

      div.className = "product";

      const firstLetter = product.name
        ? product.name.charAt(0).toUpperCase()
        : "P";

      div.innerHTML = `
        <div class="product-icon">${firstLetter}</div>

        <h3>${escapeHtml(product.name)}</h3>

        <div class="product-details">

          <div class="product-detail">
            <span>Price</span>
            <strong>₹${Number(product.price).toFixed(2)}</strong>
          </div>

          <div class="product-detail">
            <span>Stock</span>
            <strong>${product.stock}</strong>
          </div>

        </div>

        <div class="product-actions">

          <button
            class="edit-button"
            onclick="updateProduct('${product._id}')"
          >
            Edit
          </button>

          <button
            class="delete-button"
            onclick="deleteProduct('${product._id}')"
          >
            Delete
          </button>

        </div>
      `;

      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = `
      <div class="empty-products">
        Unable to load products.
      </div>
    `;
  }
}

/* =========================
   UPDATE PRODUCT
========================= */

async function updateProduct(id) {
  if (!accessToken) {
    alert("Please login first.");
    return;
  }

  const name = prompt("Enter product name:");
  const price = prompt("Enter product price:");
  const stock = prompt("Enter product stock:");

  if (name === null || price === null || stock === null) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        stock: Number(stock)
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(getErrorMessage(result));
      return;
    }

    loadProducts();
  } catch (error) {
    alert("Unable to connect to the server.");
  }
}

/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(id) {
  if (!accessToken) {
    alert("Please login first.");
    return;
  }

  const confirmed = confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      alert(getErrorMessage(result));
      return;
    }

    loadProducts();
  } catch (error) {
    alert("Unable to connect to the server.");
  }
}

/* =========================
   PROFILE
========================= */

async function loadProfile() {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileAvatar = document.getElementById("profileAvatar");
  const message = document.getElementById("userMessage");

  if (!profileName || !profileEmail) {
    return;
  }

  if (!accessToken) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      clearAccessToken();
      window.location.href = "index.html";
      return;
    }

    profileName.textContent = result.user.name;
    profileEmail.textContent = result.user.email;

    if (profileAvatar) {
      profileAvatar.textContent =
        result.user.name.charAt(0).toUpperCase();
    }

    if (message) {
      message.textContent = "";
    }
  } catch (error) {
    message.textContent = "Unable to load profile.";
  }
}

loadProfile();

/* =========================
   LOGOUT
========================= */

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    if (!accessToken) {
      window.location.href = "index.html";
      return;
    }

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      clearAccessToken();

      if (response.ok) {
        window.location.href = "index.html";
      } else {
        window.location.href = "index.html";
      }
    } catch (error) {
      clearAccessToken();
      window.location.href = "index.html";
    }
  });
}

/* =========================
   HTML ESCAPING
========================= */

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}