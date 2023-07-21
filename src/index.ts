import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient()
const app = express()
const tokenEnv = process.env.API_TOKEN

app.use(express.json())

app.get('/', (req, res) => {
    res.json('Hi there')
})

app.get('/login/:email/:password/:token',async (req:any, res:any) => {
    const email = String(req.params.email)
    const psswd = String(req.params.password)
    const token = String(req.params.token)

    if(token != tokenEnv){
        res.json('Authentication Failed')
    }else{
        const user = await prisma.user.findUnique({
            where: {
                email: String(email),
                password: String(psswd),
            },
        })

        res.json(user)
    }
})

app.get('/post/:token',async (req:any, res:any) => {
    const token = String(req.params.token)

    if(token != tokenEnv){
        res.json('Authentication Failed')
    }else{
        const feed = await prisma.post.findMany()
        res.json(feed)
    }
})

app.post('/post/:token',async (req: any, res: any) => {
    const token = req.params.token

    if(token != tokenEnv){
        res.json('Authentication Failed')
    }else{
        try{
            const post = await prisma.post.create({
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    published: true,
                    author: req.body.author,
                    authorId: req.body.authorId
                }
            })

            res.json(post)
        }catch(error){
           res.json(error)
        }
    }
})

app.listen(3000, () =>
    console.log('SERVIDOR ESTA RODANDO'),
)