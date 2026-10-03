import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets"
        }
      }
    }),
    CredentialsProvider({
      id: "dev-login",
      name: "Dev / Test Mode",
      credentials: {
        username: { label: "Username", type: "text", value: "testuser" }
      },
      async authorize() {
        return {
          id: "dev-user",
          name: "Fredrik (Test User)",
          email: "test@balans.local"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { accessToken?: string }).accessToken = token.accessToken as string;
      return session;
    }
  }
};
