import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from "react-icons/lu"

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Home",
        icon: LuHandCoins,
        path: "/",
    },
    {
        id: "03",
        label: "Sites",
        icon: LuWalletMinimal,
        path: "/sites",
    },
    {
        id: "04",
        label: "Logout",
        icon: LuLogOut,
        path: "/logout",
    },
]
