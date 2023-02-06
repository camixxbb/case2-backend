import sqlite3 from "sqlite3"
import { open } from "sqlite"

/**
 * Executa uma query garantindo que a conexão será fechada caso algum erro seja lançado
 * 
 * @returns {Promise<import("sqlite").Database<import("sqlite3").Database, import("sqlite3").Statement>>}
 */
export const getConnection = () => open({
    filename: './db.sqlite',
    driver: sqlite3.verbose().Database
})