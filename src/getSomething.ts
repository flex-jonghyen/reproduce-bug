type 한글타입 = string;

type 한글리턴타입 = {
    name: string;
    value: 한글타입;
}

export const 한글함수 = (): 한글리턴타입 => {
    return {
        name: 'string',
        value:'string'
    }
}