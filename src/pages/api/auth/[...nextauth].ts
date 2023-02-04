import NextAuth, {AuthOptions} from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import GithubProvider from "next-auth/providers/github"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
const bcrypt = require('bcrypt');


export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
                clientId: process.env.GOOGLE_ID as string,
                clientSecret: process.env.GOOGLE_SECRET as string
            }
        ),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID as string,
            clientSecret: process.env.APPLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Check if all required parameters are present.
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Email or password is missing from the request.");
                }

                // Get the user from database based on [email].
                const users = (await clientPromise).db().collection("users");
                const user = await users.findOne({email: credentials.email}); // Returns WithId<Document> | null

                // TODO: Change both to "wrong email or password"
                // If the user (email) does not exist, throw an error.
                if (user === null) throw new Error("Wrong email.");

                // Else check the password and throw an error if it doesnt match.
                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) throw new Error("Wrong password.");

                return {id: user._id.toString(), email: user.email};
            }
        })
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt"
    }
}
// /api/auth
export default NextAuth(authOptions);