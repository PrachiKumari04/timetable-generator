import React from "react";





function Form() {
  const handleEntitySubmit = (e) => {
    e.preventDefault();
    const formData = entityForm[activeEntity] || {};

    // Basic required validation
    for (const field of currentEntityConfig.fields) {
      if (field.required && !String(formData[field.name] || "").trim()) {
        alert(`Please fill "${field.label}"`);
        return;
      }
    }

    const withId = {
      id: editingEntityId || generateId(),
      ...formData,
    };

    setMasterData((prev) => {
      const list = prev[activeEntity] || [];
      if (editingEntityId) {
        return {
          ...prev,
          [activeEntity]: list.map((item) =>
            item.id === editingEntityId ? withId : item,
          ),
        };
      }
      return {
        ...prev,
        [activeEntity]: [...list, withId],
      };
    });

    resetEntityForm();
  };
  return (
    <div>
      <form
        onSubmit={handleEntitySubmit}
        className="space-y-4 bg-gray-50 rounded-xl border border-gray-200 p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentEntityConfig.fields.map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>
              <input
                type="text"
                name={field.name}
                value={(entityForm[activeEntity] || {})[field.name] || ""}
                onChange={handleEntityInputChange}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          {editingEntityId && (
            <button
              type="button"
              onClick={resetEntityForm}
              className="px-3 py-2 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel edit
            </button>
          )}
          <button
            type="button"
            onClick={resetEntityForm}
            className="px-3 py-2 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {editingEntityId ? "Update" : "Add"} {currentEntityConfig.label}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
