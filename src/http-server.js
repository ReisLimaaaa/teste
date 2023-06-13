const express = require("express")
const fs = require("fs")
const app = express()

app.use(express.static(__dirname + '/public'))

app.use("/create", async (req, res) => {
    const { title, source, description, thumb } = req.query
    const db = await getDatabaseInstance()
    const result = await db.run(`
      INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`,
      [title, source, description, thumb]
    )
    res.send(result)
  })

app.use("/read", (req,res) => {
    const { file } = req.query
    const teste = fs.readFileSync(file, 'utf8')

    res.send(teste)
})

app.use("/update", (req,res) => {
    const { file, texto } = req.query
    const update = fs.appendFileSync(file, texto)

    res.send(update)
})

app.use("/delete", (req,res) => {
    const { file, query } = req.query
    const rm = fs.rmSync(file)

    res.send(rm)
})

app.listen(3000, () => console.log("Servidor rodando!"))

