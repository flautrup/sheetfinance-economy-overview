import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshGoogleAccessToken(token: Record<string, unknown>) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Failed to refresh Google access token:", refreshedTokens);
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + (refreshedTokens.expires_in ?? 3600)),
      // Fall back to old refresh token if Google didn't return a new one
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing Google access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
          access_type: "offline",
          prompt: "consent",
          response_type: "code"
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
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: account.expires_at, // unix timestamp in seconds
          refreshToken: account.refresh_token,
          user,
        };
      }

      // If token has no expiry (e.g. dev credentials login), return as is
      if (!token.expiresAt) {
        return token;
      }

      // Return previous token if the access token has not expired yet (with a 60-second buffer)
      if (Date.now() < ((token.expiresAt as number) - 60) * 1000) {
        return token;
      }

      // Access token has expired, refresh it using refresh_token
      if (token.refreshToken) {
        return await refreshGoogleAccessToken(token);
      }

      return {
        ...token,
        error: "NoRefreshTokenError",
      };
    },
    async session({ session, token }) {
      (session as { accessToken?: string; error?: string }).accessToken = token.accessToken as string;
      (session as { accessToken?: string; error?: string }).error = token.error as string;
      return session;
    }
  }
};

