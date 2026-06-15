import React, { ReactNode } from 'react'

export const Buttons = ({type,style,text,changeIcons,icon,action}:
    {type: any,style:string,text:string,changeIcons(e:number): void,icon:any,action: VoidFunction}) => {
  return <button onClick={action} type={type} onMouseEnter={()=>changeIcons(1)} onMouseOut={()=>changeIcons(0)}
  className={style}>{text}{icon}</button>
}
