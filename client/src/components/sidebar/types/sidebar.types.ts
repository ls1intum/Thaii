export type MenuItem = {
    name: string;
    link: string;
}

export type SidebarParams = {
    open: boolean;
    setOpen: (open: boolean) => void
}

export type StatisticParams = {
    open: boolean,
    chats: any,
    messages: any
}

