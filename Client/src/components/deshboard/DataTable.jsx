import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditingEntityId, deleteMasterData } from '../../store/admin/adminSlice';

function DataTable({ currentEntityConfig, activeEntity }) {
    const dispatch = useDispatch();
    const masterData = useSelector((state) => state.admin.masterData);
    const entities = masterData[activeEntity] || [];

    const handleEditEntity = (entity) => {
        dispatch(setEditingEntityId(entity._id || entity.id));
    };

    const handleDeleteEntity = (id) => {
        if(window.confirm("Are you sure you want to delete this record?")) {
            dispatch(deleteMasterData({ entityKey: activeEntity, id }));
        }
    };

    if (!currentEntityConfig) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800">
                Existing {currentEntityConfig.pluralLabel}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 font-medium bg-slate-100 border-b border-slate-200">
                        <tr>
                            {currentEntityConfig.fields.map((field) => (
                                <th key={field.name} className="px-6 py-4 font-semibold">
                                    {field.label}
                                </th>
                            ))}
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {entities.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={currentEntityConfig.fields.length + 1}
                                    className="px-6 py-8 text-center text-slate-500"
                                >
                                    No {currentEntityConfig.pluralLabel} found.
                                </td>
                            </tr>
                        ) : (
                            entities.map((entity) => (
                                <tr
                                    key={entity._id || entity.id}
                                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                >
                                    {currentEntityConfig.fields.map((field) => (
                                        <td key={field.name} className="px-6 py-4 text-slate-700">
                                            {field.type === 'boolean' ? (entity[field.name] ? 'Yes' : 'No') : entity[field.name]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEditEntity(entity)}
                                            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 transition-colors"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEntity(entity._id || entity.id)}
                                            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 border border-red-200 rounded-md hover:bg-red-200 transition-colors"
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;