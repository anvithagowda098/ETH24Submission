"use client";

import React, { useState } from "react";
import { NextPage } from "next";
import jsQR from "jsqr";
import { groth16 } from "snarkjs";

// Type Definitions
type PaymentFormProps = {
  setLoginDetails: (details: LoginDetails) => void;
  setStep: (step: number) => void;
};

type QRScannerProps = {
  setStep: (step: number) => void;
};

type LoginDetails = {
  aadhar: string;
  creditCardNumber: string;
  cvv: string;
};

type QrData = {
  aadhar: string;
  credit_card: string;
  cvv: string;
  nonce: string;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ setLoginDetails, setStep }) => {
  const [formData, setFormData] = useState<LoginDetails>({
    aadhar: "",
    creditCardNumber: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setLoginDetails(updatedData);
    setFormData(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Enter Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: "aadhar", label: "Aadhar Number", value: formData.aadhar, placeholder: "Enter your Aadhar Number" },
            { id: "creditCardNumber", label: "Credit Card Number", value: formData.creditCardNumber, placeholder: "Enter your Credit Card Number" },
            { id: "cvv", label: "CVV", value: formData.cvv, placeholder: "Enter your CVV" },
          ].map(({ id, label, value, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">
                {label}
              </label>
              <input
                type="text"
                id={id}
                name={id}
                value={value}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={placeholder}
              />
            </div>
          ))}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const QRScanner: React.FC<QRScannerProps> = ({ setStep }) => {
  const [file, setFile] = useState<File | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setQrResult(null);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
          setQrResult(qrCode.data);
          setStep(1);
          console.log(qrCode.data);
        } else {
          setErrorMessage("No QR code found.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="px-5 py-12 bg-white shadow-md rounded-lg max-w-sm mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-neutral">Scan a QR Code</h1>
        <p className="text-neutral text-center opacity-75">Upload a file to scan a QR code or use a scanner.</p>
        <div className="space-y-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
          <button
            onClick={handleUpload}
            className="w-full py-2 px-4 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition duration-200"
          >
            {file ? "Upload and Scan" : "Choose File"}
          </button>
        </div>
        {file && <div className="text-sm text-gray-600 text-center mt-2">Selected file: {file.name}</div>}
        {errorMessage && <div className="text-red-500 text-sm mt-2 text-center">{errorMessage}</div>}
      </div>
    </div>
  );
};

const VerificationPage: NextPage = () => {
  const [step, setStep] = useState<number>(0);
  const [loginDetails, setLoginDetails] = useState<LoginDetails | null>(null);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <QRScanner setStep={setStep} />;
      case 1:
        return <PaymentForm setLoginDetails={setLoginDetails} setStep={setStep} />;
      case 2:
        return <div className="text-center">Verification Complete</div>;
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default VerificationPage;