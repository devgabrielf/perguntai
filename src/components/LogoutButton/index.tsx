import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import { Modal } from "../Modal";

import logoutImg from '../../assets/images/logout.svg';

import './styles.scss';

export function LogoutButton() {
    const { googleSignOut } = useAuth();
    const [modalRoom, setModalRoom] = useState(false);

    async function handleLogout() {
        await googleSignOut();
    }

    return (
        <div className="logout-button" >
            {modalRoom && <Modal object="logout" onConfirm={handleLogout} onClose={() => setModalRoom(false)}/>}
            <button title="Sair da conta" onClick={() => setModalRoom(true)}>
                <img src={logoutImg} alt="Fazer logout" />
            </button>
        </div>
    );
}