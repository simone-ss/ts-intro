import mysql from 'mysql';
import {wrap} from "node-mysql-wrapper";

export function dbAdapter(dbConfig:object){
    // Initialize connection
    var connection = mysql.createConnection(dbConfig);
    return wrap(connection);

}

