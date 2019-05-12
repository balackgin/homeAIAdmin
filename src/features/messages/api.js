import { get } from '../../common/core/request';
import { host } from '../common/utils/';

export async function fetchMessageList(_, page, size) {
  return get(`${host}/api/designer/sampleRecords`, { event: 'ONLINE,PASS,REFUSE', page, size });
}
