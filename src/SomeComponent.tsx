import { ReactElement } from "react";

type 리턴타입 = ReactElement;
type a = {
  한글변수명: string;
  value: string;
};

export const 한글컴포넌트 = ({ 한글변수명, value }: a): 리턴타입 => {
  return (
    <div>
      {한글변수명} {value}
    </div>
  );
};
