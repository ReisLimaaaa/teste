const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/public'))

app.use("/create", async (req, res) => {
    const { title, source, description, thumb } = req.query
    const db = await getDatabaseInstance()
    const result = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`,
      [title, source, description, thumb]
    )
    res.send(result)
  })

app.use("/read", async (req,res) => {
    const { id } = req.query
    const db = await getDatabaseInstance()
    const leia = await db.get(`SELECT title FROM movies WHERE id=?`, [id])

    res.send(leia)
})

app.use("/update", async (req,res) => {
    const { title, id } = req.query
    const db = await getDatabaseInstance()
    const update = await db.get(`UPDATE movies SET title=? WHERE id=?`, [title, id])

    res.send(update)
})

app.use("/delete", async (req,res) => {
    const { id } = req.query
    const db = await getDatabaseInstance()
    const rm = await db.get(`DELETE FROM movies WHERE id=?`, [id])
    
    res.send(rm)
})

app.listen(3000, () => console.log("Servidor rodando!"))

