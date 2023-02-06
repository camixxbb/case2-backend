import { models } from "../src/model/models.js"

(async () => {
    await Promise.all(models.map(model => model._drop()))
})()