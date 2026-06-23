"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const router = (0, express_1.Router)();
// create a customer
router.post("/customers", customer_controller_1.createCustomer);
// list all customers for the logged-in-user
router.get("/customers", customer_controller_1.listAllCustomer);
// get one customer by id
router.get("/customers/:id", customer_controller_1.getACustomer);
// update part of a customer
router.patch("/customers/:id", customer_controller_1.updateCustomer);
// delete a customer
router.delete("/customers/:id", customer_controller_1.deleteCustomer);
exports.default = router;
