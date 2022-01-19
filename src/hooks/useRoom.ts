import { useEffect, useState } from "react";

import { database } from "../services/firebase";

import { useAuth } from "./useAuth";

export interface AnswerType {
    id: string,
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    publicationDate: string;
    likeCount: number;
    likeId: string | undefined;
}

export interface QuestionType extends AnswerType {
    answers: AnswerType[]
}

type FirebaseQuestions = Record<string, {
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    content: string;
    publicationDate: string;
    likes: Record<string, {
        authorId: string;
    }>;
    answers: Record<string, {
        author: {
            id: string;
            name: string;
            avatar: string;
        };
        content: string;
        publicationDate: string;
        likes: Record<string, {
            authorId: string;
        }>;
    }>;
}>

export function useRoom(roomId: string) {
    const { user } = useAuth();
    const [authorId, setAuthorId] = useState('');
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {
            if (room.exists()){
                const databaseRoom = room.val();
                const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
    
                const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                    return {
                        id: key,
                        author: value.author,
                        content: value.content,
                        publicationDate: value.publicationDate,
                        likeCount: Object.values(value.likes ?? {}).length,
                        likeId: Object.entries(value.likes ?? {}).find(([, like]) => like.authorId === user?.id)?.[0],
                        answers: Object.entries(value.answers ?? {}).map(([key, value]) => {
                            return {
                                id: key,
                                author: value.author,
                                content: value.content,
                                publicationDate: value.publicationDate,
                                likeCount: Object.values(value.likes ?? {}).length,
                                likeId: Object.entries(value.likes ?? {}).find(([, like]) => like.authorId === user?.id)?.[0],
                            }
                        })
                    }
                });
    
                setAuthorId(databaseRoom.authorId);
                setTitle(databaseRoom.title);
                setQuestions(parsedQuestions);
            }
        });

        return () => {
            roomRef.off('value');
        }

    }, [roomId, user?.id]);

    return { authorId, questions, title };
}