import {Router} from "express"
import { createCustomer, deleteCustomer, getACustomer, listAllCustomer, updateCustomer } from "../controllers/customer.controller"
import { validate } from "../middleware/validate.middleware"
import { createCustomerSchema, customerIdSchema, updateCustomerSchema } from "../schemas/customer.schema"


const router = Router()
// create a customer
router.post("/customers",validate(createCustomerSchema),createCustomer)
// list all customers for the logged-in-user
router.get("/customers",listAllCustomer)
// get one customer by id
router.get("/customers/:id",validate(customerIdSchema),getACustomer)
// update part of a customer
router.patch("/customers/:id",validate(updateCustomerSchema),updateCustomer)
// delete a customer
router.delete("/customers/:id",validate(customerIdSchema),deleteCustomer)

export default router