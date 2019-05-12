// Initial state is the place you define all initial values for the Redux store of the feature.
// In the 'standard' way, initialState is defined in reducers: http://redux.js.org/docs/basics/Reducers.html
// But when application grows, there will be multiple reducers files, it's not intuitive what data is managed by the whole store.
// So Rekit extracts the initial state definition into a separate module so that you can have
// a quick view about what data is used for the feature, at any time.

// NOTE: initialState constant is necessary so that Rekit could auto add initial state when creating async actions.
const initialState = {
  // keyword: '', // TO BE ADDED，搜索关键字
  current: 1, // 当前页数
  total: 0, // 总数量
  pageSize: 8, // 每页数量
  list: [], // 当前列表数据
  quotation: {}, // 报价单软硬装概览
  // quotationType: 'hard_loading', // 报价单当前显示状态，硬装hard_loading（默认），软装soft_wear
  renderData: {}, // scenego渲染数据
  startLocation: {}, // 起始点数据
  guideMap: [], // 导览图
  customTags: [], // 自定义标签
  // itemList: [], // 宝贝列表，730无法上选品相关的功能
  deleteCasePending: false,
  deleteCaseError: null,
  fetchCasesPending: false,
  fetchCasesError: null,
  fetchQuotationPending: false,
  fetchQuotationError: null,
  saveCoverPending: false,
  saveCoverError: null,
  saveGuideMapPending: false,
  saveGuideMapError: null,
  fetchCaseRenderDataPending: false,
  fetchCaseRenderDataError: null,
  addTagPending: false,
  addTagError: null,
  removeTagPending: false,
  removeTagError: null,
  fetchItemListPending: false,
  fetchItemListError: null,
  updateGuideMapPending: false,
  updateGuideMapError: null,
};

export default initialState;
