import './styles.scss';

export function Button({ ...props }) {
    return (
        <button 
            className="button" 
            {...props}
        />
    );
}