// import { PrismaClient } from '@prisma/client';
// import { Server, Socket } from 'socket.io';

// const prisma = new PrismaClient();

// const editMessage = async (editedMessage: { messageId: string, newContent: string }) => {
//     try {
//         const updatedMessage = await prisma.message.update({
//             where: { id: editedMessage.messageId },
//             data: { content: editedMessage.newContent }
//         });
//         io.emit('editMessage', updatedMessage);
//     } catch (error) {
//         console.error('Error editing message:', error);
//     }
// };

// export default editMessage;
