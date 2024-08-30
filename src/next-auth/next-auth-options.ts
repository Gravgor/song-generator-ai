import { authenticate, createGoogleUser, createUser, getUserByEmail } from "@/app/actions";
import { User } from "@/types/User";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";



export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }) {
          if (account && account.type === "credentials") {
            token.userId = account.providerAccountId!;
          }
          return token;
        },
        async session({ session, token }) {
          session.user.id = token.userId;
          return session;
        },
        async signIn({account, user}) {
          if (account && account.type === "credentials") {
            return true;
          }
          if (account && account.provider === "google") {
            const email = user.email || "";
            const name = user.name || "";
            const findUser = await getUserByEmail(email);
            if (findUser) {
              return true;
            }
           const userCreate = await createGoogleUser(email, name);
            if (!userCreate) {
              return false;
            }
            return true;
          }
          return true;
        }
      },
      pages: {
        signIn: "/auth/signin",
      },
      providers: [
        Credentials({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials): Promise<User | null> {
            const { email, password } = credentials as {
              email: string;
              password: string;
            };
    
            const user = await authenticate(email, password);
            if (user) {
              return {
                id: user.id,
                username: user.username,
                email: user.email,
              } as User;
            }
            return null;
          },
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    };

    export const getServerAuthSession = () => getServerSession(authOptions);