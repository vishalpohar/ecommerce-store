import Address from "../models/address.model.js";
import ApiError from "../utils/ApiError.js";

export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      postalCode,
      country,
    } = req.body;
    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !addressLine?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !postalCode?.trim() ||
      !country?.trim()
    ) {
      return next(new ApiError(400, "All address fields are required"));
    }

    const addressData = {
      user: userId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    };

    const address = await Address.findOneAndUpdate(
      { user: userId },
      { $set: addressData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    return next(error);
  }
};
export const getAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const address = await Address.findOne({ user: userId });

    res.status(200).json({ success: true, address });
  } catch (error) {
    return next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const deleteAddress = await Address.findOneAndDelete({ user: req.user._id });
    
    if (!deleteAddress) {
      return next(new ApiError(404, "Address not found"));
    }

    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
