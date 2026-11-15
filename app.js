/* =====================================================
   app.js — Sharma Ji Thekua
   Personalized Customer Messaging & Interactivity
   ===================================================== */

// -------------------------
// Flavour & Pricing Config
// -------------------------
const flavourCatalog = {
  elaichi: {
    id: 'elaichi',
    name: 'Elaichi Ka Swad',
    desc: '250g Classic Desi Ghee Pouch',
    weight: '250g (~12–14 pieces)',
    price: 250,
    mrp: 299,
  },
  gulab: {
    id: 'gulab',
    name: 'Gulab Ki Khushboo (Rose Flavour)',
    desc: '250g Rose Infused Desi Ghee Pouch',
    weight: '250g (~12–14 pieces)',
    price: 250,
    mrp: 299,
  },
  chocolate: {
    id: 'chocolate',
    name: 'Chocolate Ka Swad',
    desc: '250g Rich Cocoa Desi Ghee Pouch',
    weight: '250g (~12–14 pieces)',
    price: 250,
    mrp: 299,
  },
  trio: {
    id: 'trio',
    name: 'Heritage Trio Hamper (Elaichi + Gulab + Chocolate)',
    desc: '750g Festive Box (3 × 250g Pouches)',
    weight: '750g (~36–42 pieces total)',
    price: 699,
    mrp: 899,
  }
};

// State
let activeFlavour = 'elaichi';
let activeQty = 1;
let currentNutritionFlavour = 'elaichi';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Navbar — Scroll Shadow & Background Polish
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          closeMobileMenu();
        }
      }
    });
  });

  // 3. Close Modals on ESC Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrderCustomizer();
      closeNutritionModal();
      closePolicyModal();
    }
  });

  // Initial preview update
  updateOrderPreview();

});

// -------------------------
// Mobile Hamburger Menu
// -------------------------
function toggleMobileMenu() {
  const links = document.getElementById('nav-links');
  const ham = document.getElementById('hamburger');
  links.classList.toggle('open');
  ham.classList.toggle('open');
}

function closeMobileMenu() {
  const links = document.getElementById('nav-links');
  const ham = document.getElementById('hamburger');
  if (links && ham) {
    links.classList.remove('open');
    ham.classList.remove('open');
  }
}

// -------------------------
// Order Customizer Modal Logic
// -------------------------
function openOrderCustomizer(flavourKey = 'elaichi') {
  selectFlavour(flavourKey);
  const modal = document.getElementById('orderCustomizerModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeOrderCustomizer() {
  const modal = document.getElementById('orderCustomizerModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function selectFlavour(flavourKey) {
  if (!flavourCatalog[flavourKey]) flavourKey = 'elaichi';
  activeFlavour = flavourKey;

  // Update pills UI
  ['elaichi', 'gulab', 'chocolate', 'trio'].forEach(key => {
    const pill = document.getElementById(`pill-${key}`);
    if (pill) {
      if (key === flavourKey) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    }
  });

  // Update helper text
  const helper = document.getElementById('qtyHelperText');
  if (helper) {
    helper.textContent = flavourCatalog[flavourKey].weight;
  }

  updateOrderPreview();
}

function changeQty(delta) {
  activeQty = Math.max(1, Math.min(50, activeQty + delta));
  const qtyEl = document.getElementById('custQtyVal');
  if (qtyEl) {
    qtyEl.textContent = activeQty;
  }
  updateOrderPreview();
}

function applyNote(noteText) {
  const noteInput = document.getElementById('custNote');
  if (noteInput) {
    noteInput.value = noteText;
    updateOrderPreview();
  }
}

function updateOrderPreview() {
  const nameInput = document.getElementById('custName');
  const cityInput = document.getElementById('custCity');
  const noteInput = document.getElementById('custNote');

  const customerName = nameInput ? nameInput.value.trim() : '';
  const customerCity = cityInput ? cityInput.value.trim() : '';
  const customerNote = noteInput ? noteInput.value.trim() : '';

  const item = flavourCatalog[activeFlavour] || flavourCatalog.elaichi;
  const totalPrice = item.price * activeQty;

  // Build Personalized WhatsApp Message
  let messageLines = [];
  messageLines.push("Namaste Sharma Ji! 🙏");
  messageLines.push("");

  if (customerName && customerCity) {
    messageLines.push(`My name is *${customerName}* from *${customerCity}*.`);
  } else if (customerName) {
    messageLines.push(`My name is *${customerName}*.`);
  } else if (customerCity) {
    messageLines.push(`I am contacting from *${customerCity}*.`);
  } else {
    messageLines.push("I would like to place an order from Sharma Ji Kitchen:");
  }

  if (customerName || customerCity) {
    messageLines.push("I would like to order:");
  }

  messageLines.push(`• *Flavour:* ${item.name}`);
  messageLines.push(`• *Quantity:* ${activeQty} ${activeQty > 1 ? 'packs' : 'pack'} (${item.weight})`);
  messageLines.push(`• *Total Amount:* ₹ ${totalPrice} (Discounted Price)`);

  if (customerNote) {
    messageLines.push(`• *Note / Occasion:* ${customerNote}`);
  }

  messageLines.push("");
  messageLines.push("Please share UPI payment details and estimated dispatch date.");
  messageLines.push("Dhanyawad!");

  const fullMessage = messageLines.join("\n");

  // Update preview box
  const previewBox = document.getElementById('waPreviewText');
  if (previewBox) {
    previewBox.textContent = fullMessage;
  }

  // Update submit button link & label
  const submitBtn = document.getElementById('custSubmitBtn');
  const submitLabel = document.getElementById('custSubmitBtnLabel');
  if (submitBtn) {
    const encodedText = encodeURIComponent(fullMessage);
    submitBtn.href = `https://wa.me/918777790916?text=${encodedText}`;
  }
  if (submitLabel) {
    submitLabel.textContent = `Open WhatsApp & Send Order (₹ ${totalPrice})`;
  }
}

// -------------------------
// Nutrition Modal Logic
// -------------------------
const flavourNutritionData = {
  elaichi: {
    title: 'Ingredients & Nutritional Facts — Elaichi Ka Swad',
    subtitle: 'Classic Bihari Swadisht Maida Thekua (Net Weight 250g)',
    ingredients: 'Refined Wheat Flour (Maida), Pure Desi Cow Ghee, Sugar Syrup, Freshly Pounded Green Cardamom (Elaichi), Purified Water.',
    calories: '485 kcal',
    protein: '6.8 g',
    carbs: '62.4 g',
    sugar: '24.5 g',
    fat: '22.6 g',
    saturatedFat: '12.8 g',
    fibre: '2.1 g',
    allergen: 'Contains Wheat (Gluten) and Milk (Ghee). 100% Vegetarian.',
    priceText: '₹ 250'
  },
  gulab: {
    title: 'Ingredients & Nutritional Facts — Gulab Ki Khushboo',
    subtitle: 'Damask Rose Infused Swadisht Thekua (Net Weight 250g)',
    ingredients: 'Refined Wheat Flour (Maida), Pure Desi Cow Ghee, Sugar Syrup, Natural Damask Rose Essence & Dried Edible Rose Petals, Purified Water.',
    calories: '488 kcal',
    protein: '6.6 g',
    carbs: '63.1 g',
    sugar: '25.0 g',
    fat: '22.4 g',
    saturatedFat: '12.7 g',
    fibre: '2.2 g',
    allergen: 'Contains Wheat (Gluten) and Milk (Ghee). 100% Vegetarian.',
    priceText: '₹ 250'
  },
  chocolate: {
    title: 'Ingredients & Nutritional Facts — Chocolate Ka Swad',
    subtitle: 'Rich Cocoa Infused Desi Ghee Thekua (Net Weight 250g)',
    ingredients: 'Refined Wheat Flour (Maida), Pure Desi Cow Ghee, Sugar Syrup, Premium Natural Cocoa Solids, Purified Water.',
    calories: '495 kcal',
    protein: '7.2 g',
    carbs: '61.8 g',
    sugar: '24.8 g',
    fat: '23.5 g',
    saturatedFat: '13.2 g',
    fibre: '2.8 g',
    allergen: 'Contains Wheat (Gluten) and Milk (Ghee). 100% Vegetarian.',
    priceText: '₹ 250'
  }
};

function openNutritionModal(flavourKey = 'elaichi') {
  currentNutritionFlavour = flavourKey;
  const modal = document.getElementById('nutritionModal');
  const titleEl = document.getElementById('modal-nutrition-title');
  const subtitleEl = document.getElementById('nutritionModalSubtitle');
  const bodyEl = document.getElementById('nutritionModalBody');
  const orderBtn = document.getElementById('nutritionModalOrderBtn');

  const flavour = flavourNutritionData[flavourKey] || flavourNutritionData.elaichi;

  titleEl.textContent = flavour.title;
  subtitleEl.textContent = flavour.subtitle;

  bodyEl.innerHTML = `
    <div class="nutrition-ingredients-box">
      <h4>Ingredients List</h4>
      <p>${flavour.ingredients}</p>
      <div class="free-from-tags">
        <span>✓ 100% Vegetarian</span>
        <span>✓ Pure Desi Ghee</span>
        <span>✓ No Palm Oil</span>
        <span>✓ Zero Chemical Preservatives</span>
      </div>
    </div>

    <div class="nutrition-table-wrap">
      <h4>Nutritional Profile (per 100g serving)</h4>
      <table class="nutrition-table">
        <thead>
          <tr>
            <th>Nutrient Parameter</th>
            <th>Value per 100g</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Energy (Calories)</td>
            <td><strong>${flavour.calories}</strong></td>
          </tr>
          <tr>
            <td>Protein</td>
            <td>${flavour.protein}</td>
          </tr>
          <tr>
            <td>Total Carbohydrates</td>
            <td>${flavour.carbs}</td>
          </tr>
          <tr>
            <td>Of which Sugar</td>
            <td>${flavour.sugar}</td>
          </tr>
          <tr>
            <td>Total Fats (from Pure Desi Ghee)</td>
            <td>${flavour.fat}</td>
          </tr>
          <tr>
            <td>Saturated Fatty Acids</td>
            <td>${flavour.saturatedFat}</td>
          </tr>
          <tr>
            <td>Trans Fat</td>
            <td><strong>0.0 g</strong></td>
          </tr>
          <tr>
            <td>Dietary Fibre</td>
            <td>${flavour.fibre}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="storage-info-box">
      <h4>Storage &amp; Shelf Life</h4>
      <p>
        <strong>Shelf Life:</strong> 45 Days from packaging date.<br>
        <strong>Storage:</strong> Store in a cool, dry place away from direct sunlight. After unsealing,
        keep the ziplock pouch tightly closed or transfer to an airtight steel/glass jar to preserve maximum crispiness.
      </p>
      <p class="allergen-note">
        <strong>Allergen Notice:</strong> ${flavour.allergen}
      </p>
    </div>
  `;

  if (orderBtn) {
    orderBtn.textContent = `Personalize & Order on WhatsApp (${flavour.priceText})`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function orderFromNutritionModal() {
  closeNutritionModal();
  openOrderCustomizer(currentNutritionFlavour);
}

function closeNutritionModal() {
  const modal = document.getElementById('nutritionModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// -------------------------
// Store Policy Modal Logic
// -------------------------
const policyData = {
  shipping: {
    tag: 'Delivery Transparency',
    title: 'Shipping & Delivery Policy',
    content: `
      <p><strong>Courier Partners:</strong> We ship pan-India via trusted express logistics partners including Delhivery, BlueDart, DTDC, and Speed Post.</p>
      <br>
      <p><strong>Dispatch Timeline:</strong> Because our thekua is prepared in small artisanal batches to guarantee freshness, your order is freshly packed and dispatched within <strong>24 to 48 hours</strong> of order confirmation.</p>
      <br>
      <p><strong>Transit Time:</strong>
        <br>• North & Eastern India (Bihar, Jharkhand, UP, Delhi-NCR, West Bengal): 2–4 business days.
        <br>• Western & Southern India (Maharashtra, Karnataka, Telangana, Tamil Nadu): 3–6 business days.
      </p>
      <br>
      <p><strong>Crush-Proof Packaging:</strong> Each pouch is sealed airtight and cushioned inside a heavy-duty corrugated outer box to prevent crushing or breakage during transit.</p>
      <br>
      <p><strong>Tracking:</strong> You receive a real-time courier tracking link directly on WhatsApp as soon as your shipment is dispatched.</p>
    `
  },
  refund: {
    tag: 'Customer Protection',
    title: 'Return, Replacement & Refund Policy',
    content: `
      <p>At <strong>Sharma Ji Thekua</strong>, we treat every customer like family. Since our products are perishable traditional food items, we cannot accept general returns of opened packets.</p>
      <br>
      <p><strong>Damage in Transit Guarantee:</strong> If your parcel arrives tampered with, damaged, or the food quality is compromised due to courier mishandling, simply send us an unboxing photo or video on WhatsApp (+91 87777 90916) within 24 hours of delivery.</p>
      <br>
      <p><strong>Our Resolution Promise:</strong>
        <br>1. <strong>Immediate Free Replacement:</strong> We will bake and dispatch a fresh replacement packet at zero cost to you, OR
        <br>2. <strong>Direct Refund:</strong> We will initiate an instant UPI or bank refund to your account.
      </p>
      <br>
      <p>No lengthy claims, no chatbots — direct human resolution within a few hours.</p>
    `
  },
  privacy: {
    tag: 'Data Transparency',
    title: 'Privacy & Data Policy',
    content: `
      <p>We respect your privacy completely. When you place an order with Sharma Ji Thekua:</p>
      <br>
      <p><strong>Information Collected:</strong> We only collect your name, WhatsApp phone number, delivery address, and pincode solely for the purpose of shipping your order and providing courier tracking updates.</p>
      <br>
      <p><strong>No Spam Promise:</strong> We never sell, rent, or trade your contact details with any third-party marketing agencies. You will only receive genuine delivery updates and occasional festive greetings.</p>
      <br>
      <p><strong>Secure Communication:</strong> All ordering conversations are conducted directly through end-to-end encrypted WhatsApp messaging.</p>
    `
  }
};

function openPolicyModal(policyType) {
  const modal = document.getElementById('policyModal');
  const tagEl = document.getElementById('policyTag');
  const titleEl = document.getElementById('modal-policy-title');
  const bodyEl = document.getElementById('policyBodyContent');

  const policy = policyData[policyType];
  if (!policy || !modal) return;

  tagEl.textContent = policy.tag;
  titleEl.textContent = policy.title;
  bodyEl.innerHTML = policy.content;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePolicyModal() {
  const modal = document.getElementById('policyModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Generic Backdrop click handler
function closeModalOnBackdrop(event, modalId) {
  if (event.target && event.target.id === modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
}
