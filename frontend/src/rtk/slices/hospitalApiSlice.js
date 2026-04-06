import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/baseQuery";

export const hospitalApi = createApi({
  reducerPath: "hospitalApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Hospital"],

  endpoints: (builder) => ({
    //  ADD HOSPITAL
    addHospital: builder.mutation({
      query: (formData) => ({
        url: "master-hospital/add",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["Hospital"],
    }),
    getHospitals: builder.query({
      query: (params) => ({
        url: "master-hospital/list",
        method: "GET",
        params,
      }),
      providesTags: ["Hospital"],
    }),

    //  GET SINGLE HOSPITAL
    getHospitalById: builder.query({
      query: (id) => ({
        url: `master-hospital/${id}`,
        method: "GET",
      }),
      providesTags: ["Hospital"],
    }),

    //  UPDATE DOCTOR
    updateHospital: builder.mutation({
      query: ({ id, formData }) => ({
        url: `master-hospital/update/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["Hospital"],
    }),


   

    //  DELETE HOSPITAL
    deleteHospital: builder.mutation({
      query: (id) => ({
        url: `master-hospital/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hospital"],
    }),
  }),
});

export const {
  useAddHospitalMutation,
  useGetHospitalsQuery,
  useGetHospitalByIdQuery,
  useUpdateHospitalMutation,
  useDeleteHospitalMutation,
} = hospitalApi;

