import NextAuth from "next-auth"

import { JWT } from "next-auth/jwt"
import TwitchProvider from "next-auth/providers/twitch"
export interface TwitchSession extends Session {
  activeAccount: TwitchAccount,
  eligibleAccounts: TwitchAccount[],
  access_token: string
}

export interface TwitchAccount {
  name: string | null | undefined,
  id: string | null | undefined,
  role: string,
  avatar: string | null | undefined,
}

export interface TwitchToken  extends Session {
  access_token: string,
  refresh_token: string
  expires_at: number,
  scope: string,
}

const loadEligibleAccounts = async (token: JWT) => {
  return [{
      avatar: "session.user?.image",
      name: "FAYE",
      id: "dsafsafesafe",
      role: "MANAGER"
  },{
      avatar: "session.user?.image",
      name: "SARAH",
      id: "asdfsadf",
      role: "EDITOR"
  },{
      avatar: "session.user?.image",
      name: "TOM",
      id: "asdfsadf",
      role: "EDITOR"
  },{
      avatar: "session.user?.image",
      name: "MAX",
      id: "asdfsadf",
      role: "EDITOR"
  }]
}
import type { NextAuthConfig, Session } from "next-auth"
export let jwtCounter = 0;
export let sessionCounter = 0;
export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,    
    })
  ],
  
  callbacks: {
    authorized({ request, auth }) {
      console.log("authorized ---")
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      jwtCounter++;
      console.log("--- jwt --- " + jwtCounter)
      console.log("jwt trigger", trigger)
      console.log("jwt session user", session?.user?.name)
      
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
