"use client"

interface Props {
  classname?: string,
  onClick?: (() => void),
  text: string
}

export const Button = ({ classname, onClick, text }: Props) => {
  return (<button className={`bg-black border border-white rounded-lg `+classname} onClick={onClick ? onClick : ()=>{}}>{text}</button>)
}