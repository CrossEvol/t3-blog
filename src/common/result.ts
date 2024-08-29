export type IResult<T> = {
  status: number;
  message: string;
  data: T;
};
