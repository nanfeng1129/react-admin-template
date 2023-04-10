// 响应的Code
export const RESP_CODE = {
  // SUCCESS:'000000',//成功
  SUCCESS:0,//成功
  NO_LOGIN:1,//未登录
  ONLY_ONE_LOGIN: 11,  //单个用户登录
  SUCCESS2:'0',//成功
  ERROR:'ERROR_01',//失败
};

// 查询组件表单项类型
export const FORM_TYPE =  {
  INPUT: 'input', //输入框
  SELECT: 'select', //下拉框
  AUTO_COMPLETE: 'AutoComplete', //自动完成
  RANGE_PICKER: 'rangePicker', //日期范围选择
  RANGE_PICKER2: 'rangePicker2', //日期范围选择 + 控制按钮
  DATE_PICKER: 'datePicker', //日期选择
  SELECT_MULTIPLE: 'multiple', //多选下拉框
  TIME_PICKER: 'timePicker', //时间选择框
  TIME_PICKER_BN: 'timePickerBeginEnd',//时间选择框 有开始结束  20200806新增类型
  BTN_QUERY: 'query',//按钮组的 查询
  BTN_RESET: 'reset',//按钮组的 重置
  BTN_SHRINK: 'shrink',//按钮组的 展开收起
  PROVINCE: 'province', //省市联动下拉框，也可用于银行支行分行的下拉列表
  RANGE_INPUT: 'rangeInput',// 输入框区间，例子：金额区间
};
