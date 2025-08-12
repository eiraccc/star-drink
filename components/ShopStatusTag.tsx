import Tooltip from "./Tooltip";
import { IoShieldCheckmark } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";

type ShopStatusType = 'approved' | 'pending' | 'removed' | '';

const ShopStatusTag = ({ shopStatus = '' }: {shopStatus: ShopStatusType}) => {
    let shopIcon;
    let shopLabel;

    switch (shopStatus) {
        case "approved":
            shopIcon = <IoShieldCheckmark className="text-success w-4 h-4" />;
            shopLabel = "Verified shop";
        break;
        case "pending":
            shopIcon = <FaRegClock className="text-primary w-4 h-4" />;
            shopLabel = "Pending review";
        break;
        case "removed":
            shopIcon = <GoAlertFill className="text-danger w-4 h-4" />;
            shopLabel = "Shop no longer exists";
        break;
        default:
        return null;
    }

    return (
        <>
            {shopStatus && <Tooltip text={shopLabel}>
                { shopIcon }
            </Tooltip>}
        </>
    )
}

export default ShopStatusTag