import { hashSync } from "bcrypt"
import { models } from "../src/model/models.js"
import Product from "../src/model/Product.js"
import User from "../src/model/User.js"

(async () => {
    models.forEach(model => model.init())

    const products = []
    for (let i=1; i<=10; i++) {
        const prod = new Product()
        prod.title = `Produto ${i}`
        prod.description = `Descrição do produto ${i}`
        products.push(prod)
    }

    const admin = new User()
    admin.email = "admin@case2.com"
    admin.encryptedPassword = hashSync('12345678', 10)

    
    const users = [admin]
    
    await Product._seed(products)
    await User._seed(users)
})()