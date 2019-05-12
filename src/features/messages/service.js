import {
  fetchMessageList
} from './api';
import { spinWrapper } from '../../common/core/wrapper';

export async function getMessageList(type, page, size) {
  const {
    recordList,
    totalCount
  } = await fetchMessageList(type, page, size);
  return {
    recordList,
    totalCount
  };
}

export const servicesWithSpin = {
  getMessageList: spinWrapper(getMessageList)
};