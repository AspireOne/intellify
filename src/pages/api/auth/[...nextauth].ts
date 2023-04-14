import NextAuth, {AuthOptions, DefaultSession} from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import AppleProvider from "next-auth/providers/apple"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import mongooseConnect from "../../../lib/mongooseConnect"
import User from "../../../server/mongodb_models/User"
import Email from "../../../server/lib/mail";
import {Password} from "../../../server/lib/password";

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
        // TODO: Eventually email verification.
        /*EmailProvider({
            server: transport,
            from: `Intellify <${email}>`,
            // 1 week.
            maxAge: 7 * 24 * 60 * 60,
            sendVerificationRequest: async (params) => {
                params.
                Email.sendEmailVerificationMail()
            }
        }),*/
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
                const user = await User.findOne({email: credentials.email});
                if (!user) throw new Error("Špatný e-mail nebo heslo.");

                const passwordMatches = await Password.comparePassword(user.password!, credentials.password);
                if (!passwordMatches) throw new Error("Špatný e-mail nebo heslo.");

                return {id: user.id, email: user.email, image: user.image, name: user.name};
            }
        })
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {strategy: "jwt",},
    callbacks: {
        session: async ({ session, token, user }) => {
/*            console.log("Session Callback: ");
            console.log("session: ", session);
            console.log("token: ", token);
            console.log("user: ", user);
            console.log("\n\n\n\n");*/

            if (session?.user) session.user.id = token.sub;
            return session;
        },
        jwt: async (data) => {
/*            console.log("JWT Callback: ");
            console.log("user: ", user);
            console.log("token: ", token);
            console.log("profile: ", profile);
            console.log("account: ", account);
            console.log("\n\n\n\n");*/

            if (data.isNewUser && (data.user)) {
                if (!(data.token.email || data.profile?.email || data.user?.email))
                    console.error("Silent error: Email not found during JWT callback!");
                try {
                    await Email.sendRegistrationMail((data.token.email || data.profile?.email || data.user?.email)!);
                } catch (e) {
                    console.error("Could not send registration email", e);
                }
            }

            if (data.user) {
                /*token.accessToken = account.access_token;*/
                data.token.id = data.user.id;
            }
            return data.token;
        },
    },
}
// /api/auth
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id?: string | null; // NOTE: made "id" optional (?) and nullable (null) so that it matches types with ones already existing in DefaultSession
        } & DefaultSession["user"];
    }
}
export default NextAuth(authOptions);