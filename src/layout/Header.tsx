import { CupSoda } from 'lucide-react';

const Header = () => {

    return (
        <header className='flex items-center p-4 border-b-2 border-primary'>
            <div>
                <div className='text-primary'>
                    <CupSoda size="36" />
                </div>
            </div>
            <h1 className='text-primary text-xl'>Drink</h1>
            
        </header>
    )
}

export default Header