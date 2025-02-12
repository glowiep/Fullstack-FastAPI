import { motion, AnimatePresence } from "framer-motion";
import { FC } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, description, onConfirm }) => {
  if (!isOpen) return null;

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
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:size-10">
                <svg
                  className="size-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-base font-semibold text-gray-900">{title || "Deactivate account"}</h3>
                <p className="mt-2 text-sm text-gray-500">{description || "Are you sure you want to add this behavior?"}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse">
            <button
              onClick={onConfirm}
              className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500"
            >
              Deactivate
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