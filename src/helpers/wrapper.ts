import { Response } from 'express';

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

type DataType = Array<any> | Object;
type MetaType = Array<any>;

type ResultType = {
  data: DataType;
  meta?: MetaType;
  message?: string;
  code?: number;
};

const response = (
  res: Response,
  type: 'success' | 'fail',
  result: ResultType,
  message: string = '',
  code: number = 200
) => {
  let status = true;
  let data = result.data || result;
  let meta = result.meta;
  if (type === 'fail') {
    status = false;
    data = [];
    message = message || result.message || 'An error occurred';
    code = code || result.code || 500;
  }
  res.status(code).json({
    success: status,
    data,
    meta,
    message,
    code
  });
};

const errorResponse = (res: Response, result: any, message: string = '', code: number = 500) => {
  let status = true;
  let data = result ? result.message : null;

  res.status(code).json({
    success: status,
    data,
    message,
    code
  });
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
  if (type === 'fail') {
    status = false;
    data = [];
    message = result.message || message;
  }
  res.status(code).json({
    success: status,
    data,
    meta: result.meta,
    message,
    code
  });
};

export default { data, error, response, errorResponse, paginationResponse, paginationData };