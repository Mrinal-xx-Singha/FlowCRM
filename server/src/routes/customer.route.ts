import {Router} from "express"
import { createCustomer, deleteCustomer, getACustomer, listAllCustomer, updateCustomer } from "../controllers/customer.controller"



const router = Router()
// create a customer
router.post("/customers",createCustomer)
// list all customers for the logged-in-user
router.get("/customers",listAllCustomer)
// get one customer by id
router.get("/customers/:id",getACustomer)
// update part of a customer
router.patch("/customers/:id",updateCustomer)
// delete a customer
router.delete("/customers/:id",deleteCustomer)

export default router