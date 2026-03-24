const pool = require('./db');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      telefono VARCHAR(20),
      fecha_nacimiento DATE,
      edad INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('Tabla usuarios creada correctamente');
  process.exit(0);
}

migrate().catch(err => { console.error(err); process.exit(1); });