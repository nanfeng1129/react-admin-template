import React, { useState, Fragment, useEffect } from 'react'
import { withRouter } from 'react-router';
import {
  Form, Row, Col, Input, DatePicker, Icon,
  Button, Select, Tooltip, Radio, TimePicker, 
  Cascader,AutoComplete
} from 'antd';
import moment from "moment";
import { FORM_TYPE } from '../../constants/common'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm:ss';
const timeStart = '00:00:00';
const timeEnd = '23:59:59';

const CommonSeatch = (props) => {

  const [ form ] = Form.useForm()
  const [ formData, setFormData ] = useState({})
  const [ radioValue, setRadioValue ] = useState('')
  let columnNumber = 6

  useEffect(() => {
    initFormComponent()
  }, [])

  // optionsForms 对应查询条件，
  const { optionsForms, colNum, specialCol, queryData } = props

  if (colNum) {
    columnNumber = colNum
  }

  const isEmptyVal = (_data) => {
    return _data === null || _data === undefined || _data === ''
  }

  const onRangePickerChange = (dates, dateStrings, key) => {
    if (dates) {
      setFormData(pre => ({
        ...pre,
        [key]: `${dateStrings[0]},${dateStrings[1]}`,
        [`${key}Start`]: dateStrings[0],
        [`${key}End`]: dateStrings[1],
      }))
    } else {
      setFormData(pre => ({
        ...pre,
        [key]: `,`,
        [`${key}Start`]: '',
        [`${key}End`]: '',
      }))
    }
    setRadioValue('')
  };

  const onRangePickerChange2 = (val1, val2, key) => {
    setFormData(pre => ({
      ...pre,
      [key]: `${val1},${val2}`,
      [`${key}Start`]: val1,
      [`${key}End`]: val2,
    }))
  }

  const onRadioChange = (e, key) => {
    setRadioValue(e.target.value)
    switch (e.target.value) {
      case 'today':
        onRangePickerChange2(moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), key)
        break;
      case 'yesterday':
        onRangePickerChange2(moment().subtract(1, 'd').format("YYYY-MM-DD"), moment().subtract(1, 'd').format("YYYY-MM-DD"), key)
        break;
      case 'week':
        onRangePickerChange2(moment().subtract(7, 'd').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), key)
        break;
      case 'month':
        onRangePickerChange2(moment().subtract(30, 'd').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), key)
        break;
      case 'beforeMonth':
        onRangePickerChange2(moment().subtract(60, 'd').format("YYYY-MM-DD"), moment().subtract(30, 'd').format("YYYY-MM-DD"), key)
        break;
      default:
        break;
    }
  }

  const renderRadioGroupData = (val) => {
    switch (val) {
      case 'today':
        return (<Radio.Button value="today" key={val}>今天</Radio.Button>)
      case 'yesterday':
        return (<Radio.Button value="yesterday" key={val}>昨天</Radio.Button>)
      case 'week':
        return (<Radio.Button value="week" key={val}>最近一周</Radio.Button>)
      case 'month':
        return (<Radio.Button value="month" key={val}>最近30天</Radio.Button>)
      case 'beforeMonth':
        return (<Radio.Button value="beforeMonth" key={val}>30天以前</Radio.Button>)
      default:
        return null
    }
  }

  const renderOption = (_data) => {
    switch (_data.type) {
      case FORM_TYPE.INPUT:
        return (
          <Input
            value={formData[_data.key]}
            onChange={ e => {
              setFormData(pre => ({
                ...pre,
                [_data.key]: e.target.value
              }));
            }}
            placeholder={`请输入${_data.title}`}
          />
        );
      case FORM_TYPE.SELECT:
        return (
          <Select
            value={formData[_data.key]}
            onChange={e => {
              setFormData(pre => ({
                ...pre,
                [_data.key]: e
              }));
            }}
            showSearch
            optionFilterProp="children"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            filterOption={(input, option) => option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              !_data.hiddenAll ? 
                (
                  <Option value=''><Tooltip title='全部'>全部</Tooltip></Option>
                ) : null
            }
            {
              _data.resource ? 
                _data.resource.map((item2,index2) => (
                  <Option value={item2.val} key={index2}>
                    <Tooltip title={item2.title}>{item2.title}</Tooltip>
                  </Option>
                )) : null
            }
          </Select>
        );
      case FORM_TYPE.RANGE_PICKER:
        return (
          <RangePicker
            allowClear={true}
            format={dateFormat}
            placeholder={['开始日期', '结束日期']}
            onChange={(dates, dateStrings) => onRangePickerChange(dates, dateStrings, _data.key)}
            value={ 
              isEmptyVal(formData[`${_data.key}Start`]) || isEmptyVal(formData[`${_data.key}End`]) ? 
                null : 
                [moment(formData[`${_data.key}Start`], dateFormat), moment(formData[`${_data.key}End`], dateFormat)] 
            }
          />
        );
      case FORM_TYPE.DATE_PICKER:
        return (
          <DatePicker
            value={isEmptyVal(formData[`${_data.key}`]) ? null : moment(formData[`${_data.key}`], dateFormat)}
            format={dateFormat}
            placeholder={'选择日期'}
            onChange={(val, dateString) => {
              setFormData(pre => ({
                ...pre,
                [_data.key]: `${dateString}`,
              }))
            }}
            allowClear={true}
          />
        );
      case FORM_TYPE.SELECT_MULTIPLE:
        return (
          <Select
            mode="multiple"
            value={formData[_data.key]}
            onChange={e => {
              setFormData(pre => ({
                ...pre,
                [_data.key]: e && e.length > 0 ? e : ['']
              }));
            }}
            showSearch
            optionFilterProp="children"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            filterOption={(input, option) => option.props.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              !_data.hiddenAll ? 
                (
                  <Option value=''><Tooltip title='全部'>全部</Tooltip></Option>
                ) : null
            }
            {
              _data.resource ? 
                _data.resource.map((item2,index2) => (
                  <Option value={item2.val} key={index2}>
                    <Tooltip title={item2.title}>{item2.title}</Tooltip>
                  </Option>
                )) : null
            }
          </Select>
        )
      case FORM_TYPE.RANGE_INPUT:
        return (
          <div style={{display: 'flex'}}>
            <Input
              value={formData[`${_data.key}Start`]}
              onChange={e => {
                setFormData(pre => ({
                  ...pre,
                  [`${_data.key}Start`]: e.target.value
                }))
              }}
              style={{height: '32px', width: '50%'}}
              placeholder='请输入'
            />
            <span>&nbsp;-&nbsp;</span>
            <Input
              value={formData[`${_data.key}End`]}
              onChange={e => {
                setFormData(pre => ({
                  ...pre,
                  [`${_data.key}End`]: e.target.value
                }))
              }}
              style={{height: '32px', width: '50%'}}
              placeholder='请输入'
            />
          </div>
        );
      case FORM_TYPE.TIME_PICKER_BN:
        return (
          <div style={{display:'flex'}}>
            <TimePicker
              style={{height:'32px', width: '50%'}}
              allowClear={false}
              value={isEmptyVal(formData[`${_data.key}Start`]) ? moment(timeStart, timeFormat) : moment(formData[`${_data.key}Start`], timeFormat)}
              onChange={(value,timeString) => {
                setFormData(pre => ({
                  ...pre,
                  [`${_data.key}Start`]: timeString
                }))
              }}
            />
            <TimePicker
              style={{height:'32px',width: '50%',marginLeft:'10px'}}
              allowClear={false}
              value={isEmptyVal(formData[`${_data.key}End`]) ? moment(timeEnd, timeFormat) : moment(formData[`${_data.key}End`], timeFormat)}
              onChange={(value,timeString) => {
                setFormData(pre => ({
                  ...pre,
                  [`${_data.key}End`]: timeString
                }))
              }}
            />
          </div>
        )
    }
  }

  const renderFormOptions = () => {
    let arr = optionsForms ? optionsForms : []

    return (
      <Fragment>
        {
          arr.map(item => {
            if (item.type !== FORM_TYPE.RANGE_PICKER2) {
              return (
                <Col
                  span={columnNumber}
                  key={item.key}
                >
                  <FormItem label={item.title} colon={false}>
                    {
                      renderOption(item)
                    }
                  </FormItem>
                </Col>
              )
            } else {
              return (
                <Col span={24} key={item.key}>
                  <Col span={12} key={item.key}>
                    <FormItem label={item.title} colon={false}>
                      <RangePicker
                        allowClear={true}
                        format={dateFormat}
                        placeholder={['开始日期', '结束日期']}
                        onChange={(dates, dateStrings) => onRangePickerChange(dates, dateStrings, item.key)}
                        value={ 
                          isEmptyVal(formData[`${item.key}Start`]) || isEmptyVal(formData[`${item.key}End`]) ? 
                            null : 
                            [moment(formData[`${item.key}Start`], dateFormat), moment(formData[`${item.key}End`], dateFormat)] 
                        }
                      />
                    </FormItem>
                  </Col>
                  <Col span={12} key={item.key} style={{paddingLeft: '20px'}}>
                    <Radio.Group 
                      buttonStyle="solid" 
                      onChange={e => onRadioChange(e, item.key)} 
                      value={radioValue}
                    >
                      {
                        item.renderRadioGroup ? 
                          item.renderRadioGroup.map(item => (renderRadioGroupData(item)))
                          : null
                      }
                    </Radio.Group>
                  </Col>
                </Col>
              );
            }
          })
        }
      </Fragment>
    )
  }

  const supplementCol = () => {
    if (specialCol) {
      let girdNum = 24 / columnNumber;
      let rs = girdNum - 1 - ((optionsForms.length - 1) % girdNum);
      let loopColumns = [];
      for(let i = 0, len = rs; i < len; i++){
        loopColumns.push('');
      }
      return loopColumns;
    }
    if(optionsForms && optionsForms.length > 0){
      let girdNum = 24 / columnNumber;
      let rs = girdNum - 1 - (optionsForms.length % girdNum);
      let loopColumns = [];
      for(let i = 0, len = rs; i < len; i++){
        loopColumns.push('');
      }
      return loopColumns;
    } else {
      return 0;
    }
  };

  const initFormComponent = () => {
    if (optionsForms) {
      let obj = {};
      optionsForms.forEach(item => {
        obj[item.key] = item.value;
        switch (item.type) {
          case FORM_TYPE.INPUT:
            break;
          case FORM_TYPE.SELECT:
            break;
          case FORM_TYPE.RANGE_PICKER:
            if (item.value && item.value.split(',') && item.value.split(',').length === 2){
              obj[`${item.key}Start`] = item.value.split(',')[0];
              obj[`${item.key}End`] = item.value.split(',')[1];
            }else{
              obj[`${item.key}Start`] = null;
              obj[`${item.key}End`] = null;
            }
            break;
          case FORM_TYPE.RANGE_PICKER2:
            setRadioValue(item.defaultDate ? item.defaultDate : '')
            if(item.value && item.value.split(',') && item.value.split(',').length === 2){
              obj[`${item.key}Start`] = item.value.split(',')[0];
              obj[`${item.key}End`] = item.value.split(',')[1];
            } else if (item.defaultDate) {
              onRadioChange({ target: { value: item.defaultDate }}, item.key)
            } else {
              obj[`${item.key}Start`] = null;
              obj[`${item.key}End`] = null;
            }
            break;
          case FORM_TYPE.RANGE_INPUT:
            if (item.value && item.value.split(',') && item.value.split(',').length === 2) {
              obj[`${item.key}Start`] = item.value.split(',')[0];
              obj[`${item.key}End`] = item.value.split(',')[1];
            } else {
              obj[`${item.key}Start`] = null;
              obj[`${item.key}End`] = null;
            }
            break;
          case FORM_TYPE.DATE_PICKER:
            break;
          case FORM_TYPE.TIME_PICKER:
            obj[item.key] = isEmptyVal(item.value) ? timeStart : item.value;
            break;
          case FORM_TYPE.TIME_PICKER_BN:
            if (item.value && item.value.split(',') && item.value.split(',').length === 2){
              obj[`${item.key}Start`] = item.value.split(',')[0];
              obj[`${item.key}End`] = item.value.split(',')[1];
            } else {
              obj[`${item.key}Start`] = timeStart;
              obj[`${item.key}End`] = timeEnd;
            }
            break;
          case FORM_TYPE.PROVINCE:
            obj[item.key] = [];
            obj[`${item.key}History`] = [];
            break;
          default: 
            break;
        }
      });
      setFormData(obj);
    }
  };

  return (
    <div className='common-search'>
      <Form 
        layout='vertical'
        name='common-search'
      >
        <Row gutter={10}>
          { renderFormOptions() }
          { supplementCol().map((item, index) => <Col key={index} span={columnNumber}>{item}</Col>) }
          <Col span={columnNumber} className='common-search-btn-list'>
            <FormItem label='' colon={false} style={{ textAlign: "left" }}>
              <Button 
                onClick={() => { queryData(formData) }}
                type="primary" 
                htmlType="submit"
                className='seartch-btn'
              >
                查询
              </Button>
              <Button 
                onClick={() => initFormComponent()} 
                style={{ marginLeft: '10px' }}
                className='seartch-btn'
              >
                重置
              </Button>
              {/* <Button 
                onClick={this.btnShrink} 
                style={{ marginLeft: 8 }}
                className='seartch-btn'
              >
                {btnShrinkCount%2===0?'展开':'收起'}
              </Button> */}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

// class CommonSeatch extends React.Component {
//   constructor(props) {
//     super(props)
//   }
// }

export default withRouter(CommonSeatch)