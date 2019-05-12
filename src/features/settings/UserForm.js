import React, { Component } from 'react';
import { Button, Form, Select, InputNumber, TreeSelect, Upload, Icon, Modal, message, Input } from 'antd';
import styled from 'styled-components';

import getAvatarUrl from '../common/utils/avatar';
import { asyncUploadImage } from '../samples/service';
import Hashids from 'hashids';

const FormItem = Form.Item;
const { Option } = Select;
const InputCon = styled.div`
  display: flex;
  line-height: 30px;
`;

class UserForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const { avatar, uploadImg } = this.state;
    
    this.props.form.validateFields((err, values) => {
      if (err) {
        return 
      }

      if(avatar.length !== 0) {
        values.avatar = uploadImg;
      } else {
        values.avatar = '';
      }


      this.props.saveUserInfo({...values, type: 'designer', cityCodes: values.cityCodes.slice(0, 10)});
    });
  }

  editHandle = () => {
    this.props.editHandleClick();
  }
  
  state = {
    previewVisible: false,
    previewImage: '',
    avatar: [],
    uploadImg: ''
  };

  validatePrice = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const maxPrice = getFieldValue('maxPrice');
    const minPrice = getFieldValue('minPrice');
    if (minPrice < 0 || minPrice > 5000) {
      callback('最低价格超过区间');
    } else if (maxPrice < 0 || maxPrice > 5000) {
      callback('最高价格超过区间');
    } else if (minPrice >= maxPrice) {
      callback('价格有误');
    }
    callback();
  }

  getCityCodes = () => {
    const { cityCodes } = this.props;
    return cityCodes.map(province => {
      const { name, id, cities } = province
      return {
        label: name,
        value: id,
        children: cities.map(city => ({ label: city.name, value: city.id }))
      }
    })
  }

  componentDidMount () {
    const { avatar } = this.props.userInfo;
    this.setState({
      avatar: [{
        uid: -1,
        status: 'done',
        name: 'avatar',
        url: getAvatarUrl(avatar, 400)
      }],
    })
  }

  beforeUpload = (file, type) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大不超过 2MB!');
      return isLt2M;
    }
    if(file.type === 'image/bmp' || file.type === 'image/jpeg' || 
      file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png') {
    } else {
      message.error('头像上传仅支持BMP、JPEG、JPG、GIF、PNG格式')
      return false;
    }
    const userId = this.props.userInfo.id;
    const hashids = new Hashids(userId);
    const filename = hashids.encode(new Date().getTime());
    let reader = new FileReader();
    reader.readAsDataURL(file);

    asyncUploadImage({data: file, type, filename}).then(v => {
      this.setState({
        uploadImg: v
      })
    })
    reader.onloadend = () => {
      const imgList = [
        {
          uid: file.uid,
          name: file.name,
          type: file.type,
          url: reader.result
        }
      ];
      this.setState({
        [type]: imgList,
      })
    }
    return false;
  }

  handleRemoveImage = (_, type) => {
    this.setState({
      [type]: [],
    })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      minPrice = 0,
      maxPrice = 0,
      nick = '',
    } = this.props.userInfo;
    const { avatar, previewVisible, previewImage } = this.state;
    const defaultCitys = this.getCityCodes();
    const { initStyles = [], stylesMap, districtCodes } =  this.props.mapObject;
    const picdetail = {
      onPreview: this.handlePreview,
      accept: "image/*",
      listType: "picture-card"
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

    return (
      <Form layout="inline" className="personal-form" onSubmit={this.handleSubmit} hideRequiredMark={true}>
        <div className="person-msg">
          <FormItem>
            {getFieldDecorator('avatar', {
              initialValue: avatar,
            })(
              <Upload
                fileList={avatar}
                beforeUpload={file => this.beforeUpload(file, 'avatar')}
                onRemove={file => this.handleRemoveImage(file, 'avatar')}
                {...picdetail}
                style={{
                  borderRadius: '50%',
                  height: '60px',
                  width: '60px',
                  margin: '0 auto'
                }}
              >
              {avatar.length >=1 ? null : uploadButton}
              </Upload>
            )}
            
          </FormItem>
          <FormItem style={{width: '100%'}} className="nick-form">{getFieldDecorator('nick', {
            initialValue: nick,
            rules:[{
              required: true,
              message: '昵称不能为空！'
            }]
          })(
          <Input type="text" placeholder="请输入昵称" className="user-nick" />
          )}
          </FormItem>
          <span>设计师</span>
        </div>
        
        <div className="personal-form-table">
          <div className="personal-form-submit">
            <Button type="default" className="cancle" onClick={this.editHandle}>取消</Button>
            <Button type="primary" htmlType="submit" className="submit">保存</Button>
            <div className="warning">资料将影响您的项目分配，请确认后再修改哦!</div>
          </div>
          <InputCon>
            <FormItem label="设计价格" style={{width: '68px'}}></FormItem>
            <FormItem
              className="input-price"
              label="设计价格"
              >
              {getFieldDecorator('minPrice', {
                initialValue: minPrice,
                rules: [{
                  required: true,
                  message: '请输入最低价格'
                },{
                  validator: this.validatePrice
                }]
              })(
                <InputNumber placeholder="¥" min={0} max={5000} className="minprice"/>
              )}
            </FormItem>
            -
            <FormItem className="input-price">
              {getFieldDecorator('maxPrice', {
                initialValue: maxPrice,
                rules: [{
                  required: true,
                  message: '请输入最高价格'
                },{
                  validator: this.validatePrice
                }]
              })(
                <InputNumber placeholder="¥" min={0} max={5000} className="maxprice"/>
              )}
              元/m<sup>2</sup>
            </FormItem>
          </InputCon>
          <FormItem
            label="案例风格"
            labelCol={{span:6}}
            wrapperCol={{span:17, offset:1}}
            hideRequiredMark={true}
          >
          {getFieldDecorator('styles', {
            initialValue: initStyles,
            rules: [{
              required: true,
              message: '请选择风格'
            }]
          })(
            <Select
              mode="multiple"
              style={{ width: '220px' }}
              placeholder="请选择案例风格"
            >
            {
              Object.keys(stylesMap).map((styleItem) => (
                <Option key={styleItem} >{stylesMap[styleItem]}</Option>
              ))
            }
            </Select>
          )}
          </FormItem>
          <FormItem
            label="常驻地区"
            labelCol={{span:6}}
            wrapperCol={{span:17, offset:1}}
          >
          {getFieldDecorator('cityCodes', {
            rules: [{
              required: true,
              message: '请选择常驻地区'
            }],
              initialValue: districtCodes
          })(
            <TreeSelect 
              placeholder="请选择常驻地区"
              treeData={defaultCitys}
              maxTagCount={10}
              maxTagPlaceholder={'最多只能选择十个常驻城市'}
              dropdownStyle={{
                maxHeight: 260
              }}
              style={{ width: 220 }}
              treeCheckable={true} />
          )}
          </FormItem>
          <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible: false})}>
            <img alt="cover" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Form>
    );
  }
}
const PersonalForm= Form.create()(UserForm);

export default PersonalForm;
