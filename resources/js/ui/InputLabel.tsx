import { ReactNode } from "react";

export default function InputLabel({ value, className,htmlFor, }:{value:string,className?:string,htmlFor:string}) {
    return (
        <label htmlFor={htmlFor} className={`block font-medium text-sm text-gray-700 ` + className}>
            { value }
        </label>
    );
}
