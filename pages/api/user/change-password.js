import { getSession } from "next-auth/client"

import { verifyPassword, hashPassword } from "../../../helpers/auth"
import { connectToDatabase } from "../../../helpers/db"

async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
    return
  }

  const session = await getSession({
    req,
  })

  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" })
  }

  const email = session.user.email
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword

  const client = await connectToDatabase()
  const userCollection = client.db().collection("users")
  const user = await userCollection.findOne({ email })

  if (!user) {
    client.close()
    return res.status(404).json({ message: "User not found!" })
  }

  const passwordMatch = await verifyPassword(oldPassword, user.password)

  if (!passwordMatch) {
    client.close()
    return res.status(403).json({ message: "Invalid password!" })
  }

  const hashedPassword = await hashPassword(newPassword)

  await userCollection.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  )

  res.status(200).json({ message: "Password changed!" })
}

export default handler
