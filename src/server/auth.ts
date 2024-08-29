import { PrismaAdapter } from '@next-auth/prisma-adapter'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'

import { env } from '@/env'
import { db } from '@/server/db'
import { faker } from '@faker-js/faker'
import Github from 'next-auth/providers/github'
import { z } from 'zod'
import { Role } from '@prisma/client'
import { Provider } from 'next-auth/providers/index'

const encryptPwd = (password: string): string => {
  return password
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

// TODO: how to define the NODE_ENV as 'test' or 'production'?
const providers: (Provider | null)[] = [
  Github({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    profile(profile, tokens) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
        role: profile.login === 'CrossEvol' ? Role.ADMIN : Role.GUEST,
      }
    },
  }),
  EmailProvider({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  }),
  env.PROFILE === 'prod'
    ? null
    : CredentialsProvider({
        id: 'Credentials',
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: 'Credentials',
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          // Add logic here to look up the user from the credentials supplied
          const username = credentials?.username
          let password = credentials?.password
          z.string().parse(username)
          z.string().optional().parse(password)
          password = password ? password : ''

          const user = await db.user.findFirst({
            where: {
              name: username,
            },
          })
          if (user == null) {
            const newUser = await db.user.create({
              data: {
                name: username,
                password: encryptPwd(password),
                email: faker.internet.email(),
                image: faker.internet.avatar(),
                role: 'USER',
              },
            })
            return {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              image: newUser.image,
              role: newUser.role,
            }
          }
          if (user.password !== encryptPwd(password)) {
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          }
        },
      }),
  /**
   * ...add more providers here.
   *
   * Most other providers require a bit more work than the Discord provider. For example, the
   * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
   * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
   *
   * @see https://next-auth.js.org/providers/github
   */
]

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      const dbUser = await db.user.findUnique({
        where: {
          id: token.id as string,
        },
        select: {
          role: true,
        },
      })

      token.role = dbUser?.role

      return token
    },
    session: async ({ session, token }) => {
      console.log('token = ?', token)
      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  adapter: PrismaAdapter(db),
  providers: providers.filter((p) => p !== null),
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
