import {get} from '../../common/core/request';
import { host } from '../common/utils/';

export async function fetchProjectList(status, page, size, keyword) {
  return get(`${host}/api/designer/project?`, { status, page, size, keyword });
}

export async function fetchProjectDtl(id) {
  return get(`${host}/api/designer/project/id?`, { id });
}
