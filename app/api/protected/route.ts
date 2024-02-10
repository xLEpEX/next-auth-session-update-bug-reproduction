import { auth } from "auth"

export const GET = auth((req) => {
  if (req.auth) {
    //req.auth === session
    return Response.json(req.headers.get("nice"))
  }


  return Response.json({ message: "Not authenticated" }, { status: 401 })
}) as any // TODO: Fix `auth()` return type
