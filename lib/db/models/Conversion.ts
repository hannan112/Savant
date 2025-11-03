import mongoose, { Schema, Document } from 'mongoose';

export interface IConversion extends Document {
  conversionType: string;
  fromFormat: string;
  toFormat: string;
  fileName: string;
  fileSize: number;
  status: 'success' | 'failed';
  errorMessage?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversionSchema = new Schema<IConversion>(
  {
    conversionType: {
      type: String,
      required: true,
    },
    fromFormat: {
      type: String,
      required: true,
    },
    toFormat: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    errorMessage: {
      type: String,
    },
    userId: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    duration: {
      type: Number, // in milliseconds
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ConversionSchema.index({ createdAt: -1 });
ConversionSchema.index({ conversionType: 1 });
ConversionSchema.index({ status: 1 });

const Conversion = mongoose.models?.Conversion || mongoose.model<IConversion>('Conversion', ConversionSchema);
export default Conversion;
