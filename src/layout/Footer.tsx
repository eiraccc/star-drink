const Footer = () => {
    const today = new Date();
    return (
        <footer className='bg-secondary text-primary flex items-center justify-center'>
            <p>Copyright &copy; { today.getFullYear() }</p>
        </footer>
    )
}

export default Footer