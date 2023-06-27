const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.json())

app.post("/movies", async (req, res) => {
    const { title, source, description, thumb } = req.body
    const db = await getDatabaseInstance()
    const result = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`,
      [title, source, description, thumb])
    res.send(result)
  })

app.get("/movies", async (req,res) => {
    const { id } = req.body
    const db = await getDatabaseInstance()
    const leia = await db.get(`SELECT * FROM movies WHERE id=?`, [id])
    
    res.send(leia)
})

app.put("/movies", async (req, res) => {
  const { title, source, description, thumb, id } = req.body
  const db = await getDatabaseInstance()
  const put = await db.get(`UPDATE movies SET title=?, source=?, description=?, thumb=? WHERE id=?`, 
  [title, source, description, thumb, id])
  res.send(put)
})

app.patch("/movies", async (req, res) => {
  const db = await getDatabaseInstance()
  const { id } = req.query
  const sets = Object.keys(req.body).map(key => `${key}=?`).join(", ")
  const values = Object.values(req.body)
  const patch = await db.get(`UPDATE movies SET ${sets} WHERE id=?`, [...values, id])

  res.send(patch)  
})

app.delete("/movies", async (req,res) => {
    const { id } = req.query
    const db = await getDatabaseInstance()
    const rm = await db.get(`DELETE FROM movies WHERE id=?`, [id])

    res.send(rm)
})

app.listen(3000, () => console.log("Servidor rodando!"))

