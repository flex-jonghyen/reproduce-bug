import { ReactElement } from "react";

type 리턴타입 = ReactElement;
type ü = {
  한글변수명: string;
  value: string;
};

type 논아스키 = {
  한글변수명: string;
  value: string;
}

export const 한글컴포넌트 = ({ 한글변수명, value }: ü): 리턴타입 => {
  return (
    <div>
      {한글변수명} {value}
    </div>
  );
};
