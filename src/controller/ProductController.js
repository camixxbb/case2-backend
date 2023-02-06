import { validToken } from "../middleware/authorization.js"
import Product from "../model/Product.js"

export default class ProductController {
    static routes(app) {
        app.post('/product', validToken, ProductController.create)
        app.get('/product', ProductController.readAll)
        app.patch('/product/:id', validToken, ProductController.update)
        app.delete('/product/:id', validToken, ProductController.delete)
    }

    static async create(req, res) {
        const { title, description } = req.body

        if (!title || !description) {
            return res.status(400).send({
                message: 'Os campos "title" e "description" são obrigatórios'
            })
        }

        const product = new Product()
        product.title = title
        product.description = description

        await product.save()

        res.status(200).send({
            message: 'Produto criado com sucesso!',
            data: product
        })
    }

    static async readAll(req, res) {
        const products = await Product.findAll()
        res.status(200).send({
            message: 'Produtos listados com sucesso!',
            data: products
        })
    }

    static async update(req, res) {
        const {id} = req.params

        const product = await Product.findByProperty('id', id)
        if (!product) {
            return res.status(404).send({
                message: `O produto de id ${id} não existe`
            })
        }

        const {title, description} = req.body
        if (title) {
            product.title = title
        }
        if (description) {
            product.description = description
        }

        await product.save()

        res.status(200).send({
            message: 'Produto alterado com sucesso!',
            data: product
        })
    }

    static async delete(req, res) {
        const {id} = req.params

        const product = await Product.findByProperty('id', id)
        if (!product) {
            return res.status(404).send({
                message: `O produto de id ${id} não existe`
            })
        }

        await product.delete()

        res.status(200).send({
            message: 'Produto deletado com sucesso!'
        })
    }
}