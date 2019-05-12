import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon } from 'antd';

const FormItem = Form.Item;

const DEFAUL_INIT_COUNT = 60;

class LoginForm extends Component {
  static propTypes = {
    onSaveVerifyCode: PropTypes.func,
    onSendCode: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.countdown = false; // 手机号校验通过且没有倒计时进行中的前提下才能点击“发送验证码”
    this.timer = null;
    this.state = {
      counting: DEFAUL_INIT_COUNT,
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  checkEnableCode = () => {
    const { getFieldValue } = this.props.form;

    const phoneNo = getFieldValue('phoneNo');
    const reg = new RegExp(/^1[0-9]\d{9}$/);

    return reg.test(phoneNo) && !this.countdown;
  }

  sendCode = () => {
    const phoneNo = this.props.form.getFieldValue('phoneNo');
    this.countdown = true;

    // 发送验证码
    this.props.onSendCode && this.props.onSendCode({ phone: phoneNo });
    // 触发倒计时
    this.tick();
  }

  tick = () => {
    this.timer = setTimeout(() => {
      const newTime = Math.max(0, this.state.counting - 1);
      if (newTime <= 0) {
        clearTimeout(this.timer);
        this.countdown = false;
        this.setState({
          counting: DEFAUL_INIT_COUNT,
        });
      } else {
        this.setState({
          counting: newTime,
        });
        this.tick();
      }
    }, 1000);
  }

  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const verifyCode = this.props.form.getFieldValue('code');
    // const values = this.props.form.getFieldsValue();
    this.props.onSaveVerifyCode && this.props.onSaveVerifyCode(verifyCode);
  }

  render() {
    const { counting } = this.state;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const enable = this.checkEnableCode();

    const phoneNoError = isFieldTouched('phoneNo') && getFieldError('phoneNo');
    const codeError = isFieldTouched('code') && getFieldError('code');

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem
          validateStatus={phoneNoError ? 'error' : ''}
          help={phoneNoError || ''}
        >
          {getFieldDecorator('phoneNo', {
            rules: [
              { required: true, message: '手机号必填' },
              { pattern: /^1[0-9]\d{9}$/, message: '请输入正确的手机号码' },
            ],
          })(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
          )}
        </FormItem>
        <FormItem
          className="signup-code"
          validateStatus={codeError ? 'error' : ''}
          help={codeError || ''}
        >
          {getFieldDecorator('code', {
            rules: [
              { required: true, message: '验证码必填' },
              { pattern: /^[0-9]\d{5}$/, message: '请输入完整的验证码' },
            ],
          })(
            <Input className="signup-code-input" placeholder="输入验证码" />
          )}
          <Button className="signup-code-btn" type="primary" disabled={!enable} onClick={this.sendCode}>
            发送验证码
            { !this.countdown ? '' : `(${counting})` }
          </Button>
        </FormItem>
        <FormItem>
          <Button
            className="signup-next-step-btn"
            htmlType="submit"
            type="primary"
            disabled={this.hasErrors(getFieldsError())}
          >
            下一步
          </Button>
        </FormItem>
      </Form>
    );
  }
};

export default Form.create()(LoginForm);