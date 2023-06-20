const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/public'))

app.post("/movies", async (req, res) => {
    const { title, source, description, thumb } = req.body
    const db = await getDatabaseInstance()
    const result = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`,
      [title, source, description, thumb]
    )
    res.send(result)
  })

app.get("/movies", async (req,res) => {
    const { id } = req.body
    const db = await getDatabaseInstance()
    const leia = await db.get(`SELECT * FROM movies WHERE id=?`, [id])

    res.send(leia)
})

app.put("/movies", async (req,res) => {
    const { title, id } = req.body
    const db = await getDatabaseInstance()
    const update = await db.get(`UPDATE movies SET title=? WHERE id=?`, [title, id])

    res.send(update)  
})

app.patch("/movies", async (req,res) => {
  const
  const db = await 
})

app.delete("/movies", async (req,res) => {
    const { id } = req.body
    const db = await getDatabaseInstance()
    const rm = await db.get(`DELETE FROM movies WHERE id=?`, [id])
    
    res.send(rm)
})

app.listen(3000, () => console.log("Servidor rodando!"))

