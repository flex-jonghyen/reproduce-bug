type 한글타입 = {
    name: string;
    value: string;
}

export const SomeComponent = ({ name, value }: 한글타입) => {

    return <div>
        {name} {value}
    </div>
}