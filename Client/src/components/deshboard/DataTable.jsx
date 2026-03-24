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
            <h3 className="text-xl font-semibold text-text">
                Existing {currentEntityConfig.pluralLabel}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm text-left text-text/80">
                    <thead className="text-xs text-text font-medium bg-surface-hover border-b border-border">
                        <tr>
                            {currentEntityConfig.fields.map((field) => (
                                <th key={field.name} className="px-6 py-4 font-semibold">
                                    {field.label}
                                </th>
                            ))}
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-surface'>
                        {entities?.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={currentEntityConfig.fields.length + 1}
                                    className="px-6 py-8 text-center text-text/60"
                                >
                                    No {currentEntityConfig.pluralLabel} found.
                                </td>
                            </tr>
                        ) : (
                            entities?.map((entity) => (
                                <tr
                                    key={entity._id || entity.id}
                                    className="border-b border-border hover:bg-surface-hover transition-colors"
                                >
                                    {currentEntityConfig.fields.map((field) => (
                                        <td key={field.name} className="px-6 py-4 text-text/90">
                                            {field.type === 'boolean' ? (entity[field.name] ? 'Yes' : 'No') : entity[field.name]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEditEntity(entity)}
                                            className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
                                            title="Edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEntity(entity._id || entity.id)}
                                            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100/50 border border-red-200 rounded-md hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/50"
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