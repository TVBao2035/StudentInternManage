export const mapStatusToFrontend = (backendStatus) => {
    switch (backendStatus) {
        case 0:
            return "PENDING";
        case 1:
            return "VIEWED";
        case 2:
            return "ACCEPTED";
        case -1:
            return "REJECTED";
        default: 
            return "PENDING";
    }
};

export const mapStatusToBackend = (frontendStatus) => {
    switch (frontendStatus) {
        case "PENDING":
            return 0;
        case "VIEWED":
            return 1;
        case "ACCEPTED":
            return 2;
        case "REJECTED":
            return -1;
        default:
            return 0;
    }
};

export const getStatusText = (status) => {
    switch (status) {
        case "PENDING":
            return "Đang gửi cho nhà tuyển dụng";
        case "VIEWED":
            return "Nhà tuyển dụng đã xem hồ sơ của bạn";
        case "REJECTED":
            return "Hồ sơ của bạn chưa phù hợp";
        case "ACCEPTED":
            return "Hồ sơ của bạn đã được chấp nhận";
        default:
            return "Không xác định";
    }
};

export const getStatusTextFromCode = (statusCode) => {
    return getStatusText(mapStatusToFrontend(statusCode));
};

export const getStatusColorClass = (status) => {
    switch (status) {
        case "PENDING":
            return "text-blue-500";
        case "VIEWED":
            return "text-orange-500";
        case "REJECTED":
            return "text-red-500";
        case "ACCEPTED":
            return "text-green-500";
        default:
            return "text-gray-500";
    }
};

export const getStatusBgClass = (status) => {
    switch (status) {
        case "PENDING":
            return "bg-blue-100 text-blue-800";
        case "VIEWED":
            return "bg-yellow-100 text-yellow-800";
        case "REJECTED":
            return "bg-red-100 text-red-800";
        case "ACCEPTED":
            return "bg-green-100 text-green-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export default { mapStatusToFrontend, mapStatusToBackend, getStatusText, getStatusTextFromCode, getStatusColorClass, getStatusBgClass };