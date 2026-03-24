import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMasterData, updateMasterData, setEditingEntityId, clearError } from '../../store/admin/adminSlice';

function Form({ currentEntityConfig, activeEntity }) {
    const dispatch = useDispatch();
    const editingEntityId = useSelector((state) => state.admin.editingEntityId);
    const masterData = useSelector((state) => state.admin.masterData);

    const [entityForm, setEntityForm] = useState({});

    useEffect(() => {
        if (editingEntityId && activeEntity && masterData[activeEntity]) {
            const entityToEdit = masterData[activeEntity].find(e => e._id === editingEntityId || e.id === editingEntityId);
            if (entityToEdit) {
                setEntityForm(entityToEdit);
            }
        } else {
            setEntityForm({});
        }
    }, [editingEntityId, activeEntity, masterData]);

    const handleEntityInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEntityForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetEntityForm = () => {
        setEntityForm({});
        dispatch(setEditingEntityId(null));
        dispatch(clearError());
    };

    const handleEntitySubmit = (e) => {
        e.preventDefault();
        if (editingEntityId) {
            dispatch(updateMasterData({ entityKey: activeEntity, id: editingEntityId, data: entityForm }))
                .unwrap()
                .then(() => resetEntityForm())
                .catch((err) => console.error("Update failed", err));
        } else {
            dispatch(addMasterData({ entityKey: activeEntity, data: entityForm }))
                .unwrap()
                .then(() => resetEntityForm())
                .catch((err) => console.error("Add failed", err));
        }
    };

    if (!currentEntityConfig) return null;

    return (
        <form
            onSubmit={handleEntitySubmit}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                    {editingEntityId ? `Edit ${currentEntityConfig.label}` : `Add New ${currentEntityConfig.label}`}
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEntityConfig.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            {field.label}
                            {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>
                        {field.type === 'boolean' ? (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    checked={entityForm[field.name] || false}
                                    onChange={handleEntityInputChange}
                                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-slate-600">Is Active</span>
                            </div>
                        ) : (
                            <input
                                type="text"
                                name={field.name}
                                value={entityForm[field.name] || ""}
                                onChange={handleEntityInputChange}
                                placeholder={field.placeholder}
                                required={field.required}
                                className="w-full px-4 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-4 pt-5 mt-6 border-t border-slate-200">
                {editingEntityId && (
                    <button
                        type="button"
                        onClick={resetEntityForm}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => setEntityForm({})}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                >
                    Clear
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                    {editingEntityId ? "Update" : "Add"} {currentEntityConfig.label}
                </button>
            </div>
        </form>
    );
}

export default Form;