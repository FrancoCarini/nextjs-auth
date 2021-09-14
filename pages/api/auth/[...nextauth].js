import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { verifyPassword } from "../../../helpers/auth"
import { connectToDatabase } from "../../../helpers/db"

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const client = await connectToDatabase()

        const user = await client
          .db()
          .collection("users")
          .findOne({ email: credentials.email })

        if (!user) {
          client.close()
          throw new Error("No user found!")
        }

        const equalPassword = await verifyPassword(
          credentials.password,
          user.password
        )

        if (!equalPassword) {
          client.close()
          throw new Error("Could not log you in!")
        }

        client.close()

        return { email: user.email }
      },
    }),
  ],
})
