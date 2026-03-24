import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "/api/v1";

const ENTITY_ENDPOINTS = {
  program: "/programmes",
  course: "/courses",
  room: "/rooms",
  classes: "/classes",
  section: "/sections",
  subject: "/subjects",
  Specialization: "/specializations",
  faculty: "/faculties",
  student: "/students",
};

// Axios instance with credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchMasterData = createAsyncThunk(
  "admin/fetchMasterData",
  async (entityKey, { rejectWithValue }) => {
    try {
      const endpoint = ENTITY_ENDPOINTS[entityKey];
      if (!endpoint) throw new Error("Invalid entity key");
      const response = await apiClient.get(endpoint);
      return { entityKey, data: response.data.data || response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addMasterData = createAsyncThunk(
  "admin/addMasterData",
  async ({ entityKey, data }, { rejectWithValue }) => {
    try {
      const endpoint = ENTITY_ENDPOINTS[entityKey];
      const response = await apiClient.post(endpoint, data);
      
      return { entityKey, data: response.data.data || response.data };
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateMasterData = createAsyncThunk(
  "admin/updateMasterData",
  async ({ entityKey, id, data }, { rejectWithValue }) => {
    try {
      const endpoint = `${ENTITY_ENDPOINTS[entityKey]}/${id}`;
      const response = await apiClient.put(endpoint, data);
      console.log(response.data.message);

      return { entityKey, id, data: response.data.data || response.data };
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteMasterData = createAsyncThunk(
  "admin/deleteMasterData",
  async ({ entityKey, id }, { rejectWithValue }) => {
    try {
      const endpoint = `${ENTITY_ENDPOINTS[entityKey]}/${id}`;
      await apiClient.delete(endpoint);
      return { entityKey, id };
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  masterData: {},
  activeEntity: null,
  editingEntityId: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setActiveEntity: (state, action) => {
      state.activeEntity = action.payload;
      state.editingEntityId = null;
      state.error = null;
    },
    setEditingEntityId: (state, action) => {
      state.editingEntityId = action.payload;
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Master Data
      .addCase(fetchMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.masterData[action.payload.entityKey] = action.payload.data;
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Master Data
      .addCase(addMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMasterData.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.masterData[action.payload.entityKey]) {
            state.masterData[action.payload.entityKey] = [];
        }
        state.masterData[action.payload.entityKey].push(action.payload.data);
      })
      .addCase(addMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Master Data
      .addCase(updateMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMasterData.fulfilled, (state, action) => {
        state.loading = false;
        const { entityKey, id, data } = action.payload;
        const list = state.masterData[entityKey] || [];
        const index = list.findIndex((item) => item._id === id || item.id === id);
        if (index !== -1) {
          list[index] = data;
        }
      })
      .addCase(updateMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Master Data
      .addCase(deleteMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMasterData.fulfilled, (state, action) => {
        state.loading = false;
        const { entityKey, id } = action.payload;
        const list = state.masterData[entityKey] || [];
        state.masterData[entityKey] = list.filter((item) => item._id !== id && item.id !== id);
      })
      .addCase(deleteMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveEntity, setEditingEntityId, clearError } = adminSlice.actions;

export default adminSlice.reducer;