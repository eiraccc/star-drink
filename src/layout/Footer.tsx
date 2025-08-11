'use client';
const Footer = () => {
    const today = new Date();
    return (
        <footer className='bg-primary text-text flex items-center justify-center'>
            <p>Copyright &copy; { today.getFullYear() }</p>
        </footer>
    )
}

export default Footer