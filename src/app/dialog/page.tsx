"use client";

import React, { useState } from "react";

const Dialog = ({ title, content, actions, open, setOpen }) => {
  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-96 rounded bg-white p-6 shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className="mb-6">{content}</div>
          <div className="flex justify-end">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`mr-2 px-4 py-2 text-white ${
                  action.type === "confirm" ? "bg-blue-500" : "bg-gray-500"
                }`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`fixed inset-0  ${open ? "block" : "hidden"}`}
        onClick={() => setOpen(false)}
      ></div>
    </div>
  );
};

const App = () => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    // Your confirm logic here
    setOpen(false);
  };

  const handleCancel = () => {
    // Your cancel logic here
    setOpen(false);
  };

  const actions = [
    { label: "Confirm", type: "confirm", onClick: handleConfirm },
    { label: "Cancel", type: "cancel", onClick: handleCancel },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        className="bg-blue-500 px-4 py-2 text-white"
        onClick={() => setOpen(true)}
      >
        Open Dialog
      </button>
      <Dialog
        title="Dialog Title"
        content="Dialog Content"
        actions={actions}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default App;
