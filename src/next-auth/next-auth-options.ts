import { authenticate } from "@/actions/actions";
import { User } from "@/types/User";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";


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
      ]
    };

    export const getServerAuthSession = () => getServerSession(authOptions);