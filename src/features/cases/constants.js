const CONSTANTS = {
  TYPES: ['hard_loading', 'soft_wear'],
  DETAIL: ['material', 'construction', 'items'],
  material: '主材',
  construction: '施工',
  items: '软装',
  hard_loading: '硬装',
  soft_wear: '软装',
  generalColumn: [
    { title: '序号', dataIndex: 'order', key: 'order', width: 80 },
    { title: '项目', dataIndex: 'title', key: 'title', width: 190 },
    { title: '金额', dataIndex: 'price', key: 'price', width: 190 },
    { title: '备注', dataIndex: 'comment', key: 'comment' },
  ],
  // 主材明细清单
  materialColumn: [
    { title: '产品类型', dataIndex: 'title', key: 'title' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '型号', dataIndex: 'type', key: 'type' },
    { title: '型号辅助信息', dataIndex: 'accessies_type', key: 'accessies_type' },
    { title: '规格', dataIndex: 'specification', key: 'specification' },
    { title: '数量', dataIndex: 'number', key: 'number' },
    { title: '超量价格', dataIndex: 'excess_price', key: 'excess_price' },
  ],
  // 施工明细清单
  constructionColumn: [
    { title: '项目名称', dataIndex: 'title', key: 'title' },
    { title: '工艺做法及材料说明', dataIndex: 'description', key: 'description' },
    { title: '辅料名称规格', dataIndex: 'accessies', key: 'accessies' },
    { title: '数量', dataIndex: 'number', key: 'number', width: 60 },
    { title: '单价（元）', dataIndex: 'price', key: 'price', width: 120 },
    { title: '超量价格（元）', dataIndex: 'excess_price', key: 'excess_price', width: 150 },
  ],
  // 商品明细清单
  itemsColumn: [
    // { title: '编号', dataIndex: '', key: '' },
    { title: '图片', dataIndex: 'image', key: 'image' },
    { title: '商品名称', dataIndex: 'title', key: 'title' },
    { title: '商品ID', dataIndex: 'id', key: 'id' },
    { title: '数量', dataIndex: 'number', key: 'number' },
    { title: '单价（元）', dataIndex: 'price', key: 'price' },
  ],
};

['generalColumn', 'materialColumn', 'constructionColumn', 'itemsColumn'].map(item => {
  return CONSTANTS[item].map(column => {
    return column.className = 'cases-collapse-table-column';
  });
});

export default CONSTANTS;