import { useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import logoImg from '../../assets/images/logo.png';
import googleIconImg from '../../assets/images/google-icon.svg';

import { database } from '../../services/firebase';
import { toastError } from '../../assets/toasts';

import { Button } from '../../components/Button';
import { LogoutButton } from '../../components/LogoutButton';
import { Footer } from '../../components/Footer';

import { useAuth } from '../../hooks/useAuth';

import './styles.scss';

export function Home() {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');
    const [newRoom, setNewRoom] = useState('');

    async function handleLogin(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        await signInWithGoogle();
    }

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        let roomId = 0;
        let roomExists = true;
        
        const roomRef = database.ref('rooms');

        while (roomExists) {
            let id = 0;

            for (var i = 0; i < 6; i++) {
                id += Math.floor(Math.random() * 10) * Math.pow(10, i);
            }

            roomId = id;
            roomExists = (await roomRef.child(roomId.toString()).get()).exists();
        }

        roomRef.child(roomId.toString()).set({
            title: newRoom,
            authorId: user?.id,
        });

        navigate(`/rooms/${roomId}`);
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            toastError('Sala não encontrada');

            return;
        }

        navigate(`/rooms/${roomCode}`);
    }

    return (
        <div id="home">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <header>
                <img src={logoImg} alt="Perguntaí" />
                {user ? <LogoutButton /> : <div></div>}
            </header>
            <main>
                <div className="main-wrapper">
                    <strong>Acesse salas de perguntas & respostas e tire suas dúvidas</strong>
                    <div className="room-options">
                        <div>
                            <h2>Entre em uma sala</h2>
                            <form onSubmit={handleJoinRoom}>
                                <input 
                                    type="text"
                                    placeholder="Digite o código da sala"
                                    onChange={event => setRoomCode(event.target.value)}
                                    value={roomCode}
                                />
                                <Button type="submit">
                                    Entrar na sala
                                </Button>
                            </form>
                        </div>
                        <div className="separator">ou</div>
                        <div>
                            <h2>Crie uma nova sala</h2>
                            {!user ? 
                                <div className="login">
                                    <span>Para criar uma sala, faça seu login:</span>
                                    <Button onClick={handleLogin}>
                                        <img src={googleIconImg} alt="Logo do Google" />
                                        Entrar com o Google
                                    </Button>
                                </div> :
                                <form onSubmit={handleCreateRoom}>
                                    <input 
                                        type="text"
                                        placeholder="Digite o nome da sala"
                                        onChange={event => setNewRoom(event.target.value)}
                                        value={newRoom}
                                    />
                                    <Button type="submit">
                                        Criar sala
                                    </Button>
                                </form>
                            }
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}