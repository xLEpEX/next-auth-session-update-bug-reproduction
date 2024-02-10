import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad";

import TwitchProvider from "next-auth/providers/twitch"

import type { NextAuthConfig, Session } from "next-auth"
export let jwtCounter = 0;
export let sessionCounter = 0;
export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,    
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      profile(profile) {
        console.log("profile", profile)
        return {}
      }
    })
  ],
  
  callbacks: {
    authorized({ request, auth }) {
      console.log("authorized ---")
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      jwtCounter++;
      console.log("--- jwt --- " + jwtCounter)
      console.log("jwt trigger", trigger)
      console.log("jwt session user", session?.user?.name)
      console.log("jwt token", token)
      console.log("jwt account", account)
      if (trigger === "update" && session?.user?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        console.log("session.user.name", session.user.name)
        token.name = session.user.name
      }
      return token
    },
    session({ session, trigger, newSession, token }) {
      sessionCounter++;
      console.log("--- session --- " + sessionCounter)
      console.log("session trigger", trigger)
      console.log("session session", session?.user?.name)
      //console.log("session newSession", newSession)
      console.log("session token", token.name)
      // Note, that `rest.session` can be any arbitrary object, remember to validate it!
      if (trigger === "update" && newSession?.name) {
        // You can update the session in the database if it's not already updated.
        // await adapter.updateUser(session.user.id, { name: newSession.name })

        // Make sure the updated value is reflected on the client
        session.user.name = token.name;
      }
      return session
    }
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
