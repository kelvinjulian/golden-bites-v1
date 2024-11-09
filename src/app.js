//! Alpine JS
document.addEventListener("alpine:init", () => {
  //! Products
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Golden Choco Delight",
        img: "1.jpg",
        price: 40000,
      },
      {
        id: 2,
        name: "Golden Treats Mix",
        img: "2.jpg",
        price: 99000,
      },
      {
        id: 3,
        name: "Golden Treats Mix Deluxe",
        img: "3.jpg",
        price: 175000,
      },
      {
        id: 4,
        name: "Golden Festive Delight",
        img: "4.jpg",
        price: 50000,
      },
      {
        id: 5,
        name: "Golden Rainbow Treats",
        img: "5.jpg",
        price: 80000,
      },
    ],
  }));

  //! Shopping Cart
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    //? Add to cart
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambahkan quantity dan total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    //? Remove from cart
    remove(id) {
      // ambil item yang mau diremove dari cart berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            // jika barang yang diklik
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika item tersisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

//! Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//! Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);

  //? Bisa gunakan ini
  // const objData = Object.fromEntries(data);
  // // Ambil total dari Alpine store cart
  // objData.total = Alpine.store("cart").total;
  //? end

  //? Atau bisa juga seperti ini
  const cartItems = Alpine.store("cart").items;
  const itemsJSON = JSON.stringify(cartItems);
  const total = Alpine.store("cart").total; // Ambil nilai total dari Alpine store
  // Gabungkan data lain dengan items dalam format JSON
  const objData = Object.fromEntries(data);
  objData.items = itemsJSON;
  objData.total = total; // Tambahkan total ke dalam objData
  //? end

  const message = formatMessage(objData);
  window.open("http://wa.me/628123?text=" + encodeURIComponent(message));
});

//! Format pesan Whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Name: ${obj.name}
  Email: ${obj.email}
  Phone: ${obj.phone}
  Adress: ${obj.address}
  Order Data
  ${JSON.parse(obj.items).map(
    (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`
  )}
  TOTAL: ${rupiah(obj.total)}
  Thank You!`;
};

//! Konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
