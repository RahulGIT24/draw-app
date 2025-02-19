"use client"

interface Props {
  classname?: string,
  onClick?: (() => void),
  text?: string,
  image?:string,
  imageclass?:string,
  title?:string
}

export const Button = ({ classname, onClick, text, image,imageclass,title }: Props) => {
  return (
    <button className={`bg-black border border-white rounded-lg px-3 py-2 ` + classname} onClick={onClick ? onClick : () => { }} title={text ?? title}>
      {text ? text : (
        <img 
          src={image} 
          className={"invert "+imageclass}
          alt="icon"
        />
      )}
    </button>
  );
};
