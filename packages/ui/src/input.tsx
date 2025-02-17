interface PropTypes {
    placeholder: string,
    type: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    classname?: string
}

export default function Input({ placeholder, classname, type, value, onChange }: PropTypes) {
    return (<input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`p-2 outline-none rounded-md ` + classname} />)
}