
// Initial state is the place you define all initial values for the Redux store of the feature.
// In the 'standard' way, initialState is defined in reducers: http://redux.js.org/docs/basics/Reducers.html
// But when application grows, there will be multiple reducers files, it's not intuitive what data is managed by the whole store.
// So Rekit extracts the initial state definition into a separate module so that you can have
// a quick view about what data is used for the feature, at any time.

// NOTE: initialState constant is necessary so that Rekit could auto add initial state when creating async actions.
const initialState = {
  sampleList: [], // 当前的投稿列表
  statusTotalCount: { // 每种分类下当前的投稿数量
    total: 0,
    CHECKED: 0,
    UNCHECKED: 0,
    ONLINE: 0,
    REFUSED: 0,
    OFFLINE: 0,
    RECALLED: 0,
  },
  pageSize: 8, // 每页数量 
  totalCount: 0, // 当前分页列表里item总数
  currentPage: 1, // 当前页
  currentTab: 'total', // 当前选中tab
  keyword: '', // 搜索关键词
  // curPage: 1, // 当前页
  // size: 12, // 每页数量
  // status: 'total', // 当前tab状态
  // keyword: '', // 搜索关键词
  // totalCount: 0, // 投稿总数
  recallContributionPending: false,
  recallContributionError: null,
  fetchRecordListPending: false,
  fetchRecordListError: null
};

export default initialState;
