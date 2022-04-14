type 한글타입 = string;

type 한글리턴타입 = {
    한글변수명: string;
    value: 한글타입;
}

type 한글파라매터 = {
    value: 한글타입
}


export const 한글함수 = (params: 한글파라매터): 한글리턴타입 => {
    const { value } = params;
    return {
        한글변수명: 'string',
        value,
    }
}