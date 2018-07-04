import mysql, { Connection } from 'mysql';


export function dbAdapter(dbConfig:object): Connection{
    return mysql.createConnection(dbConfig);
}

