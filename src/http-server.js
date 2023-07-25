const crypto = require("crypto")
const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/../public'))
app.use(express.json())

const loginTokens = []

function login(req, res, next) {
  const { token } = req.query
  if (loginTokens.includes(token)) {
    next()
    return
  }
  res.status(400).json({ error: true, msg: "token de acesso inválido!" })
}

app.get("/login", (req, res) => {
  const { login, senha } = req.query
  if (login == "Rebeca" && senha == "123123") {
    const hash = crypto.randomBytes(20).toString('hex')
    loginTokens.push(hash)
    console.log(hash)
    res.json({ error: false, token: hash })
    return
  }
  res.status(400).json({  error: true, msg: "usuário e senha inválidos" })
})


app.post("/movies", login, async (req, res) => {
    const { title, source, description, thumb } = req.body
    const db = await getDatabaseInstance()
    const result = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`,
      [title, source, description, thumb])
    res.send(result)
  })

app.get("/movies", login, async (req,res) => {
    const db = await getDatabaseInstance()
    const leia = await db.all(`SELECT * FROM movies ORDER BY id DESC`)
    res.send(leia)
})

app.put("/movies", login, async (req, res) => {
  const { title, source, description, thumb, id } = req.body
  const db = await getDatabaseInstance()
  const put = await db.run(`UPDATE movies SET title=?, source=?, description=?, thumb=? WHERE id=?`, 
  [title, source, description, thumb, id])
  res.send(put)
})

app.patch("/movies", login, async (req, res) => {
  const db = await getDatabaseInstance()
  const { id } = req.query
  const sets = Object.keys(req.body).map(key => `${key}=?`).join(", ")
  const values = Object.values(req.body)
  const patch = await db.run(`UPDATE movies SET ${sets} WHERE id=?`, [...values, id])

  res.send(patch)  
})

app.delete("/movies", login, async (req,res) => {
    const { id } = req.query
    const db = await getDatabaseInstance()
    const rm = await db.run(`DELETE FROM movies WHERE id=?`, [id])

    res.send(rm)
})

app.listen(3000, () => console.log("Servidor rodando!"))

