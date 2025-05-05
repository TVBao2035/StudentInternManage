import React, { useState, useEffect } from "react";
import { X, Search, ChevronLeft, Check } from "lucide-react";
import { getAllEmployee } from "../../../api/internAPI";
import { showErrorToast } from "../../../helpers/NotificationToast";

const Stepper = ({ activeStep, children }) => {
  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-green-500 transition-all duration-500"
          style={{
            width: `${
              (activeStep / (React.Children.count(children) - 1)) * 100
            }%`,
          }}
        ></div>
        {children}
      </div>
    </div>
  );
};

const Step = ({ isActive, isCompleted, onClick, label, children }) => {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <button
        onClick={onClick}
        className={`grid h-8 w-8 place-items-center rounded-full transition-all duration-300 ${
          isActive
            ? "bg-blue-500 text-white shadow-md"
            : isCompleted
            ? "bg-green-500 text-white"
            : "bg-white text-gray-500 shadow border border-gray-300"
        }`}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : children}
      </button>
      {label && (
        <span
          className={`mt-2 text-xs font-medium ${
            isActive
              ? "text-blue-500"
              : isCompleted
              ? "text-green-500"
              : "text-gray-500"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

const AssignmentStepperModal = ({
  isOpen,
  onClose,
  onSubmit,
  unassignedInterns = [],
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [internSearchTerm, setInternSearchTerm] = useState("");
  const [mentorSearchTerm, setMentorSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 3;
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;

  useEffect(() => {
    if (isOpen) {
      if (unassignedInterns && unassignedInterns.length > 0) {
        setInterns(unassignedInterns);
        setSelectedIntern(unassignedInterns[0]);
      } else {
        fetchInterns();
      }

      setActiveStep(0);
      setSelectedMentor(null);
      setInternSearchTerm("");
      setMentorSearchTerm("");

      fetchMentors();
    }
  }, [isOpen, unassignedInterns]);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const response = await getAllEmployee();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        const internData = response.data.data
          .filter((employee) => employee.type === 0)
          .map((intern) => ({
            id: intern.id,
            name: intern.user.name,
            email: intern.user.email,
            user: intern.user,
          }));

        setInterns(internData);

        if (internData.length > 0) {
          setSelectedIntern(internData[0]);
        }
      } else {
        setError(response?.data?.message || "Error loading intern list");
      }
    } catch (err) {
      console.error("Error fetching interns:", err);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await getAllEmployee();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        const mentorData = response.data.data
          .filter((employee) => employee.type === 1)
          .map((mentor) => ({
            id: mentor.id,
            name: mentor.user.name,
            email: mentor.user.email,
            user: mentor.user,
          }));

        setMentors(mentorData);

        if (mentorData.length > 0 && !selectedMentor) {
          setSelectedMentor(mentorData[0]);
        }

        setError(null);
      } else {
        setError(response?.data?.message || "Error loading mentor list");
      }
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedIntern) {
      showErrorToast("Please select an intern");
      return;
    }
    if (activeStep === 1 && !selectedMentor) {
      showErrorToast("Please select a mentor");
      return;
    }

    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setActiveStep((cur) => cur - 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedIntern || !selectedMentor) {
      showErrorToast("Please select both an intern and a mentor");
      return;
    }

    onSubmit({
      internId: selectedIntern.id,
      internName: selectedIntern.name,
      internEmail: selectedIntern.email,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorEmail: selectedMentor.email,
    });

    setActiveStep(0);
    setSelectedIntern(null);
    setSelectedMentor(null);
  };

  const filteredInterns = interns.filter(
    (intern) =>
      intern.name.toLowerCase().includes(internSearchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(internSearchTerm.toLowerCase())
  );

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(mentorSearchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(mentorSearchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 animate-slideIn">
        <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-medium text-gray-700">
            Phân công người hướng dẫn
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none rounded-full hover:bg-gray-100 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-10 pt-6 pb-4 bg-gray-50">
          <Stepper activeStep={activeStep}>
            <Step
              isActive={activeStep === 0}
              isCompleted={activeStep > 0}
              onClick={() => activeStep > 0 && setActiveStep(0)}
              label="Thực tập sinh"
            >
              1
            </Step>
            <Step
              isActive={activeStep === 1}
              isCompleted={activeStep > 1}
              onClick={() => activeStep > 1 && setActiveStep(1)}
              label="Người hướng dẫn"
            >
              2
            </Step>
            <Step
              isActive={activeStep === 2}
              isCompleted={false}
              onClick={() => {}}
              label="Xác nhận"
            >
              3
            </Step>
          </Stepper>
        </div>

        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-10 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeStep === 0 && (
                <div className="animate-fadeIn">
                  <h4 className="font-medium text-md mb-3 text-gray-700">
                    Chọn thực tập sinh
                  </h4>
                  <div className="mb-3 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      value={internSearchTerm}
                      onChange={(e) => setInternSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md shadow-inner">
                    {filteredInterns.length === 0 ? (
                      <div className="p-4 text-center text-gray-600">
                        {internSearchTerm
                          ? "Không tìm thấy thực tập sinh phù hợp"
                          : "Không có thực tập sinh nào chưa được phân công"}
                      </div>
                    ) : (
                      <div>
                        {filteredInterns.map((intern) => (
                          <div
                            key={intern.id}
                            className={`p-3 border-b hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
                              selectedIntern?.id === intern.id
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => setSelectedIntern(intern)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {intern.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {intern.email}
                                </p>
                              </div>
                              <div className="flex items-center justify-center w-5 h-5 border rounded-full border-blue-500 mr-2">
                                {selectedIntern?.id === intern.id && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="animate-fadeIn">
                  <h4 className="font-medium text-md mb-3 text-gray-700">
                    Chọn người hướng dẫn
                  </h4>
                  <div className="mb-3 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      value={mentorSearchTerm}
                      onChange={(e) => setMentorSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md shadow-inner">
                    {filteredMentors.length === 0 ? (
                      <div className="p-4 text-center text-gray-600">
                        {mentorSearchTerm
                          ? "Không tìm thấy người hướng dẫn phù hợp"
                          : "Không có người hướng dẫn nào"}
                      </div>
                    ) : (
                      <div>
                        {filteredMentors.map((mentor) => (
                          <div
                            key={mentor.id}
                            className={`p-3 border-b hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
                              selectedMentor?.id === mentor.id
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => setSelectedMentor(mentor)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {mentor.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {mentor.email}
                                </p>
                              </div>
                              <div className="flex items-center justify-center w-5 h-5 border rounded-full border-blue-500 mr-2">
                                {selectedMentor?.id === mentor.id && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="animate-fadeIn">
                  <h4 className="font-medium text-md mb-3 text-gray-700">
                    Xác nhận phân công
                  </h4>

                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-3">
                    <h5 className="font-medium text-gray-700 mb-1">
                      Thực tập sinh
                    </h5>
                    <p className="font-medium text-blue-500">
                      {selectedIntern?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedIntern?.email}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h5 className="font-medium text-gray-700 mb-1">
                      Người hướng dẫn
                    </h5>
                    <p className="font-medium text-blue-500">
                      {selectedMentor?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedMentor?.email}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t bg-gray-50 rounded-b-lg flex justify-between">
          <div>
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Quay lại
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                Tiếp tục
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                Phân công
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AssignmentStepperModal;
