import type {ReactNode} from 'react';
export default function UserPageHeader({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:ReactNode}){return <header data-page-intro><div><p>{eyebrow.toLocaleLowerCase("vi-VN")}</p><h1 className="font-extrabold">{title}</h1><p className="mt-3 max-w-2xl">{description}</p></div>{action}</header>}
