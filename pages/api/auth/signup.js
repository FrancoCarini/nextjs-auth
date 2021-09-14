import { connectToDatabase } from "../../../helpers/db"
import { hashPassword } from "../../../helpers//auth"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body

    if (
      !email ||
      !password ||
      password.trim().length < 7 ||
      !email.includes("@")
    ) {
      return res.status(422).json({ message: "Invalid Input" })
    }

    const client = await connectToDatabase()
    const db = client.db()

    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      res.status(422).json({ message: "User already exists" })
      client.close()
      return
    }

    const hashedPassword = await hashPassword(password)

    db.collection("users").insertOne({
      email,
      password: hashedPassword,
    })

    res.status(201).json({ message: "Created user!" })
  }
}
