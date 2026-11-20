var pool = require('./bd');

// Devuelve todas las fotos, en el orden en que fueron subidas
async function getFotos() {
    var query = "select * from galeria order by id asc";
    var rows = await pool.query(query);
    return rows;
}

// Devuelve una sola foto (o undefined si el id no existe)
async function getFotoById(id) {
    var query = "select * from galeria where id = ?";
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function insertFoto(obj) {
    try {
        var query = "insert into galeria set ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function modificarFotoById(obj, id) {
    try {
        var query = "update galeria set ? where id = ?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function deleteFotoById(id) {
    var query = "delete from galeria where id = ?";
    var rows = await pool.query(query, [id]);
    return rows;
}

module.exports = { getFotos, getFotoById, insertFoto, modificarFotoById, deleteFotoById };
