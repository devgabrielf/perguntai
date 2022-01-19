import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import { database } from '../../services/firebase';
import { toastSuccess } from '../../assets/toasts';

import logoImg from '../../assets/images/logo.png';
import deleteImg from '../../assets/images/delete.svg';
import emptyImg from '../../assets/images/empty.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { QuestionBox } from '../../components/QuestionBox';
import { Modal } from '../../components/Modal';
import { LogoutButton } from '../../components/LogoutButton';
import { QuestionForm } from '../../components/QuestionForm';
import { Footer } from '../../components/Footer';

import './styles.scss';

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const { id } = useParams() as RoomParams;
    const [modalRoom, setModalRoom] = useState(false);
    const { authorId, questions, title } = useRoom(id);
    const navigate = useNavigate();
    const isAdmin = user?.id === authorId;

    async function handleDeleteRoom() {
        navigate('/');
        
        toastSuccess('Sala excluída');

        await database.ref(`rooms/${id}`).remove();
    }

    if (!authorId) {
        return (
            <></>
        );
    }

    return (
        <div id="page-room">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            {modalRoom &&
                <Modal
                    object="sala"
                    onConfirm={handleDeleteRoom}
                    onClose={() => setModalRoom(false)}
                />
            }
            <header>
                <div className="content">
                    <Link to="/" className="logo"><img src={logoImg} alt="Perguntaí" /></Link>
                    <div>
                        <RoomCode code={id} />
                        {isAdmin && 
                            <Button onClick={() => setModalRoom(true)} title="Excluir a sala">
                                <img src={deleteImg} alt="Excluir sala" />
                                <span>Excluir sala</span>
                            </Button>
                        }
                    </div>
                </div>
                {user && <LogoutButton />}
            </header>
            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>}
                </div>
                <QuestionForm isAnswer={false} />
                <div className="question-list">
                    {questions.length > 0 ? questions.map(question => {
                        return (
                            <QuestionBox key={question.id} isAdmin={isAdmin} question={question} />
                        );
                    }) : 
                        <div className="no-questions">
                            <img src={emptyImg} alt="Não há questões" />
                            <span>Ainda não há perguntas</span>
                        </div>
                    }
                </div>
            </main>
            <Footer />
        </div>
    );
}