import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";

import AddressForm from "./AddressForm";
import { useAddressStore } from "../../stores/useAddressStore";

const ShippingAddress = ({ address, loading }) => {
  const [showForm, setShowForm] = useState(false);

  const { deleteAddress, deletingAddress } = useAddressStore();

  const handleDelete = async () => {
    const success = await deleteAddress();

    if (success) {
      setShowForm(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-500">Loading shipping address...</p>
      </div>
    );
  }

  if (!address || showForm) {
    return (
      <AddressForm
        address={showForm ? address : null}
        onCancel={showForm && address ? () => setShowForm(false) : undefined}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />

          <h2 className="text-lg font-semibold text-gray-900">
            Shipping Address
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
            <Pencil className="w-4 h-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deletingAddress}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50">
            <Trash2 className="w-4 h-4" />
            {deletingAddress ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>

      <div className="flex gap-3 p-4 border border-blue-500 bg-blue-50/50 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{address.fullName}</p>

          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            {address.addressLine}
            <br />
            {address.city}, {address.state} - {address.postalCode}
            <br />
            {address.country}
          </p>

          <p className="text-sm text-gray-500 mt-2">Phone: {address.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
