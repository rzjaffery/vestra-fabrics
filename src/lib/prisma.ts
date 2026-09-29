import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    return new PrismaClient()
}

// @ts-ignore
declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
} & typeof globalThis

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma