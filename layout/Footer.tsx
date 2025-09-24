'use client';
const Footer = () => {
    const today = new Date();
    return (
        <footer className='text-text-secondary flex items-center justify-center'>
            <p>Copyright &copy; { today.getFullYear() }</p>
        </footer>
    )
}

export default Footer