import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { AnswerType, QuestionType } from '../../hooks/useRoom';

import { database } from '../../services/firebase';
import { toastSuccess } from '../../assets/toasts';

import { Modal } from '../Modal';

import deleteImg from '../../assets/images/delete.svg';

import './styles.scss';


type QuestionProps = {
    isAdmin: boolean;
    isAnswer: boolean;
    question: QuestionType | AnswerType;
    refBase: string;
    showComments?: () => void;
    isCommentsOpen?: boolean;
    showAnswerForm?: () => void;
    isAnswerFormOpen?: boolean;
}

type RoomParams = {
    id: string;
}

export function Question({
    isAdmin,
    isAnswer,
    question,
    refBase,
    showComments,
    isCommentsOpen,
    showAnswerForm,
    isAnswerFormOpen
}: QuestionProps) {
    const { user, signInWithGoogle } = useAuth();
    const { id } = useParams() as RoomParams;
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleLikeQuestion(likeId: string | undefined) {
        if (!user) {
            await signInWithGoogle();

            return;
        }

        if (likeId) {
            await database.ref(`rooms/${id}/questions/${refBase}/likes/${likeId}`).remove();
        } else {
            await database.ref(`rooms/${id}/questions/${refBase}/likes`).push({
                authorId: user?.id,
            });
        }
    }

    async function handleDeleteQuestion() {
        setIsModalOpen(false);

        await database.ref(`rooms/${id}/questions/${refBase}`).remove();
        
        toastSuccess('Pergunta excluída');
    }

    return (
        <>
            {isModalOpen && 
                <Modal
                    object="pergunta"
                    onConfirm={() => handleDeleteQuestion()}
                    onClose={() => setIsModalOpen(false)}
                />
            }
            <div className={`question ${isAnswer ? 'answer' : ''}`}>
                <p>{question.content}</p>
                <footer>
                    <div className="user-info">
                        <img src={question.author.avatar} alt={question.author.name} referrerPolicy="no-referrer" />
                        <span>{question.author.name}</span>
                        <span>{question.publicationDate}</span>
                        {'answers' in question && question.answers.length !== 0 && 
                            <div className="show-comments">
                                <button onClick={showComments}>
                                    <div className={isCommentsOpen ? 'arrow-up' : 'arrow-down'}></div>
                                    {isCommentsOpen ? 'ocultar respostas' : 'exibir respostas'}
                                </button>
                            </div>}
                    </div>
                    <div className="question-buttons">
                        <button
                            className={`like-button ${question.likeId ? 'marked' : ''}`}
                            type="button"
                            aria-label="Marcar como gostei"
                            title="Marcar como gostei"
                            onClick={() => handleLikeQuestion(question.likeId)}
                        >
                            <span>{ question.likeCount }</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        {!isAnswer &&
                        <button
                            className={`${isAnswerFormOpen ? 'marked' : ''}`}
                            type="button"
                            aria-label="Responder pergunta"
                            title="Responder pergunta"
                            onClick={showAnswerForm}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        }
                        {(isAdmin || user?.id === question.author.id) ?
                            (<button
                                type="button"
                                aria-label="Excluir pergunta"
                                title="Excluir pergunta"
                                onClick={() => setIsModalOpen(true)}
                                >
                                <img src={deleteImg} alt="Deletar pergunta" />
                            </button>)
                            : ''
                        }
                    </div>
                </footer>
            </div>
        </>
    );
}