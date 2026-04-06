import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Switch,
  Tag,
  Popconfirm,
  Modal,
  Card,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";

import {
  useAddCounteryMutation,
  useGetCountriesQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetLanguagesQuery,
} from "../../rtk/slices/apiMaster";
import { Loader } from "lucide-react";
import { CountryFlag } from "../../helper/countryFlags";

const { Option } = Select;

/* ---------------- Schema ---------------- */
const countrySchema = z.object({
  country_name: z.string().min(2, "Country name must be at least 2 characters"),
  code: z.string().regex(/^[A-Z]{2}$/, "Country code must be 2 uppercase letters"),
  url: z.string().url("Please enter a valid URL (starting with http/https)"),
  languages: z.array(z.string()).optional(),
  is_active: z.boolean(),
});

const CountryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- API ---------------- */
  const { data, isLoading } = useGetCountriesQuery();
  const countries = data?.data?.data || [];

  const { data: langData } = useGetLanguagesQuery();
  const languagesOptions = langData?.data?.languages || [];

  const [addCountry] = useAddCounteryMutation();
  const [updateCountry] = useUpdateCountryMutation();
  const [deleteCountry] = useDeleteCountryMutation();

  /* ---------------- Form ---------------- */
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      country_name: "",
      code: "",
      url: "",
      languages: [],
      is_active: true,
    },
  });

  /* ---------------- Modal ---------------- */
  const openAddModal = () => {
    setEditingCountry(null);
    reset({
      country_name: "",
      code: "",
      url: "",
      languages: [],
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCountry(record);
    reset({
      country_name: record.country_name,
      code: record.code,
      url: record.url,
      languages: record.languages?.map(l => l._id || l) || [],
      is_active: record.is_active,
    });
    setIsModalOpen(true);
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingCountry) {
        await updateCountry({
          id: editingCountry._id,
          payload: formData,
        }).unwrap();
        toast.success("Country updated successfully");
      } else {
        const res = await addCountry(formData).unwrap();
        toast.success(res?.message || "Country added successfully");
      }
      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Actions ---------------- */
  const handleDelete = async (id) => {
    try {
      await deleteCountry(id).unwrap();
      toast.success("Country deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  const handleToggleStatus = async (record) => {
    try {
      await updateCountry({
        id: record._id,
        payload: { is_active: !record.is_active },
      }).unwrap();
      toast.success("Status updated");
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  /* ---------------- Table ---------------- */
  const columns = [
    {
      title: "Flag",
      width: 80,
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <CountryFlag
            name={record.country_name}
            width={40}
            className="rounded-sm shadow-sm"
          />
        </div>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      width: 80,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Country Name",
      dataIndex: "country_name",
      sorter: (a, b) => a.country_name.localeCompare(b.country_name),
    },
    {
      title: "Languages",
      dataIndex: "languages",
      render: (langs) => (
        <div className="flex flex-wrap gap-1">
          {langs?.map((l) => (
            <Tag key={l._id || l} color="cyan">
              {l.language_name || "Unknown"}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      width: 100,
      render: (value, record) => (
        <Switch checked={value} onChange={() => handleToggleStatus(record)} />
      ),
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
          />
          <Popconfirm
            title="Delete country?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="px-6 py-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GlobalOutlined /> Country Management
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          size="large"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Country
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Active Countries</p>
          <h2 className="text-3xl font-bold mt-1 text-green-600">{countries.filter((c) => c.is_active).length}</h2>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Inactive Countries</p>
          <h2 className="text-3xl font-bold mt-1 text-amber-600">{countries.filter((c) => !c.is_active).length}</h2>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Total Registered</p>
          <h2 className="text-3xl font-bold mt-1 text-blue-600">{countries.length}</h2>
        </Card>
      </div>

      {/* Table */}
      <div className="shadow-sm rounded-lg overflow-hidden">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={countries}
          loading={isLoading}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingCountry ? "Edit Country Detail" : "Add New Country"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit(onSubmit)}
        confirmLoading={loading}
        width={600}
        destroyOnHidden
      >
        <div className="space-y-5 py-4">
          {/* Country Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
            <input
              className={`w-full border p-2 rounded ${errors.country_name ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              placeholder="e.g. United Arab Emirates"
              {...register("country_name")}
            />
            {errors.country_name && (
              <p className="text-red-500 text-xs mt-1">{errors.country_name.message}</p>
            )}
          </div>

          {/* Country Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ISO Code (2 Letters)</label>
            <input
              className={`w-full border p-2 rounded uppercase ${errors.code ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              placeholder="e.g. AE"
              maxLength={2}
              {...register("code")}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
            <input
              className={`w-full border p-2 rounded ${errors.url ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              placeholder="https://example.com/destinations/country"
              {...register("url")}
            />
            {errors.url && (
              <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>
            )}
          </div>

          {/* Languages Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relatated Languages</label>
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  mode="multiple"
                  placeholder="Select languages spoken in this country"
                  className="w-full"
                  allowClear
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {languagesOptions.map((lang) => (
                    <Option key={lang._id} value={lang._id}>
                      {lang.language_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Set as Active</span>
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  className={field.value ? "bg-blue-600" : ""}
                />
              )}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CountryManagement;
