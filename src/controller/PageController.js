import { validToken } from "../middleware/authorization.js"
import Page from "../model/Page.js"

export default class PageController {
    static routes(app) {
        app.get('/page/:id', PageController.read)
        app.patch('/page/:id', validToken, PageController.update)
    }

    static async read(req, res) {
        const {id} = req.params
        const page = await Page.findByProperty('id', id)
        if (!page) {
            return res.status(404).send({
                message: 'Página não encontrada'
            })
        }
        res.status(200).send({
            message: 'Sucesso ao buscar página',
            data: page
        })
    }

    static async update(req, res) {
        const {id} = req.params
        const {title, text} = req.body
        const page = await Page.findByProperty('id', id)
        if (!page) {
            return res.status(404).send({
                message: 'Página não encontrada'
            })
        }
        if (title) {
            page.title = title
        }
        if (text) {
            page.text = text
        }
        await page.save()
        res.status(200).send({
            message: 'Sucesso ao alterar dados da página',
            data: page
        })
    }
}