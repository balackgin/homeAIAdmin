const messageTpl = (type, attribute) => {
  const {
    customerManager,
    customer,
    sample
  } = attribute;
  const tpls = {
    '1': `${customerManager}给您指派了一个新项目。`,
    '2': `客户${customer}的项目您还未响应请尽快联系客户！`,
    '3': `客户${customer}的项目已被${customerManager}转移给其他设计师。`,
    '4': `客户${customer}已确认了您的设计方案！`,
    '5': `客户${customer}已对您的设计服务做出了评价。`,
    '6': `客户${customer}已签单`,
    '7': `您的投稿${sample}审核已通过，等待发布中`,
    '8': `您的投稿${sample}已发布`,
    '9': `您的投稿${sample}审核未通过`
  };
  return tpls[type];
};

export {
  messageTpl
};