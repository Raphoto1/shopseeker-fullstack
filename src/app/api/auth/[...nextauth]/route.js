//imports de app
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
//imports propios
import { mongoDbUserChkEmail } from "@/dao/user.dao";

const handler = NextAuth({
    session: {
        strategy: "jwt",
      },
      callbacks: {
        async jwt({ token, user }) {
          if (user?._id) token._id = user._id;
          if (user?.isAdmin) token.isAdmin = user.isAdmin;
          if (user?.role) token.role = user.role;
          console.log("estes es user de jwt",user);
          return token;
        },
        async session({ session, token }) {
          if (token?._id) session.user._id = token._id;
          if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
          if (token?.role) session.user.role = token.role;
          console.log('esto es session',session);
          return session;
        },
      },
      providers: [
        CredentialsProvider({
          name: "credentials",
          credentials: {
            email: {
              label: "email",
              type: "email",
              placeholder:"your email"
            },
            password: {
              label: "Password",
              type: "password",
              placeholder:"your password"
            }
          },
          async authorize(credentials, req) {
            const user = await mongoDbUserChkEmail(credentials.email);
            if (!user) throw new Error("Invalid Email or Password");
            const passCompare = await bcrypt.compare(credentials.password,user.password)
            if (user && passCompare) {
              return {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                role:user.role
              };
            }
            throw new Error("Invalid Email or Password");
          }
        })
      ]
})

export { handler as GET, handler as POST }