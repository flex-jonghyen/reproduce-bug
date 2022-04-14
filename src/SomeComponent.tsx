import { ReactElement } from "react";

type 리턴타입 = ReactElement;
type 문제타입 = {
  name: string;
  value: string;
};

export const 한글컴포넌트 = ({ name, value }: 문제타입): 리턴타입 => {
  return (
    <div>
      {name} {value}
    </div>
  );
};

