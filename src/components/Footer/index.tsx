import heartImg from '../../assets/images/heart.svg'
import githubImg from '../../assets/images/github.svg'
import linkedinImg from '../../assets/images/linkedin.svg'

import './styles.scss';

export function Footer() {
    return (
        <footer>
            <span>Feito com <img src={heartImg} alt="amor" /> por Gabriel Ferreira</span>
            <a href="https://github.com/devgabrielf" target="_blank" rel="noreferrer">
                <img src={githubImg} alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/gabriel-ferreira5/" target="_blank" rel="noreferrer">
                <img src={linkedinImg} alt="Linkedin" />
            </a>
        </footer>
    )
}