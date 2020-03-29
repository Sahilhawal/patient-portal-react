import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Select, DatePicker, Col } from "antd";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;
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
const dateFormat = "YYYY/MM/DD";

const Demo_form = props => {
  const [fields, setFields] = useState([{ value: null }]);
  const [meds, setMeds] = useState([{ meds: null }]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.patients) {
      form.setFieldsValue({
        name: props.patients.name,
        email: props.patients.email,
        age: props.patients.age,
        gender: props.patients.gender,
        date_of_birth: moment(props.patients.date_of_birth),
        date_of_last_visit: moment(props.patients.date_of_last_visit)
      });
      setFields(props.patients.symptoms);
      setMeds(props.patients.medicines);
    }
  }, []);
  const onFinish = values => {
    values.date_of_birth = values.date_of_birth.format("YYYY/MM/DD");
    values.date_of_last_visit = values.date_of_last_visit.format("YYYY/MM/DD");
    values.id = props.patients.id;
    values.symptoms = fields;
    values.medicines = meds;
    props.edit_patient(values);
    props.history.push("/patientlist");
  };

  function handleChange(i, event) {
    const values = [...fields];
    values[i].value = event.target.value;
    setFields(values);
  }

  function handleAdd() {
    const values = [...fields];
    values.push({ value: null });
    setFields(values);
  }

  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }

  function handleMedChange(i, event) {
    const values = [...meds];
    values[i].meds = event.target.value;
    setMeds(values);
  }

  function handleMedAdd() {
    const values = [...meds];
    values.push({ meds: null });
    setMeds(values);
  }

  function handleMedRemove(i) {
    const values = [...meds];
    values.splice(i, 1);
    setMeds(values);
  }

  const config = {
    rules: [{ type: "object", required: true, message: "Please select time!" }]
  };

  return (
    <Col span={12} offset={6}>
      <h1>Edit Patient</h1>
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="age" label="Age">
          <Input type="number" min={1} max={100} />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item name="symptoms" label="Symptoms">
          <Button
            type="primary"
            style={{ margin: "0px 0px 20px 5px" }}
            onClick={() => handleAdd()}
            shape="circle"
          >
            +
          </Button>
          {fields.map((field, idx) => {
            return (
              <div key={`${field}-${idx}`}>
                <Form.Item>
                  <div key={`${field}-${idx}`}>
                    <Search
                      onChange={e => handleChange(idx, e)}
                      placeholder="Add new symptoms"
                      onSearch={() => handleRemove(idx)}
                      value={field.value || ""}
                      enterButton="X"
                      style={{ width: 200 }}
                    />
                  </div>
                </Form.Item>
              </div>
            );
          })}
        </Form.Item>
        <Form.Item name="medicines" label="Medicines">
          <Button
            type="primary"
            style={{ margin: "0px 0px 20px 5px" }}
            onClick={() => handleMedAdd()}
            shape="circle"
          >
            +
          </Button>

          {meds.map((field, idx) => {
            return (
              <Form.Item>
                <div key={`${field}-${idx}`}>
                  <Search
                    onChange={e => handleMedChange(idx, e)}
                    placeholder="input search text"
                    value={field.meds || ""}
                    onSearch={() => handleMedRemove(idx)}
                    enterButton="X"
                    style={{ width: 200 }}
                  />
                </div>
              </Form.Item>
            );
          })}
        </Form.Item>
        <Form.Item name="date_of_birth" label="Date of Birth" {...config}>
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="date_of_last_visit" label="Last Visited" {...config}>
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.gender !== currentValues.gender
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("gender") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form>
    </Col>
  );
};

const mapPropsToState = dispatch => {
  return {
    edit_patient: data => {
      dispatch({ type: "EDIT_PATIENT", data: data });
    }
  };
};
const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  return {
    patients: state.patients.patients.find(patient => patient.email === id)
  };
};

export default connect(mapStateToProps, mapPropsToState)(Demo_form);
