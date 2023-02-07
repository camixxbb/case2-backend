# case2-backend
Case 2 - Site do EstudoApp (Backend)


## 1. Estruturação do projeto e dependências

Iniciar projeto dentro da pasta desejada com:
```sh
npm init -y
```

Instalar dependências do projeto
```sh
npm install nodemon --save-dev
npm install bcrypt cors express sqlite sqlite3
```

- `bcrypt`: Armazena e compara senhas de forma segura
- `cors`: Permite que aplicativos em outros domínios acessem nosso servidor
- `express`: Servidor HTTP
- `nodemon`: Monitora os o projeto e reinicia o servidor quando salvamos um arquivo (hot reload) 
- `sqlite`: Biblioteca auxiliar para utilizar o `sqlite3` com Promises
- `sqlite3`: Driver do banco de dados que iremos utilizar

Agora, atualize o nome do projeto no campo `"name"` e crie o campo `"type": "module"` no final do `package.json` para usar a sintaxe de import no lugar de require.

Para finalizar, remova o script de `"test"`, crie o script `"start": "nodemon server.js"`. Seu `package.json` deverá ficar parecido com este:

```json
{
  "name": "case2-back-teste",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "nodemon app.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^2.0.20"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "sqlite": "^4.1.2",
    "sqlite3": "^5.1.4"
  },
  "type": "module"
}
```


## 2. Hello world

Como configuramos acima, o nosso script para executar o projeto tem como ponto de entrada o `server.js`. Vamos criar os nossos 2 primeiros arquivos em JavaScript:
- `src/app.js`: Cria o app express e configura suas funcionalidades
- `server.js`: Inicia o servidor do express

Em `src/app.js`, vamos criar um novo app, configuramos os pedidos de outros domínios com CORS e permitimos que o projeto receba dados em formato JSON (para usar em requisições POST, PUT e PATCH)
```js
import cors from "cors";
import express from "express";

const app = express()
app.use(cors())
app.use(express.json())

export default app
```

No `server.js`, importamos a aplicação, definimos uma porta de rede para trafegar dados e mandamos o aplicativo iniciar o servidor:
```js
import app from "./src/app.js";

const port = 3000

app.listen(port, () => {
    console.log(`Aplicação escutando na porta ${port}`)
})
```

Se você executar `npm start`, você verá que o projeto estará funcionando e respondendo às atualizações de arquivos!


## 3. Controllers e validação de dados

Precisamos separar no nosso projeto nos endereços nos quais vamos buscar os dados e como nós vamos lidar com esses pedidos. Para isso, vamos criar uma camada no nosso projeto: as controllers. Elas vão orquestrar as responsabilidades de outras camadas do nosso projeto: vão receber o pedido, repassar as informações para validadores, pedir informações para fábricas e modelos de dados e devolver as informações para o usuário.

Vamos criar os seguintes arquivos:
- `src/controller/controllers.js`: Será o local onde iremos registrar todas as nossas controllers para que suas configurações sejam aplicadas de uma vez só
- `src/controller/PageController.js`: Vai cuidar dos pedidos de criação, leitura, atualização e exclusão de informações de uma página específica
- `src/controller/ProductController.js`: Vai cuidar dos pedidos de criação, leitura, atualização e exclusão de informações de uma funcionalidade específica
- `src/controller/UserController.js`: Vai cuidar dos pedidos de login na plataforma

Vamos começar pela `src/controller/UserController.js` e montar um pseudocódigo para nos auxiliar a montar a estrutura do arquivo:

```js
import { compareSync } from "bcrypt"
import { randomUUID } from 'crypto'
import User from "../model/User.js"

export default class UserController {
    static routes(app) {
        // Aqui informaremos qual método responderá à rota de login
    }

    static async login(req, res) {
        // Recebemos os campos da requisição
        // Se algum campo obrigatório não foi informado:
        //   - Devolvemos uma mensagem de erro e saímos da função
        // Buscamos um usuário no banco de dados
        // Se o usuário não existe:
        //   - Devolvemos uma mensagem de erro e saímos da função
        // Se a senha informada não é a mesma senha armazenada:
        //   - Devolvemos uma mensagem de erro e saímos da função
        // Criamos um novo token para o usuário e armazenamos no banco de dados
        // Enviamos o token criado na resposta
    }
}
```

> Dica: Utilizaremos métodos `async` toda vez que trabalharmos com Promises para utilizarmos `await` em vez de encadear várias chamadas `.then` seguidas umas das outras. Métodos `async` sempre aparecerão quando precisarmos mexer no banco de dados.

Com esse pseudocódigo podemos implementar um código que **finge** fazer a busca no banco de dados. Desta forma, podemos implementar todas as outras funcionalidades e não precisaremos nos preocupar por enquanto em como estamos buscando essas informações.

`src/controller/UserController.js`:
```js
export default class UserController {
    static routes(app) {
        // Aqui informaremos qual método responderá à rota de login
        app.post('/login', UserController.login)
    }

    static async login(req, res) {
        // Recebemos os campos da requisição
        const { email, password } = req.body
        // Se algum campo obrigatório não foi informado:
        if (!email || !password) {
            // Devolvemos uma mensagem de erro e saímos da função
            return res.status(400).send({
                message: 'Os campos "email" e "password" são obrigatórios'
            })
        }
        // Buscamos um usuário no banco de dados
        const user = {
            authToken: 'abcdef',
            password: '123'
        }
        // Se o usuário não existe:
        if (!user) {
            // Devolvemos uma mensagem de erro e saímos da função
            return res.status(404).send({
                message: 'Usuário não encontrado'
            })
        }
        // Se a senha informada não é a mesma senha armazenada:
        const passwordsMatch = password === user.password
        if (!passwordsMatch) {
            // Devolvemos uma mensagem de erro e saímos da função
            return res.status(401).send({
                message: 'Senha incorreta'
            })
        }
        // Criamos um novo token para o usuário e armazenamos no banco de dados
        user.authToken = 'fedcba'
        // Enviamos o token criado na resposta
        res.status(200).send({
            token: user.authToken
        })
    }
}
```

Vamos remover os comentários desse arquivo já que estruturamos o nosso código! Agora vamos aplicar o mesmo processo para os outros dois arquivos: Montaremos um pseudocódigo nos comentários para entender qual a lógica seguir e depois escreveremos o código nos guiando pelos comentários! Os outros arquivos ficarão assim:

`src/controller/PageController.js`:
```js
export default class PageController {
    static routes(app) {
        app.get('/page/:id', PageController.read)
        app.patch('/page/:id', PageController.update)
    }

    static async read(req, res) {
        const {id} = req.params
        
        const page = {
            title: `Página ${id}`,
            text: 'Lorem ipsum dor sit amet'
        }
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

        const page = {
            title: 'Título antigo',
            text: 'Texto antigo'
        }
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
        
        res.status(200).send({
            message: 'Sucesso ao alterar dados da página',
            data: page
        })
    }
}
```

`src/controller/ProductController.js`:
```js
export default class ProductController {
    static routes(app) {
        app.post('/product', ProductController.create)
        app.get('/product', ProductController.readAll)
        app.patch('/product/:id', ProductController.update)
        app.delete('/product/:id', ProductController.delete)
    }

    static async create(req, res) {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(400).send({
                message: 'Os campos "title" e "description" são obrigatórios'
            })
        }

        const product = { title, description }

        res.status(200).send({
            message: 'Produto criado com sucesso!',
            data: product
        })
    }

    static async readAll(req, res) {
        const products = [
            {
                title: 'Produto 1',
                description: 'Descrição produto 1'
            },
            {
                title: 'Produto 2',
                description: 'Descrição produto 2'
            }
        ]
        res.status(200).send({
            message: 'Produtos listados com sucesso!',
            data: products
        })
    }

    static async update(req, res) {
        const {id} = req.params

        const product = {
            title: `Produto ${id}`,
            description: `Descrição produto ${id}`
        }
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

        res.status(200).send({
            message: 'Produto alterado com sucesso!',
            data: product
        })
    }

    static async delete(req, res) {
        const {id} = req.params

        const product = {
            title: `Produto ${id}`,
            description: `Descrição produto ${id}`
        }
        if (!product) {
            return res.status(404).send({
                message: `O produto de id ${id} não existe`
            })
        }

        res.status(200).send({
            message: 'Produto deletado com sucesso!'
        })
    }
}
```

Estamos quase lá! Agora, precisamos colocar todas essas controllers em um local no qual podemos acessá-las do projeto principal. Vamos criar o arquivo `src/controller/controllers.js` e guardar todas elas:

```js
import PageController from "./PageController.js";
import ProductController from "./ProductController.js";
import UserController from "./UserController.js";

export const controllers = [
    PageController,
    ProductController,
    UserController
]
```

Para finalizar, atualize o seu `src/app.js` importando a lista de controllers e faça um for para fornecer o app à todas as controllers do array! O seu arquivo ficará assim:

```js
import cors from "cors";
import express from "express";
import { controllers } from "./controller/controllers.js";

const app = express()
app.use(cors())
app.use(express.json())

controllers.forEach(controller => controller.routes(app))

export default app
```

Desta forma, todas as controllers conseguem configurar suas rotas! Faça o teste das rotas pelo Postman, Insomnia ou alguma outra ferramenta para testar APIs (não se esqueça de iniciar o projeto com `npm start`). Exemplos:

- `GET localhost:3000/page/1`

    Resposta: `200 OK`
    ```json
    {
        "message": "Sucesso ao buscar página",
        "data": {
            "title": "Página 1",
            "text": "Lorem ipsum dor sit amet"
        }
    }
    ```

- `PATCH localhost:3000/product/2`

    Corpo da requisição (JSON): `{ "description": "Nova descrição!" }`

    Resposta: `200 OK`
    ```json
    {
        "message": "Produto alterado com sucesso!",
        "data": {
            "title": "Produto 2",
            "description": "Nova descrição!"
        }
    }
    ```

## 4. Conectando com o banco

O nosso próximo passo é conectar o nosso servidor a um banco de dados. Afinal, queremos que nossas informações sejam mantidas mesmo que a aplicação lance algum erro ou seja reiniciada. 

Vamos trabalhar com uma nova camada, as **models**. Em alguns projetos deixaríamos esse trabalho para os DAOs (Data Access Objects) para acessar o banco de dados e nos devolver models criadas. Porém, gostaria de trazer uma visão mais parecida com a de algumas bibliotecas de back-end que facilitam o relacionamento de modelos de dados com o banco em si. Essas bibliotecas usam a técnica ORM (Object Relational Mapping), que aproveita as vantagens da programação orientação a objetos para mapear objetos de uma determinada linguagem de programação para uma tabela no banco com suas respectivas colunas. A model nesse formato possui métodos de fabricação, busca, deleção e atualização de dados e envolve todas essas funcionalidades em suas classes. Um exemplo de biblioteca famosa de ORM para JavaScript é o Sequelize.

Até o final deste passo 4 você terá duas opções:
1. Tomar a liberdade de instalar uma biblioteca e criar as models a partir de sua documentação, ou
2. Reproduzirmos do zero um comportamento de ORM e entender como funciona por baixo dos panos algumas bibliotecas que implementam essa técnica

Caso escolha a opção 1, você deve ignorar o restante deste passo 4 todo e usar as models de acordo com a documentação da biblioteca escolhida. Atualize os métodos de criação, leitura, atualização e deleção nas controllers e pule para o passo 5.

Caso escolha a opção 2, continue seguindo este passo 4!

### Model genérica

Uma das vantagens de usar ORMs é que eles deixam a maior parte da carga pesada em uma classe geral, a qual será herdada por outras classes que poderão usar seus métodos de forma customizada. O primeiro exemplo que vamos montar é de como encontrar, de acordo com a model que estamos usando, qual o nome da tabela em que guardaremos seus dados.

> Dica: Utilizaremos tanto métodos **estáticos** quanto métodos **de instância**. Em ambos contextos a palavra chave *this* significará **coisas diferentes**. Revisaremos isso abaixo, mas é importante que você se atente a qual tipo de método estaremos usando e por quê.

Como métodos estáticos não pertencem a uma instância em específico, elas não dependem da existência de uma instância para serem executados. No fundo, elas são funções como quaisquer outras, mas organizadas em um contexto diferente. Geralmente métodos estáticos são usados para criar instâncias daquela classe (agem como uma função *factory*), fazem buscas ou processam algum tipo de dado relacionado àquela classe. Alguns exemplos de métodos estáticos:
```js
const milliseconds = Date.now() // Devolve o número de milissegundos passados a partir do início dos relógios dos computadores (não precisa que uma data exista para ser chamado)
const letter = String.fromCharCode(65) // Cria uma string a partir de um código UTF8 (não precisa que uma string exista para ser chamado)
const number = Math.random() // Devolve um número aleatório entre 0 e 1. Não existem objetos do tipo Math, mas as funções matemáticas são organizadas dentro deste contexto
```

Alguns exemplos de métodos de instância:
```js
const yelling = 'hello'.toUpperCase() // Devolve a string em letras maiúsculas (precisa que uma string exista para ser chamado)
const today = new Date()
const year = today.getFullYear() // Devolve o ano de uma data (precisa que um objeto do tipo Date exista para ser chamado)
```

Com essa revisão rápida de métodos estáticos, vamos criar nossa model genérica: Ela representará uma entidade (tabela) no nosso banco de dados. Crie o arquivo `src/model/ApplicationModel.js` com o conteúdo abaixo:
```js
export default class ApplicationModel {
    static getTableName() {
        return this.name.toLowerCase()
    }
}
```

> Dica: No exemplo acima, a palavra chave *this* referencia a classe construtora pois estamos em um método estático e não uma instância dessa classe. Desta forma, como classes são do tipo "function", elas possuem a propriedade "name" que permite acessar o nome da classe

Agora, crie as outras 3 models do nosso projeto (página, produto e usuário) nos seguintes arquivos:
`src/model/Page.js`
```js
import ApplicationModel from "./ApplicationModel"

export default class Page extends ApplicationModel {

}
```

`src/model/Product.js`
```js
import ApplicationModel from "./ApplicationModel"

export default class Product extends ApplicationModel {

}
```

`src/model/User.js`
```js
import ApplicationModel from "./ApplicationModel"

export default class User extends ApplicationModel {

}
```

Desta forma, cada model terá um nome diferente para sua tabela!
```js
Page.getTableName() // "page"
Product.getTableName() // "product"
User.getTableName() // "user"
```

> Por que `User.getTableName()` retorna `"user"` e não `"applicationmodel"` já que o método foi declarado na classe `ApplicationModel`? É porque estamos tirando vantagem do **polimorfismo**: uma classe filha pode sobrescrever os comportamentos de uma classe mãe. No JavaScript isso também significa que se uma classe filha chama métodos de uma classe mãe, as chamadas para *this* vão referenciar a classe filha, pois é ela que está executando os métodos! Desta forma, o método `.getTableName()` está sendo executado por `User` e o código acaba sendo traduzido para `return User.name.toLowerCase()` naquela linha de código. Esse é a base fundamental para os comportamentos que montaremos na nossa model.

## 5. Autenticação e autorização



