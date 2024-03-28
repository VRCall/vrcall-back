import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

module.exports = async (req:Request, res:Response) => {
    try {
        const id= req.params.id
        const messages = await prisma.friendshipMessage.findMany({
            where:{
                friendship_id: id
            }
        });
        
        return res.status(201).json({'messages':messages})
        
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({'test':error})
    }
};



