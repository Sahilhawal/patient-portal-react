import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, notification } from "antd";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import userAuth from "./user_auth";

const openNotification = (title, msg) => {
  notification.open({
    message: title,
    description: msg
  });
};

const auth_data = {
  users: [
    {
      id: "10",
      password: "1234",
      domain: "doctor",
      email: "Michael@office.com"
    },
    {
      id: "1",
      password: "1234",
      domain: "patient",
      email: "dwight@office.com"
    },
    {
      id: "2",
      password: "1234",
      domain: "patient",
      email: "James@office.com"
    }
  ]
};
const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};

const onFinishFailed = errorInfo => {
  console.log("Failed:", errorInfo);
};

class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    domain: "",
    id: ""
  };

  login = values => {
    var user_logging_in = auth_data.users.find(user => {
      return user.email === values.username;
    });
    if (!user_logging_in) {
      openNotification("Error", "User does not exist!");
      return false;
    }
    if (user_logging_in.password === values.password) {
      userAuth.authenticate(user_logging_in, () => {
        this.setState(
          () => ({
            redirectToReferrer: true,
            domain: user_logging_in.domain,
            id: user_logging_in.id
          }),
          this.props.user_login(user_logging_in)
        );
      });
    } else openNotification("Error", "Invalid Credentials");
  };
  render() {
    const { redirectToReferrer, domain, id } = this.state;
    if (redirectToReferrer === true) {
      if (domain === "doctor") return <Redirect to="/patientlist" />;
      if (domain === "patient") return <Redirect to={"/myprofile/" + id} />;
    }

    return (
      <div className="container">
        <h1>Sign In</h1>
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={this.login}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Email ID"
            name="username"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your email id!"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!"
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapPropsToState = dispatch => {
  return {
    user_login: data => {
      dispatch({ type: "USER_LOGIN", data: data });
    }
  };
};

export default connect(null, mapPropsToState)(Login);
