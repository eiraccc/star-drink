import { useNavigate } from 'react-router-dom';

type propsType = {
    errorMsg: string,
    btnText?: string,
    btnActionHome?: boolean,
    btnAction?: () => void
}

const ErrorSection = ({
    errorMsg = '',
    btnText = '',
    btnActionHome,
    btnAction
}: propsType) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center p-6 text-center text-text-secondary">
        <p className="mb-4 text-lg font-semibold">
            { errorMsg }
        </p>
        {(btnText || btnActionHome) && <button
            onClick={btnActionHome ? () => navigate('/') : btnAction}
            className="px-4 py-2 bg-primary text-contrast rounded-full hover:bg-primary-dark transition"
        >
            { btnActionHome ? 'Back Home' : btnText }
        </button>}
        </div>
    )
}

export default ErrorSection