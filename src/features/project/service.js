import {
  fetchProjectList,
  fetchProjectDtl
} from './api';
import { spinWrapper } from '../../common/core/wrapper';

export async function getProjectList(status, page, size, keyword) {
  const newStatus = status === 'total' ? '' : status;
  const {
    dataArr: projectList,
    statusTotalCount,
    totalCount
  } = await fetchProjectList(newStatus, page, size, keyword);
  return { projectList, statusTotalCount, totalCount};
}

export async function getProjectDtl(id) {
  const data = await fetchProjectDtl(id);
  return data;
}

export const servicesWithSpin = {
  getProjectList: spinWrapper(getProjectList),
  getProjectDtl: spinWrapper(getProjectDtl)
};
