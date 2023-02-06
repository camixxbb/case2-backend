import Product from "../src/model/Product.js"
import User from "../src/model/User.js"

(async () => {
    await User._migrate([
        '"ID" INTEGER PRIMARY KEY NOT NULL',
        '"EMAIL" TEXT NOT NULL',
        '"ENCRYPTED_PASSWORD" TEXT NOT NULL',
        '"AUTH_TOKEN" TEXT'
    ])
    await Product._migrate([
        '"ID" INTEGER PRIMARY KEY NOT NULL',
        '"TITLE" TEXT NOT NULL',
        '"DESCRIPTION" TEXT NOT NULL'
    ])
})()