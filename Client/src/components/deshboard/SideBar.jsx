import React from 'react'

function SideBar({ ENTITY_CONFIG, masterData, activeEntity, setActiveEntity, setEditingEntityId }) {

    const MASTER_ENTITY_KEYS = Object.keys(ENTITY_CONFIG);

    const createEmptyMasterData = () =>
        MASTER_ENTITY_KEYS.reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {});



    return (
        <div className="space-y-4">
            <h2 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Master Entities
            </h2>
            <div className="space-y-1">
                {MASTER_ENTITY_KEYS.map((key) => {
                    const cfg = ENTITY_CONFIG[key];
                    const count = masterData[key]?.length || 0;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => {
                                setActiveEntity(key);
                                setEditingEntityId(null);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors duration-200 ease-in-out ${activeEntity === key
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            <span>{cfg.pluralLabel}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeEntity === key ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default SideBar