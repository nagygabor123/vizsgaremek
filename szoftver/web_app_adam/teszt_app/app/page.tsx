"use client";

import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    city: "",
    profession: "",
    hobby: "",
    experience: "",
    feedback: "",
  });

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFormSubmit = () => {
    console.log("Form Data:", formData);
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
    window.location.reload();
  };

  const handleClose = () => {
    setOverlayVisible(false);
  };

  if (isButtonVisible === null) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {isButtonVisible && (
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Mutasd az ablakot
        </button>
      )}

      {isOverlayVisible && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 relative">
            <div
              className="bg-blue-500 h-2 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>

          {/* Title and Steps */}
          <div className="flex flex-col items-start p-4">
            <h2 className="text-2xl font-bold mb-2">Step {step} / 5</h2>
          </div>

          {/* Form Content */}
          <div className="flex flex-col justify-center items-center flex-grow">
            {step === 1 && (
              <div className="w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Personal Info</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Additional Info</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your age"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Professional Info</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your profession"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Hobby</label>
                  <input
                    type="text"
                    name="hobby"
                    value={formData.hobby}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your hobby"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Experience</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Experience</label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Describe your experience"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Feedback</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Feedback</label>
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Share your feedback"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between w-full max-w-lg mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ml-auto"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="fixed bottom-4 left-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
