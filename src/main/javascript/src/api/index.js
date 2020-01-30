import axios from 'axios';

export const apiRoot = '/config';
export const mockRoot = '/mock/';
export const downloadUrl = apiRoot + '?download';

export const getHost = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:9000'; // FIXME: port number should be flexible
  }
  return window.location.href;
}

export async function getHttpMethods() {
  try {
    const { data } = await axios.get(apiRoot + '/httpMethod');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getHttpStatus() {
  try {
    const { data } = await axios.get(apiRoot + '/httpStatus');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getContentTypes() {
  try {
    const { data } = await axios.get(apiRoot + '/contentType');
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getEndPoints() {
  try {
    const { data } = await axios.get(apiRoot);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function deleteEndPoint(id) {
  try {
    const { data } = await axios.delete(apiRoot + '/' + id);
    return data
  } catch (err) {
    throw err;
  }
}

export async function createEndPoint(endPoint) {
  try {
    const { data } = await axios.post(apiRoot, endPoint);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function updateEndPoint(endPoint) {
  try {
    const { data } = await axios.put(apiRoot, endPoint);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function getRequestLogs(endPointId, page = 1, pageSize = 5) {
  try {
    const { data } = await axios.get(apiRoot + '/' + endPointId + '/request', { params: { page, pageSize }});
    return data;
  } catch (err) {
    throw err;
  }
}