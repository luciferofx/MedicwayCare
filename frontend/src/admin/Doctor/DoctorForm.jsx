import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Switch,
  Row,
  Col,
  Divider,
  Upload,
  message,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetDropDownQuery,
  useGetConteryDropDownQuery
} from "../../rtk/slices/subcategoryApi";
import { CountryFlag } from "../../helper/countryFlags";

const { Step } = Steps;
const { TextArea } = Input;

const DoctorForm = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: categoryRes, isLoading } = useGetDropDownQuery();
  const categories = categoryRes?.data || [];
  const { data: counteryData, isLoading: isCountery } = useGetConteryDropDownQuery();
  const countery = counteryData?.data || [];

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [galleryFileList, setGalleryFileList] = useState([]);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        if (initialValues.categoryId) {
          handleCategoryChange(initialValues.categoryId);
        }
      } else {
        form.resetFields();
      }
      setStep(0);
      setImageFileList([]);
      setGalleryFileList([]);
    }
  }, [open, initialValues, form]);

  const handleCategoryChange = (categoryId) => {
    const category = categories.find((c) => c._id === categoryId);
    setSelectedCategory(categoryId);
    setSubcategories(category?.subcategories || []);
    form.setFieldsValue({ subCategoryId: [] });
  };

  const next = async () => {
    try {
      const fieldsToValidate = step === 0
        ? ['name', 'categoryId', 'conteryId']
        : [];

      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }
      setStep(step + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const prev = () => setStep(step - 1);

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // Transition to standard JSON submission
      const payload = {
        ...values,
        is_active: values.is_active ?? true,
      };

      await onSubmit(payload);
      form.resetFields();
      setStep(0);
      message.success('Doctor saved successfully!');
    } catch (error) {
      message.error('Failed to save doctor');
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };




  // Upload props removed since we are using links now

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      title={initialValues ? "Edit Doctor" : "Add Doctor"}
      forceRender
    >
      <Steps current={step} className="mb-6">
        <Step title="Basic Info" />
        <Step title="Professional" />
        <Step title="Medical & Education" />
      </Steps>

      <Form layout="vertical" form={form} onFinish={handleFinish}>
        {/* ================================================= */}
        {/* STEP 1: BASIC INFO */}
        {/* ================================================= */}
        <Form.Item shouldUpdate noStyle>
          <div style={{ display: step === 0 ? "block" : "none" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Doctor Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter doctor name' }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email (Optional)"
                  name="email"
                  rules={[
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="doctor@example.com" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phone (Optional)"
                  name="phone"
                  rules={[
                    { pattern: /^[6-9]\d{9}$/, message: 'Invalid mobile number (10 digits, starting with 6-9)' }
                  ]}
                >
                  <Input placeholder="9876543210" maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Experience (Years)" name="experience">
                  <Input type="number" min={0} placeholder="0" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select
                    loading={isLoading}
                    placeholder="Select category"
                    onChange={handleCategoryChange}
                  >
                    {categories.map((cat) => (
                      <Select.Option key={cat._id} value={cat._id}>
                        {cat.category_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Country"
                  name="conteryId"
                  rules={[{ required: true, message: 'Please select country' }]}
                >
                  <Select loading={isCountery} placeholder="Select country">
                    {countery.map((country) => (
                      <Select.Option key={country._id} value={country._id}>
                        <span className="flex items-center gap-2">
                          <CountryFlag name={country.country_name} width={20} />
                          {country.country_name}
                        </span>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Sub Categories" name="subCategoryId">
              <Select
                mode="multiple"
                disabled={!selectedCategory}
                placeholder="Select subcategories (multiple allowed)"
              >
                {subcategories.map((sub) => (
                  <Select.Option key={sub._id} value={sub._id}>
                    {sub.subcategory_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Divider titlePlacement="left">Location Details</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Country" name={["location", "country"]}>
                  <Input placeholder="Country" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="State" name={["location", "state"]}>
                  <Input placeholder="State" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="City" name={["location", "city"]}>
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item label="Address" name={["location", "address"]}>
                  <TextArea rows={2} placeholder="Full address" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Zip Code" name={["location", "zipCode"]}>
                  <Input placeholder="400001" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Currently Working At" name="workAt">
              <Input placeholder="Hospital/Clinic name" />
            </Form.Item>

            <Form.Item
              label="Active Status"
              name="is_active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>

            <Divider titlePlacement="left">Images</Divider>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Profile Image URL" name="image" help="Paste the URL of the doctor's profile image">
                  <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>
              </Col>
            </Row>

            <Divider titlePlacement="left">Gallery Image URLs</Divider>
            <Form.List name="gallery">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-2">
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[{ required: true, message: 'Please enter image URL' }]}
                        >
                          <Input placeholder="https://example.com/gallery-image.jpg" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)} size="small" ghost>
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2 text-teal-600 border-teal-600">
                    Add Gallery Image URL
                  </Button>
                </>
              )}
            </Form.List>

          </div>
        </Form.Item>
        {/* ================================================= */}
        {/* STEP 2: PROFESSIONAL */}
        {/* ================================================= */}
        <Form.Item shouldUpdate noStyle>
          <div style={{ display: step === 1 ? "block" : "none" }}>
            <Form.Item label="About Doctor" name="about">
              <TextArea rows={4} placeholder="Brief description about the doctor's background and expertise" />
            </Form.Item>

            <Form.Item label="Work Experience" name="workExperience">
              <TextArea rows={4} placeholder="Detailed work experience and career history" />
            </Form.Item>

            <Divider titlePlacement="left">Medical Problems Treated</Divider>

            <Form.List name="medicalProblems">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-2">
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[{ required: true, message: 'Please enter medical problem' }]}
                        >
                          <Input placeholder="e.g., Heart Disease, Hypertension" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)} size="small">
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                    Add Medical Problem
                  </Button>
                </>
              )}
            </Form.List>

            <Divider titlePlacement="left">Medical Procedures Performed</Divider>

            <Form.List name="medicalProcedures">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-2">
                      <Col span={22}>
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[{ required: true, message: 'Please enter medical procedure' }]}
                        >
                          <Input placeholder="e.g., Bypass Surgery, Angioplasty" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger onClick={() => remove(name)} size="small">
                          X
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                    Add Medical Procedure
                  </Button>
                </>
              )}
            </Form.List>
          </div>

        </Form.Item>
        {/* ================================================= */}
        {/* STEP 3: MEDICAL & EDUCATION */}
        {/* ================================================= */}
        <Form.Item shouldUpdate noStyle>
          <div style={{ display: step === 2 ? "block" : "none" }}>
            <Divider titlePlacement="left">Education & Training</Divider>

            <Form.List name="educationAndTraining">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-3">
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "degree"]}
                          label="Degree"
                        >
                          <Input placeholder="MBBS, MD, etc." />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "institute"]}
                          label="Institute"
                        >
                          <Input placeholder="University/Institute name" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, "year"]}
                          label="Year"
                        >
                          <Input placeholder="2020" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button danger onClick={() => remove(name)} size="small">
                            X
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Education
                  </Button>
                </>
              )}
            </Form.List>

            <Divider titlePlacement="left">Honours & Awards</Divider>

            <Form.List name="honoursAndAwards">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row gutter={16} key={key} align="middle" className="mb-3">
                      <Col span={14}>
                        <Form.Item
                          {...restField}
                          name={[name, "title"]}
                          label="Award Title"
                        >
                          <Input placeholder="Award/Recognition name" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "year"]}
                          label="Year"
                        >
                          <Input placeholder="2023" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button danger onClick={() => remove(name)} size="small">
                            X
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Award
                  </Button>
                </>
              )}
            </Form.List>

            <Divider titlePlacement="left">YouTube Video (Optional)</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Video Title" name={["youtubeVideo", "title"]}>
                  <Input placeholder="Video title" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Video URL" name={["youtubeVideo", "url"]}>
                  <Input placeholder="https://youtube.com/watch?v=..." />
                </Form.Item>
              </Col>
            </Row>

          </div>
        </Form.Item>
        {/* ================================================= */}
        {/* FOOTER NAVIGATION */}
        {/* ================================================= */}
        <div className="flex justify-end gap-2 mt-6">
          {step > 0 && (
            <Button onClick={prev} disabled={loading}>
              Back
            </Button>
          )}
          {step < 2 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues ? 'Update Doctor' : 'Save Doctor'}
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default DoctorForm;