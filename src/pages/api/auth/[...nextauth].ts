import NextAuth, {AuthOptions} from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import mongooseConnect from "../../../lib/mongooseConnect"
import User from "../../../server/mongodb_models/User"
const bcrypt = require('bcrypt')


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
                    throw new Error("Email nebo heslo chybí.");
                }

                // Get the user from database based on [email].
                await mongooseConnect();
                const user = await User.findOne({email: credentials.email}).exec();

                if (user === null) throw new Error("Špatný e-mail nebo heslo.");

                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) throw new Error("Špatný e-mail nebo heslo.");

                return {id: user._id.toString(), email: user.email, image: user.image, name: user.name};
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