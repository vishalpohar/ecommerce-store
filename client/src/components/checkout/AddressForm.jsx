import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { useAddressStore } from "../../stores/useAddressStore";

const initialFormData = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const AddressForm = ({ address, onCancel, onSuccess }) => {
  const { addAddress, addingAddress } = useAddressStore();

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine: address.addressLine || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "India",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await addAddress(formData);

    if (success) {
      onSuccess?.();
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {address ? "Edit Address" : "Add Shipping Address"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter your delivery details.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close address form">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={inputClass}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            name="addressLine"
            value={formData.addressLine}
            onChange={handleChange}
            placeholder="House number, street, area"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={addingAddress}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-5 py-3 rounded-xl transition">
          <Save className="w-4 h-4" />
          {addingAddress
            ? "Saving..."
            : address
              ? "Update Address"
              : "Save Address"}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
