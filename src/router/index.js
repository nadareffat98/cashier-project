import Vue from "vue";
import VueRouter from "vue-router";
// import store from "@/store";
import RegisterView from "../views/Auth/RegisterView.vue";
import LoginView from "../views/Auth/LoginView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    meta: { requireUnAuth: true },
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    meta: { requireUnAuth: true },
    component: RegisterView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/DashboardView.vue"),
  },
  {
    path: "/cashier",
    name: "cashier",
    meta: { requireAuth: true },
    component: () => import("../views/CashierView.vue"),
  },
  {
    path: "/tilers",
    name: "tilers",
    meta: {
      requireAuth: true,
      requirePackage: true,
      requirePermission: true,
    },
    component: () => import("../views/Tilers/IndexView.vue"),
  },
  {
    path: "/tilers/:tilerId",
    name: "tilersList",
    meta: { requireAuth: true, requireTilerRoute: true },
    component: () => import("../views/Tilers/ShowView.vue"),
  },
  {
    path: "/invoice-settings",
    name: "invoice-settings",
    meta: { requireAuth: true },
    component: () => import("../views/InvoiceSettings.vue"),
  },
  {
    path: "/print-settings",
    name: "print-settings",
    meta: { requireAuth: true },
    component: () => import("../views/PrintSettings.vue"),
  },
  {
    path: "/invoices",
    name: "invoices",
    meta: { requireAuth: true },
    component: () => import("../views/invoice/SalesView.vue"),
  },
  {
    path: "/print",
    name: "print",
    meta: { requireAuth: true },
    component: () => import("../views/invoice/PrintInvoice.vue"),
  },
  {
    path: "/purchases-invoices",
    name: "purchases-invoices",
    meta: { requireAuth: true },
    component: () => import("../views/invoice/PurchasesView.vue"),
  },
  {
    path: "/refund-purchases-invoices",
    name: "refund-purchases-invoices",
    meta: { requireAuth: true },
    component: () => import("../views/invoice/PurchasesView.vue"),
  },
  {
    path: "/price_quote",
    name: "price_quote",
    meta: { requireAuth: true },
    component: () => import("../views/priceQuote/IndexView.vue"),
  },
  {
    path: "/show-price-quote",
    name: "show-price-quote",
    meta: { requireAuth: true, requirePriceQuoteRoute: true },
    component: () => import("../views/priceQuote/showView.vue"),
  },
  {
    path: "/categories",
    name: "categories",
    meta: { requireAuth: true },
    component: () => import("../views/CategoryView.vue"),
  },
  {
    path: "/products",
    name: "products",
    meta: { requireAuth: true },
    component: () => import("../views/products/ProductView.vue"),
  },
  {
    path: "/product-movement",
    name: "product-movement",
    meta: { requireAuth: true, requireProductId: true, userType: true },
    component: () => import("../views/products/ProductMovement.vue"),
  },
  {
    path: "/products-inventory",
    name: "products-inventory",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/products/ProductsInventory.vue"),
  },
  {
    path: "/clients",
    name: "clients",
    meta: { requireAuth: true },
    component: () => import("../views/ClientView.vue"),
  },
  {
    path: "/users",
    name: "users",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/Users/UserView.vue"),
  },
  {
    path: "/users/:userId",
    name: "add-edit-user",
    meta: { requireAuth: true, userType: true, requireUserRoute: true },
    component: () => import("../views/Users/AddOrEdit.vue"),
  },
  {
    path: "/transactions",
    name: "transactions",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/TransactionView.vue"),
  },
  {
    path: "/suppliers",
    name: "suppliers",
    meta: { requireAuth: true },
    component: () => import("../views/SupplierView.vue"),
  },
  {
    path: "/reports",
    name: "reports",
    meta: { requireAuth: true, requirePermission: true },
    component: () => import("../views/reports/ReportsView.vue"),
  },
  {
    path: "/reports/:reportRole",
    name: "reportsList",
    meta: { requireAuth: true },
    component: () => import("../views/reports/IndexView.vue"),
  },
  {
    path: "/reports_pdf",
    name: "reports_pdf",
    meta: { requireAuth: true },
    component: () => import("../views/reports/PrintReports.vue"),
  },
  {
    path: "/tax-returns",
    name: "tax-returns",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/taxReturns/IndexView.vue"),
  },
  {
    path: "/print-tax-return",
    name: "print-tax-return",
    meta: { requireAuth: true, requiresTaxReturnsRoute: true },
    component: () => import("../views/taxReturns/PrintTaxReturn.vue"),
  },
  {
    path: "/create-show",
    name: "create-show",
    meta: { requireAuth: true, requiresTaxReturnsRoute: true },
    component: () => import("../views/taxReturns/CreateOrShow.vue"),
  },
  {
    path: "/payment-methods",
    name: "payment-methods",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/paymentMethods/IndexView.vue"),
  },
  {
    path: "/subscriptions",
    name: "subscriptions",
    meta: { requireAuth: true, userType: true },
    component: () => import("../views/subscriptions/SubscriptionCard.vue"),
  },
  {
    path: "/payment",
    name: "payment",
    meta: { requireAuth: true, requiresSpecificRoute: true },
    component: () => import("../views/subscriptions/payment/PaymentView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    meta: { requireAuth: true },
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/about-us",
    beforeEnter() {
      location.href = "https://efatorh.com/#about-section";
    },
  },
  {
    path: "/contact-us",
    beforeEnter() {
      location.href = "https://wa.me/+966558030980";
    },
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(function (to, from, next) {
  const meDetails = JSON.parse(localStorage.getItem("meDetails"));
  if (to.meta.requireAuth && !JSON.parse(localStorage.getItem("PhoneVerified")))
    next("/login");
  else if (
    to.meta.requireUnAuth &&
    localStorage.getItem("token") &&
    JSON.parse(localStorage.getItem("PhoneVerified"))
  )
    next("/cashier");
  else {
    if (to.meta.requiresSpecificRoute) {
      if (from.path == "/users" || from.path == "/subscriptions") next();
      else next("/subscriptions");
    }
    if (to.meta.requireTilerRoute) {
      if (from.path == "/tilers") next();
      else next("/tilers");
    }
    if (to.meta.requiresTaxReturnsRoute) {
      if (from.path == "/tax-returns" || from.path == "/create-show") next();
      else next("/tax-returns");
    }
    if (to.meta.requirePriceQuoteRoute) {
      if (from.path == "/cashier" || from.path == "/price_quote") next();
      else next("/price_quote");
    }
    if (to.meta.requireProductId) {
      if (from.path == "/products") next();
      else next("/products");
    }
    if (
      to.meta.requirePermission &&
      JSON.parse(localStorage.getItem("meDetails"))["user_type"] == 1
    ) {
      if (
        to.path == "/tilers" &&
        meDetails.employee_permissions.includes("tilers-viewAll")
      )
        next();
      else if (
        to.path == "/purchases-invoices" &&
        meDetails.employee_permissions.includes("purchases-viewAll")
      )
        next();
      else if (
        to.path == "/reports" &&
        meDetails.employee_permissions.includes("products-reports")
      )
        next();
      else next("/cashier");
    }
    if (
      to.meta.userType &&
      JSON.parse(localStorage.getItem("meDetails"))["user_type"] != 0
    )
      next("/cashier");
    else {
      if (to.meta.requireUserRoute && from.path != "/users") next("/users");
      else next();
    }
    if (
      to.meta.requirePackage &&
      !JSON.parse(localStorage.getItem("meDetails"))["is_subscribed"]
    )
      next("/cashier");
    else next();
  }
});
export default router;
