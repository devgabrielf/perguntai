import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import TextareaAutosize from 'react-textarea-autosize';

import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';
import { toastSuccess } from '../../assets/toasts';

import { Button } from '../Button';

import './styles.scss';

type RoomParams = {
    id: string;
}

type QuestionFormParams = {
    isAnswer: boolean;
    questionId?: string;
    closeAnswerForm?: () => void;
    showComments?: () => void;
    isCommentsOpen?: boolean
}

export function QuestionForm({
    isAnswer,
    questionId,
    closeAnswerForm,
    showComments,
    isCommentsOpen
}: QuestionFormParams) {
    const { user, signInWithGoogle } = useAuth();
    const { id } = useParams() as RoomParams;
    const [newQuestion, setNewQuestion] = useState('');
    const MAX_LENGTH = 1024;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isAnswer && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isAnswer]);

    async function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        await signInWithGoogle();
    }

    function scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    }
    
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        }

        if (!user) {
            await signInWithGoogle();

            return;
        }

        const question = {
            content: newQuestion,
            author: {
                id: user.id,
                name: user.name,
                avatar: user.avatar
            },
            publicationDate: (new Date()).toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}),
        }

        if (!isAnswer) {
            await database.ref(`rooms/${id}/questions`).push(question);
            scrollToBottom();
        } else {
            await database.ref(`rooms/${id}/questions/${questionId}/answers`).push(question);
            showComments && !isCommentsOpen && showComments();
        }

        setNewQuestion('');
        closeAnswerForm && closeAnswerForm();

        toastSuccess('Pergunta enviada');
    }

    return (
        <form className="form" onSubmit={handleSendQuestion}>
            <TextareaAutosize
                placeholder={isAnswer ? 'Digite sua resposta' : 'O que você quer perguntar?'}
                onChange={event => setNewQuestion(event.target.value)}
                value={newQuestion}
                maxLength={MAX_LENGTH}
                ref={textareaRef}
            />
            <div className="form-footer">
                { user ? (
                    <div className="user-info">
                        <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" />
                        <span>{user.name}</span>
                    </div>
                ) : (
                    <span>{!isAnswer ? 'Para enviar uma pergunta' : 'Para responder a esta pergunta'}, <button onClick={handleLogin}>faça seu login</button>.</span>
                )}
                <Button type="submit" disabled={!user || newQuestion.trim() === ''}>Enviar</Button>
            </div>
        </form>
    );
}