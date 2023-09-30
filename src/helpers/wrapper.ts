import { Response } from 'express';

type DataType = Array<any> | Object;
type MetaType = Array<any>;

type ResultType = {
  data: DataType;
  meta?: MetaType;
  message?: string;
  code?: number;
};
interface Meta {
  page: number;
  quantity: number;
  totalPage: number;
  totalData: number;
}

const data = <T>(data: T | T[]) => ({
  err: null,
  data: Array.isArray(data) ? data : [data]
});

const error = (err: any) => ({
  err,
  data: null
});

const paginationData = (data: Array<Object>, meta: Meta) => ({
  err: null,
  data,
  meta
});

const response = (
  res: Response,
  type: 'success' | 'fail' = 'success',
  result: ResultType | null = null,
  message: string = '',
  code: number = 200
) => {
  let status = true;
  let data = result ? result.data : null;

  if (type === 'fail' && result?.data !== null) {
    status = false;
    data = null;
    message = message || result?.message || 'An error occurred';
    code = code || result?.code || 500;
  }

  const responseObj: any = {
    success: status,
    message,
    code
  };

  if (data !== null && data !== undefined) {
    if (Array.isArray(data)) {
      responseObj.data = data.length === 1 ? data[0] : data;
    } else {
      responseObj.data = data;
    }
  }

  res.status(code).json(responseObj);
};

const paginationResponse = (
  res: Response,
  type: 'success' | 'fail',
  result: ResultType,
  message: string = '',
  code: number = 200
) => {
  let status = true;
  let data = result.data;
  let meta = result.meta || null;

  if (type === 'fail' && result.data !== null) {
    status = false;
    data = [];
    message = message || result.message || 'An error occurred';
    code = code || result.code || 500;
  }

  const responseObj: any = {
    success: status,
    message,
    code
  };

  if (data !== null && data !== undefined) {
    if (Array.isArray(data)) {
      responseObj.data = data.length === 1 ? data[0] : data;
    } else {
      responseObj.data = data;
    }
  }

  if (meta !== null) {
    responseObj.meta = meta;
  }

  res.status(code).json(responseObj);
};

export default { data, error, response, paginationResponse, paginationData };
