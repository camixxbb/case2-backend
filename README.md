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
- `src/controller/ApplicationController.js`: Será a classe "mãe" de todas as controllers: Ela definirá os métodos em comum que todas as controllers precisam implementar obrigatoriamente.

- `src/controller/PageController.js`: Vai cuidar dos pedidos de criação, leitura, atualização e exclusão de informações de uma página específica
- `src/controller/ProductController.js`: Vai cuidar dos pedidos de criação, leitura, atualização e exclusão de informações de uma funcionalidade específica
- `src/controller/UserController.js`: Vai cuidar dos pedidos de login na plataforma

Vamos começar pela `src/controller/ApplicationController.js`: Vamos criar o único método que todas elas terão em comum: o `routes(app)`. Esse método receberá uma aplicação express e configurará as rotas necessárias para a classe. Idealmente utilizaremos esse método nas classes filhas, mas se esquecermos dessa declaração, essa classe mãe lançará um erro nos lembrando de realizar a implementação:

```js
export default class ApplicationController {
    static routes(app) {
        throw new Error('Você precisa definir as rotas na sua controller!')
    }
}
```



## 4. Conectando com o banco




## 5. Middlewares



