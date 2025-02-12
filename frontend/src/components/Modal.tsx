import { motion, AnimatePresence } from "framer-motion";
import { FC, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onConfirm?: (selectedMetrics: string[]) => void;
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, description, onConfirm }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleCheckboxChange = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const handleConfirm = () => {
    onConfirm?.(selectedMetrics);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-gray-500/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-20 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl sm:my-8"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-6">
            <div className="flex items-start">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:size-10">
                <svg
                    className="size-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0m3-2.383h.008v.008H15v-.008ZM8.25 18a.75.75 0 0 1-.75-.75V14.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 .75.75v2.75a.75.75 0 0 1-.75.75h-7.5ZM6 10.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"
                    />
                </svg>
            </div>
              <div className="ml-4 text-left">
                <h3 className="text-base font-semibold text-gray-900">{title || "Deactivate account"}</h3>
                <p className="mt-2 text-sm text-gray-500">{description || "Are you sure you want to add the selected behaviors?"}</p>
              </div>
            </div>

            {/* Checkboxes for behavior tracking metrics */}
            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes("attendance")}
                  onChange={() => handleCheckboxChange("attendance")}
                  className="mr-2"
                />
                Attendance
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes("participation")}
                  onChange={() => handleCheckboxChange("participation")}
                  className="mr-2"
                />
                Participation
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes("homework")}
                  onChange={() => handleCheckboxChange("homework")}
                  className="mr-2"
                />
                Homework Completion
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes("behavior")}
                  onChange={() => handleCheckboxChange("behavior")}
                  className="mr-2"
                />
                Positive Behavior
              </label>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse">
            <button
              onClick={handleConfirm}
              className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="mr-3 inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;