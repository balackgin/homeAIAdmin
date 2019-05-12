import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Select, Button, TreeSelect, Input, Upload, Icon, message, Modal } from 'antd';
import { asyncUploadImage } from '../samples/service';
import Hashids from 'hashids';

const { Option } = Select;
const FormItem = Form.Item;

const stylesMap = {
  JP: '日式',
  SCANDINAVIAN: '北欧',
  KR: '韩式',
  MASHUP: '混搭',
  EUR: '欧式',
  CN: '中式',
  NEOCLASSICAL: '新古典',
  SE_ASIA: '东南亚',
  AM: '美式',
  PASTORAL: '田园',
  MODERN: '现代',
  MED: '地中海',
  OTHER: '其他'
};

class RegisterForm extends Component {
  static propTypes = {
    onRegister: PropTypes.func.isRequired
  };

  handleSubmit = e => {
    e.preventDefault();
    const { avatar, uploadImg } = this.state;
    const { onRegister, form: { validateFields } } = this.props;

    validateFields((err, values) => {
      if (err) {
        return 
      }

      if(avatar.length !== 0) {
        values.avatar = uploadImg;
      } else {
        values.avatar = '';
      }

      onRegister && onRegister({...values, cityCodes: values.cityCodes.slice(0, 10)});
    });
  }

  state = {
    previewVisible: false,
    previewImage: '',
    avatar: [],
    roomIdx: null,
    type: [],
    uploadImg: ''
  }

  validatePrice = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const maxPrice = getFieldValue('maxPrice');
    const minPrice = getFieldValue('minPrice');
    if (minPrice < 0 || minPrice > 5000) {
      callback('最低价超过区间');
    } else if (maxPrice < 0 || maxPrice > 5000) {
      callback('最高价超过区间');
    } else if (minPrice > maxPrice) {
      callback('价格有误');
    }
    callback();
  }

  getCityCodes = () => {
    const { cityCodes } = this.props;
    return cityCodes.map(province => {
      const { name, id, cities } = province
      return {
        title: name,
        value: id,
        key: name,
        selectable: false,
        children: cities.map(city => ({ title: city.name, value: city.id, key: city.name, selectable: true }))
      }
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
    let reader = new FileReader();
    const { userId } = this.props.user;
    const hashids = new Hashids(userId);
    const filename = hashids.encode(new Date().getTime());
    reader.readAsDataURL(file);
    asyncUploadImage({data: file, filename, type}).then(res => {
      this.setState({
        uploadImg: res
      })
    });
    reader.onloadend = () => {
      const imgList = [
        {
          uid: file.uid,
          name: file.name,
          status: file.status,
          type: file.type,
          url: reader.result
        }
      ];
      this.setState({
        [type]: imgList
      })
    }
    return false;
  }

  handleRemoveImage = (_, type) => {
    this.setState({
      [type]: []
    })
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      accept: "image/*",
      previewVisible: true,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const cityCodes = this.getCityCodes();
    const { avatar, previewVisible, previewImage } = this.state;
    const picdetail = {
      onPreview: this.handlePreview,
      listType: "picture-card"
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

    return (
      <Form
        className="personal-form"
        onSubmit={this.handleSubmit}
        hideRequiredMark={true}
      >
        <FormItem
            colon={false}
            label="头像"
            labelCol={{span: 6}}
            wrapperCol={{span: 14, offset: 2}}
          >
          {getFieldDecorator('avatar', {
            rules: [{
              required: true,
              message: '请选择上传头像'
            }]
          })(
            <Upload
              fileList={avatar}
              beforeUpload={file => this.beforeUpload(file, 'avatar')}
              onRemove={file => this.handleRemoveImage(file, 'avatar')}
              {...picdetail}
              style={{
                borderRadius: '50%',
                padding: 0,
                overflow: 'hidden'
              }}
            >
            {avatar.length >=1 ? null : uploadButton}
            </Upload>
          )}
          </FormItem>
          <FormItem
            colon={false}
            label="昵称"
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
          >
          {getFieldDecorator('nick', {
            rules: [{
              required: true,
              message: '昵称不能为空！'
            }]
          })(
            <Input placeholder="请输入昵称"/>
          )}
          </FormItem>
        <div className="design-price-range">
          
          <FormItem
            colon={false}
            className="input-price"
            label="设计价格"
            labelCol={{span: 10}}
            wrapperCol={{span: 14}}
          >
            {getFieldDecorator('minPrice', {
              rules: [{
                required: true,
                message: '最低价格'
              }, {
                validator: this.validatePrice
              }]
            })(
              <InputNumber placeholder="¥" min={0} className="minprice"/>
            )}
          </FormItem>
          <div className="bar"></div>
          <FormItem
            className="input-price"
          >
            {getFieldDecorator('maxPrice', {
              rules: [{
                required: true,
                message: '最高价格'
              }, {
                validator: this.validatePrice
              }]
            })(
              <InputNumber placeholder="¥" min={0} className="maxprice"/>
            )}
            元/m<sup>2</sup>
          </FormItem>
        </div>
        <FormItem
          colon={false}
          label="擅长风格"
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
        >
        {getFieldDecorator('styles', {
          rules: [{
            required: true,
            message: '请选择擅长风格'
          }]
        })(
          <Select
            mode="multiple"
            placeholder="请选择擅长风格"
            filterOption={(inputValue, option) => {
              return !option.props.children.indexOf(inputValue);
            }}
          >
          {
            Object.keys(stylesMap).map((stylesItem) => (
              <Option key={stylesItem} value={stylesItem} >{stylesMap[stylesItem]}</Option>
            ))
          }
          </Select>
        )}
        </FormItem>
        <FormItem
          colon={false}
          label="常驻地区"
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
        >
        {getFieldDecorator('cityCodes', {
          rules: [{
            required: true,
            message: '请选择常驻地区'
          }]
        })(
          <TreeSelect
            treeData={cityCodes}
            maxTagCount={10}
            maxTagPlaceholder={'最多只能选择十个常驻城市'}
            treeCheckable={true}
            dropdownStyle={{
              maxHeight: 260
            }}
          />
        )}
        </FormItem>
        <Modal visible={previewVisible} footer={null} onCancel={() => this.setState({previewVisible: false})}>
            <img alt="cover" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        <div className="register-btn">
          <FormItem>
            <Button htmlType="submit" type="primary">完成入驻</Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default Form.create()(RegisterForm);
